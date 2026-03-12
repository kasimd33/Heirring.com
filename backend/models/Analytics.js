/**
 * Analytics Model
 * Stores aggregated dashboard metrics for reporting
 */

import mongoose from 'mongoose';

const monthlyStatSchema = new mongoose.Schema({
  month: { type: String, required: true }, // Format: "YYYY-MM"
  jobsPosted: { type: Number, default: 0 },
  applicationsReceived: { type: Number, default: 0 },
  interviewsScheduled: { type: Number, default: 0 },
  hires: { type: Number, default: 0 },
});

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalJobs: {
      type: Number,
      default: 0,
    },
    totalCandidates: {
      type: Number,
      default: 0,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    activeJobs: {
      type: Number,
      default: 0,
    },
    hiringRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    monthlyStats: [monthlyStatSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('Analytics', analyticsSchema);
