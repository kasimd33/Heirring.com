/**
 * SavedJob Model
 * Jobs bookmarked by job seekers
 */

import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    savedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('SavedJob', savedJobSchema);
