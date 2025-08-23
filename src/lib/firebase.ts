
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: "chatter-insights-oki29",
  appId: "1:705505813131:web:af61bbea57dbcc094e6a8e",
  storageBucket: "chatter-insights-oki29.firebasestorage.app",
  apiKey: "AIzaSyBbcqql-8K1YeiIoXg4RgjdmyvBWehDgio",
  authDomain: "chatter-insights-oki29.web.app",
  measurementId: "",
  messagingSenderId: "705505813131",
  databaseURL: "https://chatter-insights-oki29-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };