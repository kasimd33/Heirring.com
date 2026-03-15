/**
 * MongoDB Database Configuration
 * Establishes connection to MongoDB using Mongoose
 */

import dns from 'node:dns';
import mongoose from 'mongoose';

// Fix querySrv ECONNREFUSED on Windows - Node may use broken DNS resolver
dns.setServers(['1.1.1.1', '8.8.8.8']);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

/** Convert Atlas SRV URI to standard format (bypasses SRV/SSL issues on Windows) */
function srvToStandardUri(srvUri) {
  try {
    const match = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)(\?.*)?/);
    if (!match) return null;
    const [, user, pass, host, db, qs = ''] = match;
    const clusterName = host.split('.')[0];
    const hosts = ['00', '01', '02'].map((n) => `${clusterName}-shard-00-${n}.${host.split('.').slice(1).join('.')}`).join(':27017,') + ':27017';
    const params = new URLSearchParams((qs || '').replace('?', ''));
    params.set('ssl', 'true');
    params.set('authSource', 'admin');
    params.set('replicaSet', process.env.MONGODB_REPLICA_SET || `atlas${host.split('.')[1]}-shard-0`);
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts}/${db}?${params}`;
  } catch {
    return null;
  }
}

const connectDB = async (retries = 0, useStandardFallback = false) => {
  let uri = process.env.MONGODB_URI_STANDARD || process.env.MONGODB_URI || 'mongodb://localhost:27017/heirrati';
  if (useStandardFallback && uri.includes('mongodb+srv')) {
    const standardUri = srvToStandardUri(uri);
    if (standardUri) {
      console.log('[MongoDB] Retrying with standard connection string (no SRV)...');
      uri = standardUri;
    }
  }
  try {
    const options = {
      serverSelectionTimeoutMS: 15000,
      bufferCommands: true,
      autoSelectFamily: false,
      family: 4,
      tlsAllowInvalidCertificates: true,
    };
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    if (uri.includes('mongodb+srv') && error.message?.includes('whitelist')) {
      console.error('\n→ Fix: Add your IP at https://cloud.mongodb.com → Network Access → Add IP Address');
      console.error('→ Or use "Allow from anywhere" (0.0.0.0/0) for development\n');
    }
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      const isSslError = /SSL|ECONNREFUSED|tlsv1/i.test(error.message);
      return connectDB(retries + 1, isSslError || useStandardFallback);
    }
    console.error('Max retries reached. Exiting.');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

export default connectDB;
