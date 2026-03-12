/**
 * Candidate Model
 * Stores candidate/job seeker profiles
 */

import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    experience: {
      years: { type: Number, default: 0 },
      summary: { type: String },
      details: [{
        company: String,
        role: String,
        period: String,
        description: String,
      }],
    },
    education: [{
      degree: String,
      school: String,
      year: String,
    }],
    location: {
      type: String,
      trim: true,
    },
    resumeURL: {
      type: String,
      default: null,
    },
    profileScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    validCredentials: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // If candidate has login, link to User
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
candidateSchema.index({ name: 'text', email: 'text', skills: 'text' });
candidateSchema.index({ 'experience.years': 1 });
candidateSchema.index({ profileScore: -1 });

export default mongoose.model('Candidate', candidateSchema);
