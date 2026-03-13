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
