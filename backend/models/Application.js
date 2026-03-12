/**
 * Application Model (ATS)
 * Tracks job applications - supports both user-based (job seekers) and candidate-based (legacy)
 * Works for internal jobs and external (Adzuna) jobs
 */

import mongoose from 'mongoose';

const APPLICATION_STATUSES = ['applied', 'under_review', 'interview', 'offer', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      default: null,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    resumeURL: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'applied',
    },
    source: {
      type: String,
      enum: ['internal', 'adzuna', 'external'],
      required: true,
    },
    externalApplyLink: {
      type: String,
      default: null,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    interviewNotes: {
      type: String,
      default: '',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true, sparse: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ userId: 1, appliedDate: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedDate: -1 });

applicationSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model('Application', applicationSchema);
export { APPLICATION_STATUSES };
