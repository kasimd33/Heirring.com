/**
 * Recommended Jobs Controller
 * GET /api/jobs/recommended - Jobs sorted by match score
 */

import Job from '../models/Job.js';
import Profile from '../models/Profile.js';
import JobRecommendation from '../models/JobRecommendation.js';
import {
  buildUserProfileForMatching,
  calculateJobMatch,
} from '../services/jobMatchingService.js';

/**
 * Get or create profile for user
 */
async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ userId }).lean();
  if (!profile) {
    profile = await Profile.create({ userId });
    profile = profile.toObject();
  }
  return profile;
}

/**
 * @route   GET /api/jobs/recommended
 * @desc    Get recommended jobs for the current user, sorted by match score
 */
export const getRecommendedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      location,
      salaryMin,
      salaryMax,
      jobType,
      minMatchScore,
      limit = 20,
      useCache = 'true',
    } = req.query;

    const profile = await getOrCreateProfile(userId);
    const userProfile = buildUserProfileForMatching(profile);

    // Build job query - active jobs only
    const jobQuery = { status: 'active' };
    if (location) {
      jobQuery.location = new RegExp(location, 'i');
    }
    if (jobType) {
      jobQuery.jobType = jobType;
    }

    let jobsWithScores;
    const minScoreFilter = minMatchScore ? Number(minMatchScore) : 0;
    const limitNum = Number(limit);

    const useCached = useCache !== 'false';
    if (useCached) {
      const cached = await JobRecommendation.find({ userId })
        .sort({ matchScore: -1 })
        .limit(limitNum * 3)
        .populate('jobId')
        .lean();

      const validRecs = cached
        .filter((r) => r.jobId != null && r.matchScore >= minScoreFilter)
        .filter((r) => {
          if (location && !new RegExp(location, 'i').test(r.jobId?.location || ''))
            return false;
          if (jobType && r.jobId?.jobType !== jobType) return false;
          return true;
        })
        .slice(0, limitNum);

      jobsWithScores = validRecs.map((r) => ({
        ...r.jobId,
        matchScore: r.matchScore,
      }));
    }

    // If no cached results or cache disabled, compute on-the-fly
    if (!jobsWithScores || jobsWithScores.length === 0) {
      const jobs = await Job.find(jobQuery)
        .populate('createdBy', 'name email company')
        .lean();

      const scored = jobs.map((job) => ({
        ...job,
        matchScore: calculateJobMatch(userProfile, job),
      }));

      const minScore = minMatchScore ? Number(minMatchScore) : 0;
      jobsWithScores = scored
        .filter((j) => j.matchScore >= minScore)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: jobsWithScores,
      count: jobsWithScores.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Recalculate and store job recommendations for a user
 * Called when profile is updated
 */
export async function recalculateRecommendations(userId) {
  try {
    const profile = await Profile.findOne({ userId }).lean();
    if (!profile) return;

    const userProfile = buildUserProfileForMatching(profile);
    const jobs = await Job.find({ status: 'active' }).lean();

    const recommendations = jobs.map((job) => ({
      userId,
      jobId: job._id,
      matchScore: calculateJobMatch(userProfile, job),
    }));

    await JobRecommendation.deleteMany({ userId });
    if (recommendations.length > 0) {
      await JobRecommendation.insertMany(recommendations);
    }

    return recommendations.length;
  } catch (err) {
    console.error('[JobRecommendations] Recalc error:', err.message);
    return 0;
  }
}
