/**
 * Candidate Controller
 * CRUD operations for candidate profiles
 */

import Candidate from '../models/Candidate.js';

/**
 * @route   POST /api/candidates
 * @desc    Create a new candidate
 */
export const createCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.create(req.body);

    res.status(201).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates (with filters, pagination)
 */
export const getCandidates = async (req, res, next) => {
  try {
    const { search, skills, minExperience, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') },
      ];
    }

    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillList };
    }

    if (minExperience !== undefined) {
      query['experience.years'] = { $gte: Number(minExperience) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [candidates, total] = await Promise.all([
      Candidate.find(query).sort({ profileScore: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Candidate.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: candidates,
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
 * @route   GET /api/candidates/:id
 * @desc    Get single candidate by ID
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      res.status(404);
      throw new Error('Candidate not found');
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update a candidate
 */
export const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!candidate) {
      res.status(404);
      throw new Error('Candidate not found');
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};
