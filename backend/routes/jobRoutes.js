/**
 * Job Routes
 */

import express from 'express';
import {
  createJob,
  getJobs,
  searchJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { getRecommendedJobs } from '../controllers/recommendedJobsController.js';
import { importAdzunaJobs } from '../services/jobImportService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getJobs).post(protect, createJob);
router.get('/search', protect, searchJobs);
router.get('/recommended', protect, getRecommendedJobs);
router.post('/import', protect, async (req, res, next) => {
  try {
    const count = await importAdzunaJobs();
    res.json({ success: true, data: { imported: count } });
  } catch (err) {
    next(err);
  }
});
router.route('/:id').get(protect, getJobById).put(protect, updateJob).delete(protect, deleteJob);

export default router;
