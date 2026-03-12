/**
 * Profile Controller
 * Professional candidate profile - GET, PUT, sub-resource APIs
 */

import Profile from '../models/Profile.js';
import User from '../models/User.js';
import SavedJob from '../models/SavedJob.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { uploadResumeToCloudinary } from '../utils/cloudinary.js';
import { recalculateRecommendations } from './recommendedJobsController.js';

/** Ensure profile exists for user */
async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = await Profile.create({ userId });
  }
  return profile;
}

/** Profile completion weights (total 100) */
const WEIGHTS = {
  profilePhoto: 10,
  about: 15,
  skills: 15,
  experience: 25,
  education: 15,
  resume: 20,
};

/**
 * GET /api/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const user = await User.findById(req.user._id).select('name email avatar').lean();
    const profileObj = profile.toObject();
    profileObj.user = user;
    res.json({ success: true, data: profileObj });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const allowed = [
      'professionalHeadline', 'location', 'phone', 'portfolioLink', 'linkedinLink', 'githubLink',
      'openToWork', 'aboutText', 'careerGoals', 'yearsOfExperience', 'jobPreferences',
    ];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) profile[f] = req.body[f];
    });
    if (req.body.jobPreferences && typeof req.body.jobPreferences === 'object') {
      profile.jobPreferences = { ...profile.jobPreferences, ...req.body.jobPreferences };
    }
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/experience
 */
export const addExperience = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.experience.push(req.body);
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.status(201).json({ success: true, data: profile.experience[profile.experience.length - 1] });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile/experience/:id
 */
export const updateExperience = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const idx = profile.experience.findIndex((e) => e._id.toString() === req.params.id);
    if (idx === -1) {
      res.status(404);
      throw new Error('Experience not found');
    }
    Object.assign(profile.experience[idx], req.body);
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.json({ success: true, data: profile.experience[idx] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profile/experience/:id
 */
export const deleteExperience = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.experience = profile.experience.filter((e) => e._id.toString() !== req.params.id);
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.json({ success: true, data: { message: 'Deleted' } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/education
 */
export const addEducation = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.education.push(req.body);
    await profile.save();
    res.status(201).json({ success: true, data: profile.education[profile.education.length - 1] });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile/education/:id
 */
export const updateEducation = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const idx = profile.education.findIndex((e) => e._id.toString() === req.params.id);
    if (idx === -1) {
      res.status(404);
      throw new Error('Education not found');
    }
    Object.assign(profile.education[idx], req.body);
    await profile.save();
    res.json({ success: true, data: profile.education[idx] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profile/education/:id
 */
export const deleteEducation = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.education = profile.education.filter((e) => e._id.toString() !== req.params.id);
    await profile.save();
    res.json({ success: true, data: { message: 'Deleted' } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/skills
 */
export const addSkills = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const { skills } = req.body;
    const toAdd = Array.isArray(skills) ? skills : [{ name: skills.name || skills, level: skills.level || 'intermediate' }];
    toAdd.forEach((s) => {
      const name = typeof s === 'string' ? s : s.name;
      const level = typeof s === 'string' ? 'intermediate' : (s.level || 'intermediate');
      if (name && !profile.skills.some((sk) => sk.name.toLowerCase() === name.toLowerCase())) {
        profile.skills.push({ name, level });
      }
    });
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.json({ success: true, data: profile.skills });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profile/skills/:name
 */
export const removeSkill = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const name = decodeURIComponent(req.params.name);
    profile.skills = profile.skills.filter((s) => s.name.toLowerCase() !== name.toLowerCase());
    await profile.save();
    if (req.user.role === 'seeker') {
      recalculateRecommendations(req.user._id).catch(() => {});
    }
    res.json({ success: true, data: profile.skills });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile/skills/:name
 */
export const updateSkillLevel = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const name = decodeURIComponent(req.params.name);
    const { level } = req.body;
    const skill = profile.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }
    skill.level = ['beginner', 'intermediate', 'expert'].includes(level) ? level : skill.level;
    await profile.save();
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/certifications
 */
export const addCertification = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.certifications.push(req.body);
    await profile.save();
    res.status(201).json({ success: true, data: profile.certifications[profile.certifications.length - 1] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profile/certifications/:id
 */
export const deleteCertification = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.certifications = profile.certifications.filter((c) => c._id.toString() !== req.params.id);
    await profile.save();
    res.json({ success: true, data: { message: 'Deleted' } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/projects
 */
export const addProject = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.projects.push(req.body);
    await profile.save();
    res.status(201).json({ success: true, data: profile.projects[profile.projects.length - 1] });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const idx = profile.projects.findIndex((p) => p._id.toString() === req.params.id);
    if (idx === -1) {
      res.status(404);
      throw new Error('Project not found');
    }
    Object.assign(profile.projects[idx], req.body);
    await profile.save();
    res.json({ success: true, data: profile.projects[idx] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profile/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    profile.projects = profile.projects.filter((p) => p._id.toString() !== req.params.id);
    await profile.save();
    res.json({ success: true, data: { message: 'Deleted' } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/profile/resume
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400);
      throw new Error('No resume file uploaded');
    }
    const url = await uploadResumeToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.user._id.toString()
    );
    const profile = await getOrCreateProfile(req.user._id);
    profile.resumeURL = url;
    await profile.save();
    res.json({ success: true, data: { resumeURL: url } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profile/completion
 */
export const getCompletion = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const user = await User.findById(req.user._id).select('avatar').lean();
    let score = 0;
    if (user?.avatar) score += WEIGHTS.profilePhoto;
    else score += (WEIGHTS.profilePhoto / 2); // partial for having profile
    if (profile.aboutText?.trim().length > 50) score += WEIGHTS.about;
    if (profile.skills?.length > 0) score += WEIGHTS.skills;
    if (profile.experience?.length > 0) score += WEIGHTS.experience;
    if (profile.education?.length > 0) score += WEIGHTS.education;
    if (profile.resumeURL) score += WEIGHTS.resume;
    const percentage = Math.min(100, Math.round(score));
    res.json({ success: true, data: { percentage, score, maxScore: 100 } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profile/applications
 */
export const getProfileApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .sort({ appliedDate: -1 })
      .limit(20)
      .lean();
    res.json({ success: true, data: apps });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profile/saved-jobs
 */
export const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate('jobId', 'title company location salary salaryRange source')
      .sort({ savedDate: -1 })
      .lean();
    res.json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};
