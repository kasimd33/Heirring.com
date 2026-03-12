/**
 * Message Controller
 * Handles messaging between users
 */

import Message from '../models/Message.js';
import User from '../models/User.js';

/**
 * @route   GET /api/messages
 * @desc    Get messages for current user (inbox/sent)
 */
export const getMessages = async (req, res, next) => {
  try {
    const { type = 'inbox', withUser, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    let query;
    if (withUser) {
      query = {
        $or: [
          { sender: userId, receiver: withUser },
          { sender: withUser, receiver: userId },
        ],
      };
    } else {
      query = type === 'sent' ? { sender: userId } : { receiver: userId };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total] = await Promise.all([
      Message.find(query)
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Message.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/messages/conversations
 * @desc    Get list of conversation partners
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unread: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }]},
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          user: { name: 1, email: 1, _id: 1 },
          lastMessage: 1,
          unread: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, content, relatedJob } = req.body;

    if (!receiver || !content?.trim()) {
      res.status(400);
      throw new Error('Receiver and content are required');
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      res.status(404);
      throw new Error('Receiver not found');
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content: content.trim(),
      relatedJob: relatedJob || null,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/messages/:id/read
 * @desc    Mark message as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user._id },
      { read: true },
      { new: true }
    );

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
