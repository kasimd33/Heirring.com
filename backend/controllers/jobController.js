/**
 * Job Controller
 * CRUD + search for job listings (internal + Adzuna)
 */

import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { updateAnalytics } from '../utils/analyticsUtils.js';

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting (internal only)
 */
export const createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    req.body.source = 'internal';
    const job = await Job.create(req.body);

    await updateAnalytics(req.user._id, { totalJobs: 1, activeJobs: 1 });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/jobs
 * @desc    Get jobs with filters: keyword, location, category, jobType, source, page, limit
 */
export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      jobType,
      source,
      status = 'active',
      page = 1,
      limit = 12,
      createdBy,
    } = req.query;

    const query = {};

    if (createdBy === 'me' && req.user) {
      query.createdBy = req.user._id;
    } else {
      query.status = status;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (category) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { jobCategory: new RegExp(category, 'i') },
          { category: new RegExp(category, 'i') },
        ],
      });
    }

    if (jobType) query.jobType = jobType;
    if (source) query.source = source;

    if (keyword) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: new RegExp(keyword, 'i') },
          { company: new RegExp(keyword, 'i') },
          { description: new RegExp(keyword, 'i') },
          { jobCategory: new RegExp(keyword, 'i') },
          { category: new RegExp(keyword, 'i') },
          { requiredSkills: new RegExp(keyword, 'i') },
          { skills: new RegExp(keyword, 'i') },
        ],
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('createdBy', 'name email company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/jobs/search
 * @desc    Alias for GET /api/jobs with same filters
 */
export const searchJobs = getJobs;

/**
 * @route   GET /api/jobs/:id
 * @desc    Get single job by ID
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email company').lean();

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.createdBy) {
      const applicantsCount = await Application.countDocuments({ jobId: job._id });
      job.applicantsCount = applicantsCount;
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update a job (internal only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.source !== 'internal') {
      res.status(403);
      throw new Error('External jobs cannot be edited');
    }

    if (job.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job (internal only)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.source !== 'internal') {
      res.status(403);
      throw new Error('External jobs cannot be deleted');
    }

    if (job.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();

    await updateAnalytics(job.createdBy, { totalJobs: -1, activeJobs: job.status === 'active' ? -1 : 0 });

    res.json({
      success: true,
      data: { message: 'Job deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};
