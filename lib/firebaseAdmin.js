import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let firebaseApp;

if (!firebaseApp) {
  let serviceAccount;
  
  // Try to load from file first
  try {
    const keyPath = path.join(__dirname, '../server/config/serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
      const keyContent = fs.readFileSync(keyPath, 'utf-8');
      serviceAccount = JSON.parse(keyContent);
    }
  } catch (err) {
    console.log('Could not load serviceAccountKey.json from file');
  }
  
  // Fall back to environment variable
  if (!serviceAccount) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      throw new Error('Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_KEY or provide server/config/serviceAccountKey.json');
    }
  }
  
  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    firebaseApp = admin.app();
  }
}

export default firebaseApp;
