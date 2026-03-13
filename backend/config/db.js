/**
 * MongoDB Database Configuration
 * Establishes connection to MongoDB using Mongoose
 */

import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (retries = 0) => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/heirrati';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    if (uri.includes('mongodb+srv') && error.message?.includes('whitelist')) {
      console.error('\n→ Fix: Add your IP at https://cloud.mongodb.com → Network Access → Add IP Address');
      console.error('→ Or use "Allow from anywhere" (0.0.0.0/0) for development\n');
    }
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retries + 1), RETRY_DELAY_MS);
    } else {
      console.error('Max retries reached. Exiting.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

export default connectDB;
