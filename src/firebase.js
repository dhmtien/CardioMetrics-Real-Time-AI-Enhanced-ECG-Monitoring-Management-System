// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: "ecgpocket-c5b8a.firebaseapp.com",
  databaseURL: "https://ecgpocket-c5b8a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecgpocket-c5b8a",
  storageBucket: "ecgpocket-c5b8a.firebasestorage.app",
  messagingSenderId: "1015742861284",
  appId: "1:1015742861284:web:0335ad59e02908f33cc1f1",
  measurementId: "G-SFRQZVGT0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize both databases
const rtdb = getDatabase(app);
const firestore = getFirestore(app);

// THIS IS THE CRITICAL LINE! 
// It exports both so App.vue can use them.
export { rtdb, firestore };