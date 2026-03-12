/**
 * Profile Routes
 */

import express from 'express';
import {
  getProfile,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkills,
  removeSkill,
  updateSkillLevel,
  addCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  uploadResume,
  getCompletion,
  getProfileApplications,
  getSavedJobs,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { resumeUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/completion', getCompletion);
router.get('/applications', getProfileApplications);
router.get('/saved-jobs', getSavedJobs);
router.post('/resume', resumeUpload.single('resume'), uploadResume);

router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

router.post('/skills', addSkills);
router.put('/skills/:name', updateSkillLevel);
router.delete('/skills/:name', removeSkill);

router.post('/certifications', addCertification);
router.delete('/certifications/:id', deleteCertification);

router.post('/projects', addProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;
