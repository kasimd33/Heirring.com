# Adzuna Jobs API – India Integration

## Overview

The platform fetches **Indian job listings** from the [Adzuna Jobs API](https://developer.adzuna.com/) and stores them in MongoDB. Jobs are fetched for major Indian cities with tech-focused keywords. A cron job runs every 6 hours to import new jobs.

---

## 1. Get API Credentials

1. Register at [developer.adzuna.com/signup](https://developer.adzuna.com/signup)
2. Create an application and select **India** as the country
3. Copy your **App ID** and **API Key**

> **Important:** Adzuna requires separate app registration per country. For Indian jobs, you must create an app for India (`in`).

---

## 2. Configure Environment

Add to `backend/.env`:

```env
ADZUNA_APP_ID=your_app_id_here
ADZUNA_API_KEY=your_api_key_here
ADZUNA_COUNTRY=in
```

---

## 3. Indian Cities & Keywords

**Cities (8):** Bangalore, Hyderabad, Pune, Chennai, Mumbai, Delhi, Gurgaon, Noida  

**Keywords (4):** software developer, react developer, backend engineer, data analyst  

The import service fetches jobs for each city × keyword combination (2 pages per combination).

---

## 4. Run the Backend

```bash
cd backend
npm run dev
```

- Server starts on `http://localhost:5000`
- Cron runs Adzuna import every 6 hours (`0 */6 * * *`)

---

## 5. Test Job Import

### Option A: From frontend (recommended)

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Log in
4. Go to Jobs page
5. Click **"Import India Jobs"**

### Option B: Via API

```bash
# 1. Get JWT by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@heirrati.com","password":"password123"}'

# 2. Use the token to trigger import
curl -X POST http://localhost:5000/api/jobs/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Option C: Seed + Import

```bash
cd backend
npm run seed   # Adds sample internal jobs
# Then use Import India Jobs from frontend
```

---

## 6. Verify Indian Job Listings

1. **Jobs page** – Fetch from `GET /api/jobs` (requires auth)
2. **Filters** – Location (Indian cities), keyword, category
3. **Source badge** – "Adzuna" for imported jobs, "Platform" for internal
4. **Apply** – Adzuna jobs open `externalApplyLink`; internal jobs use in-platform form

---

## 7. API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/jobs | Yes | List jobs (filters: keyword, location, category) |
| GET | /api/jobs/search | Yes | Same as GET /api/jobs |
| GET | /api/jobs/:id | Yes | Single job |
| POST | /api/jobs/import | Yes | Trigger Adzuna import |

---

## 8. Duplicate Prevention

Jobs are deduplicated by **title + company + location** (case-insensitive). `externalId` is also used as a fallback.

---

## 9. Troubleshooting

- **400 Bad Request** – Ensure you have India-specific API keys from Adzuna
- **401 Unauthorized** – Invalid or missing ADZUNA_APP_ID / ADZUNA_API_KEY
- **Empty results** – Adzuna may have limited India data; try different cities/keywords
- **No jobs loading** – Log in first; GET /api/jobs requires JWT
