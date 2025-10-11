// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBEhBkOBRgiEPSksuzG2cLtY82tFBlALs8",
  authDomain: "gourmet-haus-524a3.firebaseapp.com",
  projectId: "gourmet-haus-524a3",
  storageBucket: "gourmet-haus-524a3.firebasestorage.app",
  messagingSenderId: "481229502425",
  appId: "1:481229502425:web:e714893bd5b5e06a2b8bc8",
  measurementId: "G-02GHR6Q979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
