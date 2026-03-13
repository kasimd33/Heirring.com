# Deployment Guide - Heirring.com

## Production URLs

- **Backend (Render):** `https://heirring-com-5.onrender.com`
- **Frontend (Vercel):** Set `VITE_API_URL` in Vercel to point to the backend

---

## 1. Render (Backend) – Environment Variables

In Render → Your Service → **Environment**, add:

| Variable | Value |
|----------|-------|
| `API_BASE_URL` | `https://heirring-com-5.onrender.com` |
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
   https://heirring-com-5.onrender.com/api/auth/google/callback
   ```
4. **Authorized JavaScript origins** – add:
   ```
   https://heirring-com-5.onrender.com
   https://your-vercel-app.vercel.app
   ```
5. **Save**

---

## 3. Vercel (Frontend) – Environment Variable

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **Environment Variables**
3. Add:
   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://heirring-com-5.onrender.com/api` | Production, Preview |

4. **Redeploy** – Env vars are baked in at build time:
   - **Deployments** tab → ⋮ on latest → **Redeploy**
   - Or push a new commit to trigger a fresh build

---

## 4. Summary

| Where | What |
|-------|------|
| **Render** | Backend runs at `https://heirring-com-5.onrender.com` |
| **Google Cloud** | Add redirect: `https://heirring-com-5.onrender.com/api/auth/google/callback` |
| **Vercel** | Set `VITE_API_URL=https://heirring-com-5.onrender.com/api` |

Replace `your-vercel-app` with your actual Vercel project URL.

---

## 5. Fix 502 Bad Gateway on Render

**502** = Render's proxy cannot reach your backend. Check:

1. **Render Dashboard** → Your service → **Logs**
   - If the app crashes on startup: MongoDB connection fail, missing env vars, etc.
   - Look for `MongoDB Connected` – if not present, `MONGODB_URI` may be wrong or MongoDB Atlas blocks Render's IPs

2. **MongoDB Atlas** → Network Access → **Add IP Address** → **Allow from anywhere** (`0.0.0.0/0`)  
   Render uses dynamic IPs; whitelisting specific IPs will not work.

3. **Required env vars** (all must be set in Render → Environment):
   - `MONGODB_URI` – required
   - `JWT_SECRET` – required
   - `NODE_ENV` = `production`

4. **Cold start** – Free tier sleeps after ~15 min. First request can take 30–60 sec; wait and retry.

5. **Build/Start** – Ensure:
   - **Build:** `npm install`
   - **Start:** `npm start`
   - **Root directory:** `backend` (if your repo has backend in a subfolder)
