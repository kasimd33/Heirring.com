# Job Recommendation System - Testing Guide

## Overview

The Job Recommendation System matches job listings to user profiles based on:
- **Skills** (50%) – Overlap between user skills and job required skills
- **Location** (20%) – User preferred location vs job location
- **Experience** (20%) – User years of experience vs job requirement
- **Job Preference** (10%) – Job type and role alignment

---

## 1. Prerequisites

1. Backend running: `cd backend && npm run dev`
2. Frontend running: `npm run dev`
3. MongoDB running
4. Seed data: `cd backend && npm run seed`
5. Import Adzuna jobs (optional): Log in as seeker → Jobs → "Import India Jobs"

---

## 2. Test User Setup

**Seeker (Alex):**
- Email: `alex@example.com`
- Password: `password123`

---

## 3. Update Profile for Matching

1. Log in as Alex (seeker)
2. Go to **My Profile** (`/dashboard/seeker/profile`)
3. Add/update:

   **Skills:**
   - Add: React, TypeScript, Node.js (via Skills section)

   **Experience:**
   - Years of experience: `5`
   - Add work experience if needed

   **Job Preferences:**
   - Preferred location: `Bangalore`
   - Preferred job role: `developer` or `engineer`
   - Job type: `full-time`
   - Work mode: `hybrid` or `remote`

4. Save the profile

---

## 4. Trigger Recommendation Recalculation

Recommendations are recalculated when you:
- Update profile (PUT `/api/profile`)
- Add/remove skills
- Add/update/delete experience

After updating the profile, the system stores new match scores in `JobRecommendations` for faster loading.

---

## 5. View Recommended Jobs

1. Go to **Recommended** in the sidebar (`/dashboard/seeker/recommended`)
2. You should see jobs sorted by match score (highest first)
3. Each card shows:
   - Job title
   - Company
   - Location
   - **Match Score %** (e.g., 92%)
   - Salary (if available)
   - Skills
   - Apply / Save buttons

---

## 6. Test Filters

Use the **Filters** button to filter by:
- **Location** – Bangalore, Hyderabad, etc.
- **Job type** – Full-time, Part-time, Contract, etc.
- **Min match score** – 50%, 60%, 70%, 80%, 90%

---

## 7. API Testing

### Get recommended jobs

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'

# 2. Use token (replace YOUR_TOKEN)
curl -X GET "http://localhost:5000/api/jobs/recommended" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### With filters

```bash
curl -X GET "http://localhost:5000/api/jobs/recommended?location=Bangalore&jobType=full-time&minMatchScore=70" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Force fresh calculation (skip cache)

```bash
curl -X GET "http://localhost:5000/api/jobs/recommended?useCache=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 8. Expected Behavior

| Scenario | Expected |
|----------|----------|
| New seeker, empty profile | Low match scores; may see "No recommended jobs" or generic 30–50% scores |
| Added React, TypeScript | Higher scores for jobs requiring those skills |
| Preferred location = Bangalore | Jobs in Bangalore get location bonus |
| 5 years experience, job requires 3 | Full experience score |
| 2 years experience, job requires 5 | Partial experience score (50%) |

---

## 9. Database Verification

```javascript
// In MongoDB shell or Compass
db.jobrecommendations.find({ userId: ObjectId("ALEX_USER_ID") }).sort({ matchScore: -1 })
```

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| No recommended jobs | Add skills, experience, and preferences to profile; import jobs first |
| All low scores | Ensure skill names match job requirements (case-insensitive, partial match) |
| Recalculations not running | Check backend logs; verify `req.user.role === 'seeker'` |
| 401 on recommended | Ensure you're logged in and JWT is valid |
