# Fix: Backend connection errors (ERR_NAME_NOT_RESOLVED / Failed to fetch)

## Current backend: Render.com

- **URL:** `https://heirring-com-5.onrender.com`
- **API base:** `https://heirring-com-5.onrender.com/api`

---

## Common causes

1. **Render service is sleeping** (free tier spins down after ~15 min inactivity)
2. **Wrong URL** – ensure frontend uses the correct Render URL
3. **DNS/domain** – `ERR_NAME_NOT_RESOLVED` means domain cannot be found

---

## Steps to fix

### 1. Ensure Render service is running

- Go to [render.com](https://render.com) → your backend service
- Check status is **Running** (not sleeping)
- First request after sleep may take 30–60 seconds

### 2. Verify backend is reachable

Open in browser:

```
https://heirring-com-5.onrender.com/api/health
```

Expected: `{"success":true,"message":"API is running"}` or similar.

### 3. Update frontend URL (if needed)

- **Vercel:** Settings → Environment Variables → `VITE_API_URL` = `https://heirring-com-5.onrender.com/api`
- **Or in code:** `src/api/client.js` → `PRODUCTION_API_URL`
