import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId) || import.meta.env.MODE === 'test';

let app: FirebaseApp | undefined;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  _auth = getAuth(app);
  _db = getFirestore(app);
  _functions = getFunctions(app, 'asia-south1'); // Using India region for lower latency
  
  // Robust Synchronous Configuration
  setPersistence(_auth, browserLocalPersistence).catch(console.error);

  // Initialize App Check for Production Security
  if (import.meta.env.PROD) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_KEY),
      isTokenAutoRefreshEnabled: true
    });
  }
}

export const getFirebaseAuth = () => {
  if (!_auth) throw new Error("Firebase Auth not initialized. Check your environment variables.");
  return _auth;
};

export const getFirebaseDb = () => {
  if (!_db) throw new Error("Firestore not initialized. Check your environment variables.");
  return _db;
};

export const getFirebaseFunctions = () => {
  if (!_functions) throw new Error("Functions not initialized. Check your environment variables.");
  return _functions;
};

// Compatibility bridge for legacy modules
export const auth = _auth as Auth;
export const db = _db as Firestore;

export const initAnalytics = async () => {
  if (!app) return null;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  const supported = await isSupported();
  return supported ? getAnalytics(app) : null;
};

export const initPerformance = async () => {
  if (!app) return null;
  const { getPerformance } = await import('firebase/performance');
  try {
    return getPerformance(app);
  } catch {
    return null;
  }
};

export default app;
