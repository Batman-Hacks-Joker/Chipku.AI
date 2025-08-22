
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "chatter-insights-oki29",
  appId: "1:705505813131:web:af61bbea57dbcc094e6a8e",
  storageBucket: "chatter-insights-oki29.firebasestorage.app",
  apiKey: "AIzaSyBbcqql-8K1YeiIoXg4RgjdmyvBWehDgio",
  authDomain: "chatter-insights-oki29.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "705505813131"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export { app, auth };
