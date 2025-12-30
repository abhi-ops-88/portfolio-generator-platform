import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if Firebase environment variables are available
const hasFirebaseConfig = process.env.REACT_APP_FIREBASE_API_KEY && 
                          process.env.REACT_APP_FIREBASE_PROJECT_ID;

// Your Firebase configuration
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
} : null;

// Log configuration status
if (!hasFirebaseConfig) {
  console.warn('Firebase configuration not found. Authentication features will be disabled.');
  console.warn('Please set the following environment variables:');
  console.warn('- REACT_APP_FIREBASE_API_KEY');
  console.warn('- REACT_APP_FIREBASE_AUTH_DOMAIN');
  console.warn('- REACT_APP_FIREBASE_PROJECT_ID');
  console.warn('- REACT_APP_FIREBASE_STORAGE_BUCKET');
  console.warn('- REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
  console.warn('- REACT_APP_FIREBASE_APP_ID');
}

let app, auth, googleProvider, db, storage;

try {
  if (firebaseConfig) {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Cloud Storage and get a reference to the service
    storage = getStorage(app);
  } else {
    // Create null objects when Firebase is not configured
    app = null;
    auth = null;
    googleProvider = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create null objects to prevent app crashes
  app = null;
  auth = null;
  googleProvider = null;
  db = null;
  storage = null;
}

export { auth, googleProvider, db, storage };
export default app;