/**
 * Dashboard Controller
 * Provides aggregated stats and analytics
 */

import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Analytics from '../models/Analytics.js';
import { aggregateAnalytics } from '../utils/analyticsUtils.js';

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get quick stats for dashboard cards
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get jobs created by user
    const jobFilter = req.user.role === 'admin' ? {} : { createdBy: userId };
    const jobIds = (await Job.find(jobFilter).select('_id')).map((j) => j._id);

    const [activeJobs, totalApplications, interviewsScheduled, totalCandidates] = await Promise.all([
      Job.countDocuments({ ...jobFilter, status: 'active' }),
      Application.countDocuments({ jobId: { $in: jobIds } }),
      Application.countDocuments({
        jobId: { $in: jobIds },
        status: { $in: ['interview', 'shortlisted'] },
      }),
      Candidate.countDocuments({}),
    ]);

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplications,
        interviewsScheduled,
        profileViews: totalCandidates, // Placeholder - could track separate metric
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get detailed analytics and trends
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Ensure analytics record exists
    let analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      analytics = await Analytics.create({ userId });
    }

    // Re-aggregate for fresh data
    await aggregateAnalytics(userId);
    const updated = await Analytics.findOne({ userId });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/dashboard/pipeline
 * @desc    Get hiring pipeline breakdown
 */
export const getPipeline = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobFilter = req.user.role === 'admin' ? {} : { createdBy: userId };
    const jobIds = (await Job.find(jobFilter).select('_id')).map((j) => j._id);

    const pipeline = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const stages = ['applied', 'screening', 'shortlisted', 'interview', 'rejected', 'hired'];
    const result = stages.map((stage) => {
      const found = pipeline.find((p) => p._id === stage);
      return { stage, count: found ? found.count : 0 };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
