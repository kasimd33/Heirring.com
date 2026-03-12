/**
 * Message Routes
 */

import express from 'express';
import {
  getMessages,
  getConversations,
  sendMessage,
  markAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.post('/', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);

export default router;
