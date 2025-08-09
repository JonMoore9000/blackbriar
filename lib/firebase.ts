import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase App safely on server or client
export function getFirebaseApp() {
  if (!getApps().length) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
    } as const;

    // Basic sanity check so we don't crash if not configured yet
    if (!config.apiKey || !config.projectId || !config.appId) {
      throw new Error('Firebase is not configured. Please set your Firebase env vars in .env.local');
    }

    initializeApp(config);
  }
  return getApp();
}

export function getDb() {
  const app = getFirebaseApp();
  return getFirestore(app);
}

