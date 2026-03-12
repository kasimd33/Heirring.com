/**
 * Job Import Service
 * Fetches Indian job listings from Adzuna API
 * - India endpoint: https://api.adzuna.com/v1/api/jobs/in/search/{page}
 * - Major cities: Bangalore, Hyderabad, Pune, Chennai, Mumbai, Delhi, Gurgaon, Noida
 * - Keywords: software developer, react developer, backend engineer, data analyst
 * - Prevents duplicates using title + company + location
 */

import axios from 'axios';
import Job from '../models/Job.js';

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
const COUNTRY = 'in';

const INDIAN_CITIES = [
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Gurgaon',
  'Noida',
];

const JOB_KEYWORDS = [
  'software developer',
  'react developer',
  'backend engineer',
  'data analyst',
];

/**
 * Map Adzuna contract types to our jobType enum
 */
function mapContractType(contractType, contractTime) {
  if (contractTime === 'full_time') return 'full-time';
  if (contractTime === 'part_time') return 'part-time';
  if (contractType === 'permanent') return 'permanent';
  if (contractType === 'contract' || contractType === 'temporary') return 'contract';
  return 'full-time';
}

/**
 * Format salary for Indian context (INR, Lakhs)
 */
function formatSalaryINR(min, max) {
  if (!min && !max) return null;
  const fmt = (n) => {
    if (!n) return '';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${(n / 1000).toFixed(0)}k`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

/**
 * Parse Adzuna created date
 */
function parsePostedDate(createdStr) {
  if (!createdStr) return null;
  const d = new Date(createdStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Normalize Adzuna API response to our job schema
 */
function normalizeAdzunaJob(adzunaJob) {
  const company = adzunaJob.company?.display_name || 'Unknown Company';
  const location = adzunaJob.location?.display_name || adzunaJob.location?.area?.join(', ') || 'India';
  const category = adzunaJob.category?.label || adzunaJob.category?.tag || null;
  const salaryMin = adzunaJob.salary_min || null;
  const salaryMax = adzunaJob.salary_max || null;
  const salaryDisplay = formatSalaryINR(salaryMin, salaryMax);

  return {
    title: adzunaJob.title || 'Untitled',
    company,
    location,
    salary: salaryDisplay,
    description: adzunaJob.description || 'No description available.',
    skills: adzunaJob.required_skills || [],
    source: 'adzuna',
    externalApplyLink: adzunaJob.redirect_url || null,
    jobCategory: category,
    category,
    postedDate: parsePostedDate(adzunaJob.created),
    jobType: mapContractType(adzunaJob.contract_type, adzunaJob.contract_time),
    salaryRange: {
      min: salaryMin,
      max: salaryMax,
      currency: 'INR',
      displayText: salaryDisplay,
    },
    requiredSkills: adzunaJob.required_skills || [],
    status: 'active',
    applicantsCount: 0,
    externalId: `adzuna_${COUNTRY}_${adzunaJob.id}`,
  };
}

/**
 * Fetch jobs from Adzuna India API for a city and keyword
 */
async function fetchAdzunaJobs(city, keyword, page = 1) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_API_KEY;

  if (!appId || !appKey) {
    console.warn('[JobImport] Adzuna credentials not configured. Set ADZUNA_APP_ID and ADZUNA_API_KEY.');
    return [];
  }

  try {
    const url = `${ADZUNA_BASE}/${COUNTRY}/search/${page}`;
    const params = {
      app_id: appId,
      app_key: appKey,
      results_per_page: 20,
      what: keyword,
      where: city.toLowerCase(),
    };

    const { data } = await axios.get(url, {
      params,
      headers: { Accept: 'application/json' },
      timeout: 15000,
    });

    return data.results || [];
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error(`[JobImport] Adzuna API error (${city}, ${keyword}):`, err.message);
    if (body) console.error('[JobImport] Response:', JSON.stringify(body).slice(0, 300));
    if (status === 400) {
      console.error('[JobImport] 400 - Ensure you have India (in) API keys from https://developer.adzuna.com');
    }
    if (status === 401) {
      console.error('[JobImport] Invalid credentials. Check ADZUNA_APP_ID and ADZUNA_API_KEY.');
    }
    return [];
  }
}

/**
 * Check if job already exists (title + company + location)
 */
async function isDuplicate(jobData) {
  const existing = await Job.findOne({
    title: { $regex: new RegExp(`^${escapeRegex(jobData.title)}$`, 'i') },
    company: { $regex: new RegExp(`^${escapeRegex(jobData.company)}$`, 'i') },
    location: { $regex: new RegExp(`^${escapeRegex(jobData.location)}$`, 'i') },
  });
  return !!existing;
}

function escapeRegex(str) {
  return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Import jobs from Adzuna India into MongoDB
 * Fetches for each city × keyword combination
 */
export async function importAdzunaJobs() {
  let totalImported = 0;

  for (const city of INDIAN_CITIES) {
    for (const keyword of JOB_KEYWORDS) {
      for (let page = 1; page <= 2; page++) {
        const adzunaJobs = await fetchAdzunaJobs(city, keyword, page);

        for (const aj of adzunaJobs) {
          try {
            const jobData = normalizeAdzunaJob(aj);

            // Skip duplicates (title + company + location)
            const dup = await isDuplicate(jobData);
            if (dup) continue;

            // Also skip by externalId for safety
            const byExt = await Job.findOne({ externalId: jobData.externalId });
            if (byExt) continue;

            await Job.create(jobData);
            totalImported++;
          } catch (err) {
            if (err.code === 11000) continue; // duplicate key
            console.error('[JobImport] Error saving job:', err.message);
          }
        }

        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  if (totalImported > 0) {
    console.log(`[JobImport] Imported ${totalImported} new Indian jobs from Adzuna`);
  }

  return totalImported;
}
