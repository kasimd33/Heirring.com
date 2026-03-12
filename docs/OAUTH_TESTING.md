# OAuth Authentication - Testing Guide

## Overview

The platform supports three login methods:
1. **Email + Password** (existing)
2. **Google OAuth**
3. **LinkedIn OAuth**

After OAuth login, a JWT token is generated and the user is redirected to the frontend with the token in the URL. The frontend stores it and redirects to the dashboard.

---

## 1. Google OAuth Setup

### Get credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or use **Google Identity Services**)
4. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure **OAuth consent screen** if prompted (External user type for testing)
6. Choose **Web application**
7. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
8. Copy **Client ID** and **Client Secret**

### Configure backend

Add to `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

---

## 2. LinkedIn OAuth Setup

### Get credentials

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Under **Auth** tab, add **Redirect URLs**:
   - `http://localhost:5000/api/auth/linkedin/callback` (development)
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)
4. Under **Products**, request access to **Sign In with LinkedIn using OpenID Connect** (recommended) or **Sign In with LinkedIn**
5. Copy **Client ID** and **Client Secret** from the **Auth** tab

### LinkedIn API notes

LinkedIn deprecated `r_liteprofile` and `r_emailaddress` in 2023. If you encounter "Not enough permissions" errors:

- Use **Sign In with LinkedIn using OpenID Connect** product
- The `passport-linkedin-oauth2` package may need scopes: `['openid', 'profile', 'email']`

Update `backend/config/passport.js` if needed:

```javascript
scope: ['openid', 'profile', 'email'],
```

### Configure backend

Add to `backend/.env`:

```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

---

## 3. Test OAuth flow

### Prerequisites

1. Backend running: `cd backend && npm run dev`
2. Frontend running: `npm run dev`
3. `.env` configured with OAuth credentials

### Test Google login

1. Open `http://localhost:5173/login` (or your frontend URL)
2. Click **Continue with Google**
3. You should be redirected to Google sign-in
4. After signing in, you are redirected back to the app with a token
5. You should land on the dashboard

### Test LinkedIn login

1. Open `http://localhost:5173/login`
2. Click **Continue with LinkedIn**
3. You should be redirected to LinkedIn sign-in
4. After signing in, you are redirected back with a token
5. You should land on the dashboard

---

## 4. Test user creation

When a new user logs in via OAuth:

- A new User document is created with `googleId` or `linkedinId`
- Default role: `seeker`
- `profilePicture` / `avatar` is set from the provider
- An Analytics record is created

### Verify in MongoDB

```javascript
db.users.findOne({ googleId: { $exists: true, $ne: null } })
db.users.findOne({ linkedinId: { $exists: true, $ne: null } })
```

---

## 5. Test existing user merge

If a user with the same email already exists (e.g. registered with email/password):

- The existing user is updated with `googleId` or `linkedinId`
- Profile picture is updated if provided
- No duplicate user is created

---

## 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| **Redirect URI mismatch** | Ensure redirect URI in provider console exactly matches `API_BASE_URL/api/auth/{google\|linkedin}/callback` |
| **CORS errors** | Add frontend URL to `FRONTEND_URL` and backend CORS allowed origins |
| **Token not in URL** | Check backend logs; ensure OAuth callback runs and redirects with `?token=...` |
| **LinkedIn "Not enough permissions"** | Switch to OpenID Connect; update scopes to `openid profile email` |
| **Google "Access blocked"** | Configure OAuth consent screen; add test users if app is in testing mode |

---

## 7. Environment variables summary

```env
# Required for OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# URLs (backend and frontend)
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-secret-key
```
