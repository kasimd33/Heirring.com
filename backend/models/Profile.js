/**
 * Profile Model
 * Professional candidate profile - extends User for seekers
 */

import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'intermediate' },
});

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
}, { _id: true });

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startYear: { type: Number },
  endYear: { type: Number },
  grade: { type: String, trim: true },
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  certificateName: { type: String, required: true, trim: true },
  issuingOrganization: { type: String, trim: true },
  issueDate: { type: Date },
  credentialURL: { type: String, trim: true },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true, trim: true },
  description: { type: String },
  techStack: [{ type: String }],
  githubRepo: { type: String, trim: true },
  liveDemo: { type: String, trim: true },
}, { _id: true });

const jobPreferencesSchema = new mongoose.Schema({
  preferredJobRole: { type: String, trim: true },
  preferredLocation: { type: String, trim: true },
  expectedSalary: { type: String, trim: true },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', ''], default: '' },
  workMode: { type: String, enum: ['remote', 'hybrid', 'onsite', ''], default: '' },
});

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    professionalHeadline: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    portfolioLink: { type: String, trim: true, default: '' },
    linkedinLink: { type: String, trim: true, default: '' },
    githubLink: { type: String, trim: true, default: '' },
    openToWork: { type: Boolean, default: true },
    aboutText: { type: String, default: '' },
    careerGoals: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    skills: [skillSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
    projects: [projectSchema],
    resumeURL: { type: String, default: null },
    jobPreferences: { type: jobPreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
