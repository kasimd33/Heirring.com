/**
 * Database Seed Script
 * Populates MongoDB with sample data for testing
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import Application from '../models/Application.js';
import Analytics from '../models/Analytics.js';
import Message from '../models/Message.js';
import JobRecommendation from '../models/JobRecommendation.js';
import SavedJob from '../models/SavedJob.js';
import Profile from '../models/Profile.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heirrati';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await JobRecommendation.deleteMany({});
    await SavedJob.deleteMany({});
    await Application.deleteMany({});
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Analytics.deleteMany({});
    await Message.deleteMany({});
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Create users (password: password123)
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@heirrati.com',
        password: 'password123',
        role: 'admin',
        company: 'Heirrati',
      },
      {
        name: 'Jane Recruiter',
        email: 'jane@techcorp.com',
        password: 'password123',
        role: 'recruiter',
        company: 'TechCorp',
      },
      {
        name: 'Alex Seeker',
        email: 'alex@example.com',
        password: 'password123',
        role: 'seeker',
      },
    ]);

    // Create candidates
    const candidates = await Candidate.create([
      {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        phone: '+1 555-123-4567',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: { years: 5, summary: 'Senior frontend engineer' },
        location: 'San Francisco, CA',
        profileScore: 94,
      },
      {
        name: 'James Kim',
        email: 'james.kim@email.com',
        phone: '+1 555-234-5678',
        skills: ['Figma', 'UX Research', 'Prototyping'],
        experience: { years: 7, summary: 'Product designer' },
        location: 'New York, NY',
        profileScore: 91,
      },
      {
        name: 'Elena Rodriguez',
        email: 'elena.rodriguez@email.com',
        phone: '+1 555-345-6789',
        skills: ['AWS', 'Kubernetes', 'Terraform'],
        experience: { years: 4, summary: 'DevOps engineer' },
        location: 'Remote',
        profileScore: 88,
      },
    ]);

    // Create jobs (internal - platform jobs)
    const jobs = await Job.create([
      {
        title: 'Senior Frontend Engineer',
        company: 'TechCorp',
        location: 'Bangalore',
        jobType: 'full-time',
        salary: '₹15L - ₹25L',
        salaryRange: { min: 1500000, max: 2500000, currency: 'INR', displayText: '₹15L - ₹25L' },
        requiredSkills: ['React', 'TypeScript', 'Node.js'],
        experienceRequired: 3,
        skills: ['React', 'TypeScript', 'Node.js'],
        jobCategory: 'IT Jobs',
        category: 'IT Jobs',
        description: 'We are looking for a senior frontend engineer to lead our web platform.',
        status: 'active',
        source: 'internal',
        createdBy: users[1]._id,
      },
      {
        title: 'Product Designer',
        company: 'TechCorp',
        location: 'Hyderabad',
        jobType: 'full-time',
        salary: '₹12L - ₹18L',
        salaryRange: { min: 1200000, max: 1800000, currency: 'INR', displayText: '₹12L - ₹18L' },
        requiredSkills: ['Figma', 'UX', 'Prototyping'],
        experienceRequired: 2,
        jobCategory: 'Design',
        category: 'Design',
        description: 'Join our design team to create beautiful user experiences.',
        status: 'active',
        source: 'internal',
        createdBy: users[1]._id,
      },
      {
        title: 'DevOps Engineer',
        company: 'TechCorp',
        location: 'Pune',
        jobType: 'contract',
        salary: '₹18L - ₹24L',
        salaryRange: { min: 1800000, max: 2400000, currency: 'INR', displayText: '₹18L - ₹24L' },
        requiredSkills: ['AWS', 'Kubernetes', 'Terraform'],
        experienceRequired: 4,
        skills: ['AWS', 'Kubernetes', 'Terraform'],
        jobCategory: 'IT Jobs',
        category: 'IT Jobs',
        description: 'Manage our cloud infrastructure and CI/CD pipelines.',
        status: 'active',
        source: 'internal',
        createdBy: users[1]._id,
      },
    ]);

    // Create applications (ATS schema - userId, jobTitle, company, etc.)
    await Application.create([
      {
        userId: users[2]._id,
        jobId: jobs[0]._id,
        candidateId: candidates[0]._id,
        jobTitle: jobs[0].title,
        company: jobs[0].company,
        location: jobs[0].location,
        status: 'under_review',
        source: 'internal',
        matchScore: 94,
      },
      {
        userId: users[2]._id,
        jobId: jobs[1]._id,
        candidateId: candidates[1]._id,
        jobTitle: jobs[1].title,
        company: jobs[1].company,
        location: jobs[1].location,
        status: 'interview',
        source: 'internal',
        matchScore: 91,
      },
    ]);

    // Update job applicants count
    for (const job of jobs) {
      const count = await Application.countDocuments({ jobId: job._id });
      await Job.findByIdAndUpdate(job._id, { applicantsCount: count });
    }

    // Create analytics for recruiter
    const { aggregateAnalytics } = await import('../utils/analyticsUtils.js');
    await aggregateAnalytics(users[1]._id);

    // Sample messages between users
    await Message.create([
      { sender: users[1]._id, receiver: users[0]._id, content: 'Hi! I wanted to discuss the new hiring pipeline.' },
      { sender: users[0]._id, receiver: users[1]._id, content: 'Sure, let\'s schedule a call tomorrow.' },
    ]);

    console.log('Seed completed successfully!');
    console.log('\nTest credentials:');
    console.log('Admin:    admin@heirrati.com / password123');
    console.log('Recruiter: jane@techcorp.com / password123');
    console.log('Seeker:   alex@example.com / password123');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
