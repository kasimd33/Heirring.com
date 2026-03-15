# Complete Deployment Guide – Heirring.com

This guide walks you through deploying Heirring.com from GitHub to production using **free** platforms.

---

## Architecture Overview

| Component | Platform | Free Tier |
|----------|----------|-----------|
| **Frontend** (React/Vite) | Vercel or Netlify | ✅ Yes |
| **Backend** (Node.js/Express) | Render or Railway | ✅ Yes |
| **Database** (MongoDB) | MongoDB Atlas | ✅ Yes (512MB) |
| **Code Hosting** | GitHub | ✅ Yes |

---

## Part 1: Prepare Your Project for Deployment

### 1.1 Ensure `.env` Is Not Committed

Your `.env` files contain secrets. **Never commit them to GitHub.**

```bash
# Check if .env is in .gitignore
cat .gitignore
```

Ensure `.gitignore` contains:
```
.env
.env.local
.env.*.local
backend/.env
```

If any `.env` was committed earlier, remove it from history before pushing:

```bash
git rm --cached backend/.env
git rm --cached .env
git commit -m "Remove env files from tracking"
```

### 1.2 Create `.env.example` (Without Real Secrets)

Keep your repo safe by providing templates only:

**`backend/.env.example`**
```
PORT=5000
NODE_ENV=production

# MongoDB Atlas - create cluster at https://cloud.mongodb.com
MONGODB_URI=your_mongodb_connection_string

# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-32-char-secret

# Adzuna - https://developer.adzuna.com
ADZUNA_APP_ID=
ADZUNA_API_KEY=
ADZUNA_COUNTRY=in

# Your production URLs (set after deploying)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com

# OAuth - https://console.cloud.google.com | https://linkedin.com/developers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

---

## Part 2: Push to GitHub

### 2.1 Create a New Repository on GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name: `heirring-com` (or your choice)
3. Keep it **private** if you prefer
4. Do **not** initialize with README (if you already have code)
5. Click **Create repository**

### 2.2 Push Your Code

```bash
cd d:\Heirring.com

# Initialize git (if not already)
git init

# Add remote (replace YOUR_USERNAME and REPO_NAME with yours)
git remote add origin https://github.com/YOUR_USERNAME/heirring-com.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit for deployment"

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy Backend (Node.js) – Render.com

### 3.1 Create Render Account

1. Go to [render.com](https://render.com) → **Get started**
2. Sign up with **GitHub** (easiest)

### 3.2 Create a Web Service

1. **Dashboard** → **New +** → **Web Service**
2. Connect your GitHub repo (`heirring-com`)
3. Configure:
   - **Name:** `heirring-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**

4. Click **Advanced** and add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (Render sets this automatically; you can omit) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong 32+ character secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` (update after deploying frontend) |
| `BACKEND_URL` | `https://heirring-backend.onrender.com` (or your Render URL) |
| `ADZUNA_APP_ID` | Your Adzuna App ID |
| `ADZUNA_API_KEY` | Your Adzuna API Key |
| `ADZUNA_COUNTRY` | `in` |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret |
| `LINKEDIN_CLIENT_ID` | Your LinkedIn Client ID |
| `LINKEDIN_CLIENT_SECRET` | Your LinkedIn Client Secret |

5. Click **Create Web Service**
6. Wait for deploy. Your backend URL will be: `https://heirring-backend.onrender.com`
7. **Note:** Render free tier sleeps after ~15 min of inactivity; first request may take ~30–60 seconds.

---

## Part 4: Deploy Frontend – Vercel

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com) → **Sign up**
2. Sign up with **GitHub**

### 4.2 Import Project

1. **Add New** → **Project**
2. Import your GitHub repo `heirring-com`
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (root, not `frontend`)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)

4. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://heirring-backend.onrender.com/api` |

> Use your actual Render backend URL from Part 3.

5. Click **Deploy**
6. After deploy, your site will be at: `https://heirring-com.vercel.app`

