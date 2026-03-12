/**
 * Application Routes (ATS)
 */

import express from 'express';
import {
  createApplication,
  getApplications,
  getMyApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getApplications).post(protect, createApplication);
router.get('/me', protect, getMyApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, updateApplication);
router.put('/:id/status', protect, updateApplicationStatus);
router.put('/:id/notes', protect, updateApplicationNotes);
router.delete('/:id', protect, deleteApplication);

export default router;
