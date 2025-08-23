
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "chatter-insights-oki29",
  appId: "1:705505813131:web:af61bbea57dbcc094e6a8e",
  storageBucket: "chatter-insights-oki29.firebasestorage.app",
  apiKey: "AIzaSyBbcqql-8K1YeiIoXg4RgjdmyvBWehDgio",
  authDomain: "chatter-insights-oki29.web.app",
  measurementId: "",
  messagingSenderId: "705505813131"
};

// When running locally, override authDomain to use localhost
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    firebaseConfig.authDomain = 'localhost';
}
{/**hi */}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
