import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxEAHoeL5GkbHojHXczyovB1ejPeZKnqY",
  authDomain: "smartbuy-c1da0.firebaseapp.com",
  projectId: "smartbuy-c1da0",
  storageBucket: "smartbuy-c1da0.firebasestorage.app",
  messagingSenderId: "154213146796",
  appId: "1:154213146796:web:c6975c03df73156ba63f09"
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
