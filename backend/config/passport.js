/**
 * Passport OAuth Configuration
 * Google and LinkedIn strategies
 */

import dotenv from 'dotenv';
dotenv.config(); // Must load before reading process.env

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import jwt from 'jsonwebtoken';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_BASE = process.env.API_BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';

export function generateOAuthToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
}

function oAuthCallback() {
  return (req, res) => {
    const token = generateOAuthToken(req.user._id);
    const redirectUrl = `${FRONTEND_URL}/login?token=${token}`;
    res.redirect(redirectUrl);
  };
}

export function getOAuthFailureRedirect() {
  return `${FRONTEND_URL}/login?error=oauth`;
}

// Google OAuth Strategy (only if credentials are configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_BASE}/api/auth/google/callback`,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.name?.givenName || 'User';
        const profilePicture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email from Google profile'));
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email.toLowerCase() }],
        });

        if (!user) {
          user = await User.create({
            name,
            email: email.toLowerCase(),
            googleId: profile.id,
            profilePicture: profilePicture || null,
            avatar: profilePicture || null,
            role: 'seeker',
          });
          await Analytics.create({ userId: user._id });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (profilePicture) {
            user.profilePicture = profilePicture;
            user.avatar = profilePicture;
          }
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
  );
} else {
  console.warn('[Passport] Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
}

// LinkedIn OAuth Strategy (only if credentials are configured)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${API_BASE}/api/auth/linkedin/callback`,
      scope: ['r_liteprofile', 'r_emailaddress'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name =
          profile.displayName ||
          [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ') ||
          'User';
        const profilePicture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email from LinkedIn profile'));
        }

        let user = await User.findOne({
          $or: [{ linkedinId: profile.id }, { email: email.toLowerCase() }],
        });

        if (!user) {
          user = await User.create({
            name,
            email: email.toLowerCase(),
            linkedinId: profile.id,
            profilePicture: profilePicture || null,
            avatar: profilePicture || null,
            role: 'seeker',
          });
          await Analytics.create({ userId: user._id });
        } else if (!user.linkedinId) {
          user.linkedinId = profile.id;
          if (profilePicture) {
            user.profilePicture = profilePicture;
            user.avatar = profilePicture;
          }
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
  );
} else {
  console.warn('[Passport] LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.');
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { oAuthCallback };