### 4.3 Connect Custom Domain (Optional)

- Vercel → **Project** → **Settings** → **Domains** → Add `heirring.com` if you own it.

---

## Part 5: Update Backend & OAuth URLs

### 5.1 Update Render Environment

1. Render Dashboard → **heirring-backend** → **Environment**
2. Set:
   - `FRONTEND_URL` = `https://heirring-com.vercel.app` (your Vercel URL)
3. **Save** – Render will automatically redeploy.

### 5.2 Update Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. **Authorized JavaScript origins:** add
   - `https://heirring-com.vercel.app`
   - `https://heirring-backend.onrender.com` (if needed)
4. **Authorized redirect URIs:** add
   - `https://heirring-backend.onrender.com/api/auth/google/callback`
5. Save

### 5.3 Update LinkedIn OAuth

1. [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Your app → **Auth** tab
3. **Authorized redirect URLs:** add
   - `https://heirring-backend.onrender.com/api/auth/linkedin/callback`
4. **OAuth 2.0 scopes:** ensure `openid`, `profile`, `email`
5. Save

---

## Part 6: MongoDB Atlas (If Not Already Set Up)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Create cluster** (free M0)
2. **Database Access** → Create user (username + password)
3. **Network Access** → Add IP: `0.0.0.0/0` (allow from anywhere)
4. **Connect** → **Drivers** → Copy connection string
5. Replace `<password>` with your user password
6. Use this string as `MONGODB_URI` in Render

---

## Part 7: Free Alternatives

### Backend

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Render** | ✅ 750 hrs/month | Sleeps after inactivity |
| **Railway** | ✅ $5 credit/month | ~500 hrs |
| **Fly.io** | ✅ 3 VMs | Good for APIs |
| **Cyclic** | ✅ Free | Node.js focused |

### Frontend

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Vercel** | ✅ Unlimited | Best for Vite/React |
| **Netlify** | ✅ 100GB bandwidth | Similar to Vercel |
| **Cloudflare Pages** | ✅ Unlimited | Fast CDN |

### Netlify (Frontend Alternative)

1. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect repo, set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add env: `VITE_API_URL` = your backend URL
4. Deploy

---

## Part 8: Checklist

- [ ] `.env` and `backend/.env` are in `.gitignore` and not committed
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] Backend deployed on Render with all env vars
- [ ] Frontend deployed on Vercel with `VITE_API_URL`
- [ ] `FRONTEND_URL` in Render set to Vercel URL
- [ ] Google OAuth redirect URIs updated
- [ ] LinkedIn OAuth redirect URIs updated
- [ ] Test login, signup, and OAuth flows

---

## Part 9: Quick Reference – URLs After Deploy

| Service | URL |
|---------|-----|
| **Frontend** | `https://heirring-com.vercel.app` |
| **Backend API** | `https://heirring-backend.onrender.com/api` |
| **MongoDB** | Atlas cluster (connection string in env) |

---

## Troubleshooting

### CORS errors
- Ensure `FRONTEND_URL` in Render matches your Vercel URL (with `https://`)
- Check `allowedOrigins` in `server.js` if you add more origins

### OAuth redirect fails
- Verify callback URLs in Google/LinkedIn match exactly (including `/callback`)
- Ensure `BACKEND_URL` and `FRONTEND_URL` are set in Render

### API calls fail from frontend
- Confirm `VITE_API_URL` in Vercel is correct (must include `/api`)
- Rebuild frontend after changing env vars (Vercel does this automatically)

### Backend sleeps on Render
- Free tier sleeps after ~15 min inactivity
- First request after sleep can take 30–60 seconds
- Consider Railway or Fly.io for less sleep time

---

## Summary

1. Push code to GitHub (without `.env`)
2. Deploy backend to **Render** with env vars
3. Deploy frontend to **Vercel** with `VITE_API_URL`
4. Update OAuth redirect URLs in Google & LinkedIn
5. Set `FRONTEND_URL` in Render to your Vercel URL
6. Test everything end-to-end
