/**
 * JobRecommendation Model
 * Stores pre-calculated job match scores for users
 */

import mongoose from 'mongoose';

const jobRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

jobRecommendationSchema.index({ userId: 1, matchScore: -1 });
jobRecommendationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('JobRecommendation', jobRecommendationSchema);
