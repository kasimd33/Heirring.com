/**
 * Analytics Utility Functions
 * Aggregates and updates dashboard analytics
 */

import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Analytics from '../models/Analytics.js';
import mongoose from 'mongoose';

/**
 * Update analytics when jobs/applications change
 * @param {ObjectId} userId - User ID
 * @param {Object} delta - Changes to apply { totalJobs, activeJobs, totalApplications, hiringRate }
 */
export const updateAnalytics = async (userId, delta = {}) => {
  try {
    await Analytics.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalJobs: delta.totalJobs || 0,
          activeJobs: delta.activeJobs || 0,
          totalApplications: delta.totalApplications || 0,
          hiringRate: delta.hiringRate || 0,
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Analytics update error:', error.message);
  }
};

/**
 * Full aggregation of analytics from raw data
 * @param {ObjectId} userId - User ID
 */
export const aggregateAnalytics = async (userId) => {
  try {
    const jobIds = (await Job.find({ createdBy: userId }).select('_id')).map(
      (j) => j._id
    );

    const [totalJobs, activeJobs, totalApplications, hiredCount] = await Promise.all([
      Job.countDocuments({ createdBy: userId }),
      Job.countDocuments({ createdBy: userId, status: 'active' }),
      Application.countDocuments({ jobId: { $in: jobIds } }),
      Application.countDocuments({ jobId: { $in: jobIds }, status: 'hired' }),
    ]);

    const hiringRate = totalApplications > 0
      ? Math.round((hiredCount / totalApplications) * 100)
      : 0;

    // Monthly stats (last 6 months)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const [jobsPosted, applicationsReceived, hires] = await Promise.all([
        Job.countDocuments({
          createdBy: userId,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        Application.countDocuments({
          jobId: { $in: jobIds },
          appliedDate: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        Application.countDocuments({
          jobId: { $in: jobIds },
          status: 'hired',
          updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
      ]);

      monthlyStats.push({
        month: monthStr,
        jobsPosted,
        applicationsReceived,
        interviewsScheduled: 0, // Could add if tracked
        hires,
      });
    }

    await Analytics.findOneAndUpdate(
      { userId },
      {
        totalJobs,
        activeJobs,
        totalApplications,
        totalCandidates: await mongoose.model('Candidate').countDocuments(),
        hiringRate,
        monthlyStats,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Analytics aggregation error:', error.message);
  }
};
