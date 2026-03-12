/**
 * Dashboard Routes
 */

import express from 'express';
import {
  getStats,
  getAnalytics,
  getPipeline,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/analytics', protect, getAnalytics);
router.get('/pipeline', protect, getPipeline);

export default router;
