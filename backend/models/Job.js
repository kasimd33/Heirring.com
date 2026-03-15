/**
 * Job Model
 * Stores job postings - internal (from recruiters) and external (from Adzuna API)
 * Supports Indian job listings with salary, skills, category, postedDate
 */

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    skills: [{
      type: String,
      trim: true,
    }],
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'permanent', 'temporary'],
      default: 'full-time',
    },
    salaryRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'INR' },
      displayText: { type: String },
    },
    requiredSkills: [{
      type: String,
      trim: true,
    }],
    experienceRequired: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'paused'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ['internal', 'adzuna', 'external'],
      default: 'internal',
    },
    externalApplyLink: {
      type: String,
      default: null,
    },
    jobCategory: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: null,
    },
    postedDate: {
      type: Date,
      default: null,
    },
    externalId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
jobSchema.index({ title: 'text', description: 'text', company: 'text', jobCategory: 'text', category: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ createdBy: 1 });
jobSchema.index({ source: 1 });
// externalId index is auto-created by unique: true, sparse: true on the field - do not duplicate
jobSchema.index({ location: 1 });
jobSchema.index({ title: 1, company: 1, location: 1 }); // For duplicate detection
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ jobType: 1 });

export default mongoose.model('Job', jobSchema);
