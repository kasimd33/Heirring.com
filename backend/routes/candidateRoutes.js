/**
 * Candidate Routes
 */

import express from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
} from '../controllers/candidateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCandidates).post(protect, createCandidate);
router.route('/:id').get(protect, getCandidateById).put(protect, updateCandidate);

export default router;
