/**
 * Job Matching Service
 * Calculates match scores between user profiles and job listings
 * Weights: Skills 50%, Location 20%, Experience 20%, Job Preference 10%
 */

/**
 * Normalize string for comparison (lowercase, trim)
 */
function normalize(str) {
  return String(str || '').toLowerCase().trim();
}

/**
 * Skills Match - 50% weight
 * skillScore = matchingSkills / job.requiredSkills.length
 */
function getSkillScore(userProfile, job) {
  const userSkills = (userProfile.skills || []).map((s) =>
    normalize(typeof s === 'string' ? s : s.name)
  );
  const jobSkills = (job.requiredSkills || job.skills || []).map((s) =>
    normalize(s)
  );

  if (jobSkills.length === 0) return 100; // No requirements = full match

  const matchingSkills = userSkills.filter((us) =>
    jobSkills.some((js) => us.includes(js) || js.includes(us))
  );

  const score = (matchingSkills.length / jobSkills.length) * 100;
  return Math.min(100, Math.round(score));
}

/**
 * Location Match - 20% weight
 * Exact match = 100, else 0 (or partial if preferred contains job location)
 */
function getLocationScore(userProfile, job) {
  const preferred = normalize(
    userProfile.preferredLocation || userProfile.location || ''
  );
  const jobLocation = normalize(job.location || '');

  if (!preferred) return 50; // No preference = neutral score
  if (!jobLocation) return 50;

  if (preferred === jobLocation) return 100;
  if (jobLocation.includes(preferred) || preferred.includes(jobLocation))
    return 80;
  return 0;
}

/**
 * Experience Match - 20% weight
 * user >= required: 100, else 50
 */
function getExperienceScore(userProfile, job) {
  const userYears = Number(userProfile.experienceYears ?? userProfile.yearsOfExperience ?? 0) || 0;
  const required = Number(job.experienceRequired ?? 0) || 0;

  if (required === 0) return 100;
  if (userYears >= required) return 100;
  return 50;
}

/**
 * Job Preference Match - 10% weight
 * Match jobType, preferredJobRole in title
 */
function getPreferenceScore(userProfile, job) {
  let score = 50; // Neutral default

  const preferredJobType = normalize(
    userProfile.preferredJobType || (userProfile.jobPreferences?.jobType || '')
  );
  const jobType = normalize(job.jobType || '');

  if (preferredJobType && jobType && preferredJobType === jobType) {
    score = 100;
  } else if (preferredJobType && jobType) {
    score = 0;
  }

  const preferredRole = normalize(
    userProfile.preferredJobRole || (userProfile.jobPreferences?.preferredJobRole || '')
  );
  const jobTitle = normalize(job.title || '');

  if (preferredRole && jobTitle && jobTitle.includes(preferredRole)) {
    score = Math.max(score, 100);
  }

  return score;
}

/**
 * Build user profile object from Profile document for matching
 */
export function buildUserProfileForMatching(profile, user = {}) {
  const prefs = profile?.jobPreferences || {};
  return {
    skills: (profile?.skills || []).map((s) => (typeof s === 'string' ? s : s.name)),
    experienceYears: profile?.yearsOfExperience ?? 0,
    preferredLocation: prefs.preferredLocation || profile?.location || '',
    location: profile?.location || '',
    preferredJobRole: prefs.preferredJobRole || '',
    expectedSalary: prefs.expectedSalary || '',
    preferredJobType: prefs.jobType || '',
    workMode: prefs.workMode || '',
    jobPreferences: prefs,
  };
}

/**
 * Calculate match score between user profile and job
 * @param {Object} userProfile - Profile built via buildUserProfileForMatching
 * @param {Object} job - Job document
 * @returns {number} 0-100
 */
export function calculateJobMatch(userProfile, job) {
  const skillScore = getSkillScore(userProfile, job);
  const locationScore = getLocationScore(userProfile, job);
  const experienceScore = getExperienceScore(userProfile, job);
  const preferenceScore = getPreferenceScore(userProfile, job);

  const total =
    skillScore * 0.5 +
    locationScore * 0.2 +
    experienceScore * 0.2 +
    preferenceScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, total)));
}
