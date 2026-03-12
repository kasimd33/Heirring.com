/**
 * Cloudinary upload utility
 * Falls back to local path if Cloudinary not configured
 */

import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUME_FOLDER = path.join(__dirname, '../uploads/resumes');

export async function uploadResumeToCloudinary(buffer, originalName, userId) {
  const hasConfig = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  if (!hasConfig) {
    return uploadResumeLocal(buffer, originalName, userId);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'heirring/resumes',
        resource_type: 'auto',
        public_id: `resume_${userId}_${Date.now()}`,
      },
      (err, result) => {
        if (err) {
          console.error('[Cloudinary] Upload failed:', err.message);
          return uploadResumeLocal(buffer, originalName, userId).then(resolve).catch(reject);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function uploadResumeLocal(buffer, originalName, userId) {
  if (!fs.existsSync(RESUME_FOLDER)) {
    fs.mkdirSync(RESUME_FOLDER, { recursive: true });
  }
  const ext = path.extname(originalName) || '.pdf';
  const filename = `resume_${userId}_${Date.now()}${ext}`;
  const filepath = path.join(RESUME_FOLDER, filename);
  fs.writeFileSync(filepath, buffer);
  const base = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base}/uploads/resumes/${filename}`;
}
