import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "smartbuy-c1da0.firebaseapp.com", // Hardcoded to prevent Env Var errors
  projectId: "smartbuy-c1da0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (Singleton pattern with named instance to avoid HMR issues)
const appName = "smartbuy-client";
let app;
const existingApp = getApps().find(a => a.name === appName);
if (existingApp) {
  app = existingApp;
} else {
  app = initializeApp(firebaseConfig, appName);
}

const db = getFirestore(app);
const storage = getStorage(app);

// Enable Offline Persistence
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence failed: Browser not supported');
    }
  });
}

// Initialize Auth and Messaging only on client side to avoid SSR errors
let auth = null;
let messaging = null;
if (typeof window !== "undefined") {
  try {
    auth = getAuth(app);
    messaging = getMessaging(app);
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
  }
}

export { app, db, auth, storage, messaging };
