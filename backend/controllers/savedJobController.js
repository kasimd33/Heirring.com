/**
 * SavedJob Controller
 */

import SavedJob from '../models/SavedJob.js';
import Job from '../models/Job.js';

export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      res.status(400);
      throw new Error('jobId is required');
    }
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const existing = await SavedJob.findOne({ userId: req.user._id, jobId });
    if (existing) {
      return res.json({ success: true, data: existing, message: 'Already saved' });
    }
    const saved = await SavedJob.create({ userId: req.user._id, jobId });
    const populated = await SavedJob.findById(saved._id).populate('jobId', 'title company location');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const result = await SavedJob.deleteOne({ userId: req.user._id, jobId });
    if (result.deletedCount === 0) {
      res.status(404);
      throw new Error('Saved job not found');
    }
    res.json({ success: true, data: { message: 'Removed from saved' } });
  } catch (error) {
    next(error);
  }
};
