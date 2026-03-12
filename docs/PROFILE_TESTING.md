# Professional Profile System – Testing Instructions

## Overview

The profile system allows job seekers to build a complete professional profile with:

- Profile header (photo, headline, contact, links, open to work)
- About / professional summary
- Skills (with levels)
- Work experience (timeline)
- Education
- Certifications
- Projects / portfolio
- Resume upload
- Job preferences
- Application activity
- Saved jobs
- Profile completion %

---

## 1. Setup

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
npm run dev
```

### Optional: Cloudinary (for resume storage)

Add to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Without Cloudinary, resumes are stored locally in `backend/uploads/resumes/`.

---

## 2. Access the Profile

1. Log in as a **job seeker** (e.g. `alex@example.com` / `password123` after seed).
2. Go to **My Profile** from the seeker sidebar (or `/dashboard/seeker/profile`).

---

## 3. Test Each Section

### Profile header

- Edit headline, location, phone, portfolio, LinkedIn, GitHub
- Toggle "Open to work"
- Upload profile photo (via Edit → photo upload)
- Check profile completion progress bar

### About me

- Add professional summary, career goals, years of experience
- Edit and save

### Skills

- Add skills (with beginner/intermediate/expert level)
- Remove skills
- Confirm tag styling for each level

### Work experience

- Add experience (company, title, location, dates, description, achievements)
- Edit and delete entries
- Confirm timeline layout

### Education

- Add education entries
- Edit and delete

### Certifications

- Add certifications
- Delete entries

### Projects

- Add projects (title, description, tech stack, GitHub, live demo)
- Edit and delete

### Resume

- Upload PDF or Word resume (max 5MB)
- Preview and download
- Replace with new file

### Job preferences

- Set preferred role, location, salary, job type, work mode

### Application activity

- Applies to jobs, then check that they appear here
- Link to "View all" → My Applications

### Saved jobs

- Save jobs from Find Jobs (bookmark icon)
- Unsave from profile or from Jobs page

---

## 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile | Get full profile |
| PUT | /api/profile | Update profile fields |
| GET | /api/profile/completion | Get completion % |
| GET | /api/profile/applications | Get user's applications |
| GET | /api/profile/saved-jobs | Get saved jobs |
| POST | /api/profile/resume | Upload resume |
| POST | /api/profile/experience | Add experience |
| PUT | /api/profile/experience/:id | Update experience |
| DELETE | /api/profile/experience/:id | Delete experience |
| POST | /api/profile/education | Add education |
| PUT | /api/profile/education/:id | Update education |
| DELETE | /api/profile/education/:id | Delete education |
| POST | /api/profile/skills | Add skills |
| PUT | /api/profile/skills/:name | Update skill level |
| DELETE | /api/profile/skills/:name | Remove skill |
| POST | /api/profile/certifications | Add certification |
| DELETE | /api/profile/certifications/:id | Delete certification |
| POST | /api/profile/projects | Add project |
| PUT | /api/profile/projects/:id | Update project |
| DELETE | /api/profile/projects/:id | Delete project |
| POST | /api/saved-jobs | Save a job |
| DELETE | /api/saved-jobs/:jobId | Unsave a job |

---

## 5. Profile Completion Algorithm

| Component   | Weight |
|------------|--------|
| Profile photo | 10% |
| About section | 15% |
| Skills       | 15% |
| Experience   | 25% |
| Education    | 15% |
| Resume       | 20% |
| **Total**    | **100%** |

---

## 6. Verification Checklist

- [ ] Profile header saves and displays correctly
- [ ] About section saves
- [ ] Skills add/remove with levels
- [ ] Experience timeline displays correctly
- [ ] Education CRUD works
- [ ] Certifications add/delete
- [ ] Projects add/edit/delete
- [ ] Resume uploads (local or Cloudinary)
- [ ] Job preferences save
- [ ] Application activity shows recent applications
- [ ] Saved jobs sync with Jobs page bookmark
- [ ] Profile completion % updates as sections are filled
