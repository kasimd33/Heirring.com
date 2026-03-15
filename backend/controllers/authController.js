/**
 * Auth Controller
 * Handles user registration, login, and profile
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '30d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new recruiter/seeker
 */
export const register = async (req, res, next) => {
  try {
    const body = req.body;
    const { name, email, password, role, company } = body || {};

    // Handle empty/missing body (can happen if Content-Type or body parser fails)
    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Please send JSON with email and password.',
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const displayName = (name && String(name).trim()) || 'User';
    const emailNormalized = String(email).trim().toLowerCase();

    // Basic email format check before hitting DB
    if (!/^\S+@\S+\.\S+$/.test(emailNormalized)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check if user exists (case-insensitive - handles any DB inconsistency)
    const emailRegex = new RegExp(`^${emailNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const existingUser = await User.findOne({ email: { $regex: emailRegex } }).select('+password');
    if (existingUser) {
      const isOAuthOnly = (existingUser.googleId || existingUser.linkedinId) && !existingUser.password;
      return res.status(400).json({
        success: false,
        error: isOAuthOnly
          ? 'This email is registered with Google or LinkedIn. Please sign in using that option.'
          : 'User with this email already exists',
      });
    }

    const user = await User.create({
      name: displayName,
      email: emailNormalized,
      password,
      role: ['admin', 'recruiter', 'seeker'].includes(role) ? role : 'recruiter',
      company: company ? String(company).trim() : undefined,
    });

    // Create analytics record (non-critical - don't fail registration)
    try {
      await Analytics.create({ userId: user._id });
    } catch (analyticsErr) {
      console.warn('[Auth] Analytics create failed:', analyticsErr?.message);
    }

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors with clear message
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        error: msg || 'Validation failed',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }
    if (process.env.NODE_ENV === 'production') {
      console.error('[Auth register]', error?.message || error);
    }
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Normalize and find user (case-insensitive query for reliability)
    const emailNormalized = String(email).trim().toLowerCase();
    const emailRegex = new RegExp(`^${emailNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const user = await User.findOne({ email: { $regex: emailRegex } }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // OAuth-only users have no password - guide them to use Google/LinkedIn
    if (!user.password && (user.googleId || user.linkedinId)) {
      res.status(400);
      throw new Error('This account was created with Google or LinkedIn. Please sign in using that option.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile (protected)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (protected)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, company, companyDescription, companyWebsite } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (company !== undefined) user.company = company;
    if (companyDescription !== undefined) user.companyDescription = companyDescription;
    if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/avatar
 * @desc    Upload profile avatar (protected)
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      data: { avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password (protected)
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please provide current and new password');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      data: { message: 'Password updated successfully' },
    });
  } catch (error) {
    next(error);
  }
};
