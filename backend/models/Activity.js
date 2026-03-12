/**
 * Activity Model
 * Tracks user activity history for audit/log
 */

import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'job_created',
        'job_updated',
        'job_deleted',
        'application_submitted',
        'status_changed',
        'candidate_viewed',
        'candidate_created',
      ],
    },
    entityType: {
      type: String,
      enum: ['Job', 'Application', 'Candidate'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityType',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
