
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  projectId: "chatter-insights-oki29",
  appId: "1:705505813131:web:af61bbea57dbcc094e6a8e",
  storageBucket: "chatter-insights-oki29.firebasestorage.app",
  apiKey: "AIzaSyBbcqql-8K1YeiIoXg4RgjdmyvBWehDgio",
  authDomain: "chatter-insights-oki29.web.app",
  measurementId: "",
  messagingSenderId: "705505813131"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// When running locally, connect to the local Auth Emulator
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // The default port for the Auth Emulator is 9099
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}


export { app, auth };
