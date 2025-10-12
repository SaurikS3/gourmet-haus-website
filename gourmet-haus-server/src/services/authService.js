import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const googleProvider = auth ? new GoogleAuthProvider() : null;

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user profile in Firestore
    await createUserProfile(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  if (!auth) {
    console.warn('Firebase authentication is not configured');
    return;
  }
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Create or update user profile in Firestore
export const createUserProfile = async (user) => {
  if (!user || !db) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create new user profile
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'customer' // Default role
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  } else {
    // Update last login
    try {
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  if (!auth) {
    console.warn('Firebase authentication is not configured');
    // Call callback with null to indicate no user
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
};
