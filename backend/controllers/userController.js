/**
 * User Controller
 * List users (for messaging, etc.)
 */

import User from '../models/User.js';

/**
 * @route   GET /api/users
 * @desc    List users (for message recipients, etc.)
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email company')
      .lean();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
