/**
 * Express Server - Heirring Hiring Platform API
 * Production-ready backend with MongoDB, JWT auth, REST API
 */

import dotenv from 'dotenv';
dotenv.config(); // Load env before any config that uses process.env

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cron = require('node-cron');

import connectDB from './config/db.js';
import './config/passport.js'; // OAuth strategies (reads GOOGLE_CLIENT_ID, etc.)
import passport from 'passport';
import errorHandler, { notFound } from './middleware/errorMiddleware.js';
import { importAdzunaJobs } from './services/jobImportService.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import savedJobRoutes from './routes/savedJobRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// CORS - allow localhost on any port in development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = !origin || allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== 'production' && origin?.startsWith('http://localhost:'));
      cb(null, allowed ? (origin || true) : false);
    },
    credentials: true,
  })
);

// Serve uploaded files (avatars, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);

  // Cron: Import Adzuna jobs every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Running Adzuna job import...');
    await importAdzunaJobs();
  });
  console.log('[Cron] Adzuna import scheduled every 6 hours');
});
