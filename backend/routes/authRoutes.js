/**
 * Auth Routes
 */

import express from 'express';
import passport from 'passport';
import { register, login, getProfile, updateProfile, changePassword, uploadAvatar } from '../controllers/authController.js';
import { oAuthCallback, getOAuthFailureRedirect } from '../config/passport.js';
import { protect } from '../middleware/authMiddleware.js';
import { avatarUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: getOAuthFailureRedirect() }), oAuthCallback());

router.get('/linkedin', passport.authenticate('linkedin', { state: 'heirring' }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false, failureRedirect: getOAuthFailureRedirect() }), oAuthCallback());

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, avatarUpload.single('avatar'), uploadAvatar);
router.put('/change-password', protect, changePassword);

export default router;
