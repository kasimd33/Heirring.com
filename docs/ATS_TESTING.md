# Application Tracking System (ATS) – Testing Instructions

## Overview

The ATS tracks job applications for both **internal jobs** (posted by recruiters) and **external jobs** (Adzuna). When users apply, a record is created first, then they are redirected (external) or shown the application form (internal).

---

## 1. Setup

### Run the backend

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`.

### Run the frontend

```bash
npm run dev
```

### Seed the database (optional)

```bash
cd backend
npm run seed
```

**Test credentials:**

| Role      | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | admin@heirrati.com     | password123 |
| Recruiter| jane@techcorp.com      | password123 |
| Seeker   | alex@example.com       | password123 |

---

## 2. Test Apply Flow

### External job (Adzuna)

1. Log in as a **seeker** (alex@example.com).
2. Go to **Find Jobs** (or /jobs).
3. Click **Import India Jobs** if no jobs are listed.
4. Find an Adzuna job (badge: "Adzuna").
5. Click **Apply on External Site**.
6. **Expected:**
   - Application record is saved.
   - New tab opens with external apply link.

### Internal job

1. Log in as a **seeker**.
2. Go to **Find Jobs**.
3. Find an internal job (badge: "Platform").
4. Click **Apply Now**.
5. **Expected:**
   - Application record is saved.
   - Redirect to application form.
6. Fill name, email, cover letter.
7. Click **Submit Application**.
8. **Expected:** Success message and redirect.

---

## 3. Test My Applications (Job Seeker)

1. Log in as **alex@example.com** (seeker).
2. Go to **Applied Jobs** (or /dashboard/seeker/applied).

**Expected:**

- List of applications with:
  - Job title
  - Company
  - Location
  - Applied date
  - Status timeline

**Filters:**

- Status (Applied, Under Review, Interview, Offer, Rejected)
- Keyword (job title or company)
- Date range

**Withdraw:**

- For status "Applied", click **Withdraw application**.
- Confirm and verify the application is removed.

---

## 4. Test Recruiter Dashboard

1. Log in as **jane@techcorp.com** (recruiter).
2. Go to **Applications** (or /dashboard/employer/applications).

**Expected:**

- Applications for jobs created by Jane.

**Actions:**

- Change status via dropdown (Applied → Under Review → Interview → Offer / Rejected).
- Add **Interview notes** in the textarea (saved on blur).

**Filters:**

- Status
- Keyword (job title or company)
- Date range

---

## 5. Test API Endpoints

### Create application

```bash
# Get JWT first (login)
TOKEN="your_jwt_here"

curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"JOB_ID_HERE"}'
```

### Get my applications

```bash
curl "http://localhost:5000/api/applications/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Get single application

```bash
curl "http://localhost:5000/api/applications/APPLICATION_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Update status (recruiter)

```bash
curl -X PUT "http://localhost:5000/api/applications/APPLICATION_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"under_review"}'
```

### Add interview notes (recruiter)

```bash
curl -X PUT "http://localhost:5000/api/applications/APPLICATION_ID/notes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"interviewNotes":"Strong technical skills."}'
```

### Withdraw application

```bash
curl -X DELETE "http://localhost:5000/api/applications/APPLICATION_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Status Timeline

Pipeline:

**Applied** → **Under Review** → **Interview** → **Offer** | **Rejected**

- Timeline highlights the current stage.
- **Rejected** is shown when status is `rejected`.

---

## 7. Verification Checklist

- [ ] Seeker can apply to internal jobs (form).
- [ ] Seeker can apply to Adzuna jobs (external redirect).
- [ ] Application is stored for both internal and external jobs.
- [ ] My Applications shows correct list and filters.
- [ ] Recruiter sees applications for their internal jobs.
- [ ] Recruiter can update status and add interview notes.
- [ ] Seeker can withdraw an application (status: applied).
- [ ] Status timeline reflects the correct stage.
