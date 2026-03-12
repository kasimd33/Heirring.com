/**
 * Application Controller (ATS)
 * Manages job applications for both job seekers and recruiters
 */

import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import { updateAnalytics } from '../utils/analyticsUtils.js';
import { APPLICATION_STATUSES } from '../models/Application.js';

/**
 * @route   POST /api/applications
 * @desc    Create a new application (Step 1 of Apply flow - saves before redirect/form)
 */
export const createApplication = async (req, res, next) => {
  try {
    const { jobId, resumeURL, candidateName, candidateEmail, notes } = req.body;
    const userId = req.user?._id;

    if (!jobId) {
      res.status(400);
      throw new Error('Job ID is required');
    }

    const job = await Job.findById(jobId).lean();
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if user already applied
    const existingByUser = userId
      ? await Application.findOne({ jobId, userId })
      : null;
    if (existingByUser) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    // For internal jobs with form data, create/link Candidate
    let candidateId = null;
    if (job.source === 'internal' && (candidateEmail || candidateName)) {
      let candidate = await Candidate.findOne({ email: candidateEmail });
      if (!candidate) {
        candidate = await Candidate.create({
          name: candidateName || 'Applicant',
          email: candidateEmail,
        });
      }
      candidateId = candidate._id;
    }

    const application = await Application.create({
      userId: userId || null,
      jobId,
      candidateId: candidateId || undefined,
      jobTitle: job.title,
      company: job.company,
      location: job.location || '',
      resumeURL: resumeURL || null,
      status: 'applied',
      source: job.source || 'internal',
      externalApplyLink: job.externalApplyLink || null,
      notes: notes || '',
    });

    // Increment applicants count (internal jobs only)
    if (job.source === 'internal' && job.createdBy) {
      await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });
      await updateAnalytics(job.createdBy, { totalApplications: 1 });
    }

    const populated = await Application.findById(application._id)
      .populate('userId', 'name email')
      .populate('candidateId', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application (e.g. add notes, resume, candidate details from internal form)
 */
export const updateApplication = async (req, res, next) => {
  try {
    const { notes, resumeURL, candidateName, candidateEmail } = req.body;
    const app = await Application.findById(req.params.id).populate('jobId');

    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    const isApplicant = app.userId?.toString() === req.user._id.toString();
    const isRecruiter = await checkRecruiterAccess(req.user, app.jobId);
    if (!isApplicant && !isRecruiter) {
      res.status(403);
      throw new Error('Not authorized to update this application');
    }

    if (notes !== undefined) app.notes = notes;
    if (resumeURL !== undefined) app.resumeURL = resumeURL;

    // For internal jobs: create/link Candidate from name/email
    if (app.jobId?.source === 'internal' && (candidateName || candidateEmail)) {
      let candidate = candidateEmail ? await Candidate.findOne({ email: candidateEmail }) : null;
      if (!candidate) {
        candidate = await Candidate.create({
          name: candidateName || req.user?.name || 'Applicant',
          email: candidateEmail || req.user?.email,
        });
      }
      app.candidateId = candidate._id;
    }

    await app.save();

    const updated = await Application.findById(app._id)
      .populate('userId', 'name email')
      .populate('candidateId', 'name email')
      .lean();

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/me
 * @desc    Get all applications of the logged-in user (job seeker)
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const { status, keyword, jobId, fromDate, toDate, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (keyword) {
      query.$or = [
        { jobTitle: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') },
      ];
    }
    if (req.query.jobId) query.jobId = req.query.jobId;
    if (fromDate) query.appliedDate = { ...(query.appliedDate || {}), $gte: new Date(fromDate) };
    if (toDate) query.appliedDate = { ...query.appliedDate, $lte: new Date(toDate) };
    if (fromDate && toDate) query.appliedDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: applications,
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
 * @route   GET /api/applications
 * @desc    Get applications (recruiters: their jobs only; admins: all)
 */
export const getApplications = async (req, res, next) => {
  try {
    const { jobId, status, keyword, fromDate, toDate, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (keyword) {
      query.$or = [
        { jobTitle: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') },
      ];
    }
    if (fromDate) query.appliedDate = { ...(query.appliedDate || {}), $gte: new Date(fromDate) };
    if (toDate) query.appliedDate = { ...(query.appliedDate || {}), $lte: new Date(toDate) };
    if (fromDate && toDate) query.appliedDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };

    // Recruiters: only applications to their jobs
    if (req.user.role !== 'admin') {
      const userJobIds = (await Job.find({ createdBy: req.user._id }).select('_id'))
        .map((j) => j._id);
      if (userJobIds.length === 0) {
        return res.json({
          success: true,
          data: [],
          pagination: { page: 1, limit: Number(limit), total: 0, pages: 0 },
        });
      }
      query.jobId = jobId && userJobIds.some((id) => id.toString() === jobId)
        ? jobId
        : { $in: userJobIds };
    } else if (jobId) {
      query.jobId = jobId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('userId', 'name email')
        .populate('candidateId', 'name email skills')
        .populate('jobId', 'title company location')
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: applications,
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
 * @route   GET /api/applications/:id
 * @desc    Get single application by ID
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('candidateId', 'name email skills experience')
      .populate('jobId', 'title company location source externalApplyLink')
      .lean();

    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Check access: applicant or recruiter
    const jobIdVal = app.jobId?._id || app.jobId;
    const isApplicant = app.userId?._id?.toString() === req.user._id.toString();
    const isRecruiter = await checkRecruiterAccess(req.user, jobIdVal);
    if (!isApplicant && !isRecruiter) {
      res.status(403);
      throw new Error('Not authorized to view this application');
    }

    res.json({ success: true, data: app });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Update application status (recruiters only)
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!APPLICATION_STATUSES.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`);
    }

    const app = await Application.findById(req.params.id).populate('jobId');

    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    const isRecruiter = await checkRecruiterAccess(req.user, app.jobId);
    if (!isRecruiter) {
      res.status(403);
      throw new Error('Not authorized to update application status');
    }

    app.status = status;
    await app.save();

    const updated = await Application.findById(app._id)
      .populate('userId', 'name email')
      .populate('candidateId', 'name email')
      .populate('jobId', 'title company')
      .lean();

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/applications/:id/notes
 * @desc    Add/update interview notes (recruiters only)
 */
export const updateApplicationNotes = async (req, res, next) => {
  try {
    const { interviewNotes } = req.body;
    const app = await Application.findById(req.params.id);

    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    const isRecruiter = await checkRecruiterAccess(req.user, app.jobId);
    if (!isRecruiter) {
      res.status(403);
      throw new Error('Not authorized to add interview notes');
    }

    app.interviewNotes = interviewNotes ?? app.interviewNotes;
    await app.save();

    const updated = await Application.findById(app._id)
      .populate('userId', 'name email')
      .populate('candidateId', 'name email')
      .lean();

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/applications/:id
 * @desc    Withdraw application (applicant only)
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate('jobId');

    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    const isApplicant = app.userId?.toString() === req.user._id.toString();
    if (!isApplicant) {
      res.status(403);
      throw new Error('Only the applicant can withdraw this application');
    }

    if (app.status === 'offer' || app.status === 'interview') {
      // Optional: warn or block
    }

    await app.deleteOne();

    if (app.jobId?.createdBy && app.jobId?.source === 'internal') {
      await Job.findByIdAndUpdate(app.jobId._id, { $inc: { applicantsCount: -1 } });
    }

    res.json({ success: true, data: { message: 'Application withdrawn' } });
  } catch (error) {
    next(error);
  }
};

async function checkRecruiterAccess(user, jobId) {
  if (user.role === 'admin') return true;
  const job = await Job.findById(jobId).select('createdBy').lean();
  if (!job?.createdBy) return false;
  return job.createdBy.toString() === user._id.toString();
}
