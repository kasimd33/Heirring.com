# Deployment Guide - Heirring.com

## Production URLs

- **Backend (Railway):** `https://heirringcom-production.up.railway.app`
- **Frontend (Vercel):** Set `VITE_API_URL` in Vercel to point to the backend

---

## 1. Railway (Backend) – Environment Variables

In Railway → Your Service → **Variables**, add:

| Variable | Value |
|----------|-------|
| `API_BASE_URL` | `https://heirringcom-production.up.railway.app` |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` *(your actual Vercel URL)* |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret, min 32 characters |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `NODE_ENV` | `production` |

---

## 2. Google Cloud – OAuth Redirect URI

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Open your **OAuth 2.0 Client ID**
3. **Authorized redirect URIs** – add:
   ```
   https://heirringcom-production.up.railway.app/api/auth/google/callback
   ```
4. **Authorized JavaScript origins** – add:
   ```
   https://heirringcom-production.up.railway.app
   https://your-vercel-app.vercel.app
   ```
5. **Save**

---

## 3. Vercel (Frontend) – Environment Variable

In Vercel → Project → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://heirringcom-production.up.railway.app/api` |

Redeploy the frontend after adding this.

---

## 4. Summary

| Where | What |
|-------|------|
| **Railway** | Backend runs at `https://heirringcom-production.up.railway.app` |
| **Google Cloud** | Add redirect: `https://heirringcom-production.up.railway.app/api/auth/google/callback` |
| **Vercel** | Set `VITE_API_URL=https://heirringcom-production.up.railway.app/api` |

Replace `your-vercel-app` with your actual Vercel project URL.
