import { initializeApp } from "firebase/app";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
