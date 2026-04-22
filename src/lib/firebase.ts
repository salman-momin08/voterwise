import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;
let _auth: any = null;
let _db: any = null;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  _auth = getAuth(app);
  _db = getFirestore(app);
  
  // Robust Synchronous Configuration
  setPersistence(_auth, browserLocalPersistence).catch(console.error);

  // Initialize App Check for Production Security
  if (import.meta.env.PROD) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_KEY || ''),
      isTokenAutoRefreshEnabled: true
    });
  }
}

export const getFirebaseAuth = () => _auth;
export const getFirebaseDb = () => _db;

// Compatibility bridge for legacy modules
export const auth = _auth;
export const db = _db;

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
  } catch (e) {
    return null;
  }
};

export default app;
