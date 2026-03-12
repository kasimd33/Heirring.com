# Heirrati API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth APIs

### POST /auth/register

Register a new recruiter/admin.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "password123",
  "role": "recruiter",
  "company": "TechCorp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f...",
    "name": "Jane Doe",
    "email": "jane@company.com",
    "role": "recruiter",
    "company": "TechCorp",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login

**Request:**
```json
{
  "email": "jane@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f...",
    "name": "Jane Doe",
    "email": "jane@company.com",
    "role": "recruiter",
    "company": "TechCorp",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /auth/profile

Protected. Returns current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f...",
    "name": "Jane Doe",
    "email": "jane@company.com",
    "role": "recruiter",
    "company": "TechCorp",
    "createdAt": "2025-03-12T..."
  }
}
```

---

## Jobs APIs

### POST /jobs

Create a job. Protected.

**Request:**
```json
{
  "title": "Senior Frontend Engineer",
  "company": "TechCorp",
  "location": "Remote",
  "jobType": "full-time",
  "salaryRange": {
    "min": 120000,
    "max": 150000,
    "currency": "USD",
    "displayText": "$120k - $150k"
  },
  "requiredSkills": ["React", "TypeScript"],
  "description": "Job description..."
}
```

### GET /jobs

Query params: `status`, `search`, `location`, `jobType`, `page`, `limit`, `createdBy=me`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### GET /jobs/:id

### PUT /jobs/:id

### DELETE /jobs/:id

---

## Candidates APIs

### POST /candidates

**Request:**
```json
{
  "name": "Sarah Mitchell",
  "email": "sarah@email.com",
  "phone": "+1 555-123-4567",
  "skills": ["React", "TypeScript"],
  "experience": { "years": 5, "summary": "Senior engineer" },
  "location": "San Francisco",
  "profileScore": 90
}
```

### GET /candidates

Query params: `search`, `skills` (comma-separated), `minExperience`, `page`, `limit`

### GET /candidates/:id

### PUT /candidates/:id

---

## Applications APIs

### POST /applications

**Request:**
```json
{
  "jobId": "65f...",
  "candidateId": "65f...",
  "notes": "Strong match",
  "matchScore": 94
}
```

### GET /applications

Query params: `jobId`, `candidateId`, `status`, `page`, `limit`

### PUT /applications/:id/status

**Request:**
```json
{
  "status": "shortlisted"
}
```

Status values: `applied`, `screening`, `shortlisted`, `interview`, `rejected`, `hired`

---

## Dashboard APIs

### GET /dashboard/stats

**Response:**
```json
{
  "success": true,
  "data": {
    "activeJobs": 12,
    "totalApplications": 248,
    "interviewsScheduled": 15,
    "profileViews": 1429
  }
}
```

### GET /dashboard/analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 25,
    "totalCandidates": 150,
    "totalApplications": 320,
    "activeJobs": 12,
    "hiringRate": 8,
    "monthlyStats": [
      {
        "month": "2025-02",
        "jobsPosted": 5,
        "applicationsReceived": 48,
        "hires": 2
      }
    ]
  }
}
```

### GET /dashboard/pipeline

**Response:**
```json
{
  "success": true,
  "data": [
    { "stage": "applied", "count": 120 },
    { "stage": "shortlisted", "count": 28 },
    { "stage": "interview", "count": 15 }
  ]
}
```

---

## Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP status codes: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
