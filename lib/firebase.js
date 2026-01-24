import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "smartbuy-c1da0.firebaseapp.com", // Hardcoded to prevent Env Var errors
  projectId: "smartbuy-c1da0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug: Check if config is loaded (Check browser console)
if (typeof window !== "undefined") {
  console.log("Firebase Config Loaded:", {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
}

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

// Initialize Auth only on client side to avoid SSR errors
let auth = null;
if (typeof window !== "undefined") {
  try {
    auth = getAuth(app);
  } catch (e) {
    console.error("Firebase Auth Initialization Error:", e);
  }
}

export { app, db, auth, storage };
