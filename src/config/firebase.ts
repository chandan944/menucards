// ─── Firebase Configuration with Debug Logging ─────────────────────────────
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// ─── Logger ─────────────────────────────────────────────────────────────────
const LOG_PREFIX = '[🔥 Firebase]';

const logger = {
  info: (msg: string, ...args: unknown[]) => console.log(`${LOG_PREFIX} ℹ️ ${msg}`, ...args),
  success: (msg: string, ...args: unknown[]) => console.log(`${LOG_PREFIX} ✅ ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) => console.warn(`${LOG_PREFIX} ⚠️ ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) => console.error(`${LOG_PREFIX} ❌ ${msg}`, ...args),
  group: (label: string) => console.group(`${LOG_PREFIX} ${label}`),
  groupEnd: () => console.groupEnd(),
};

// ─── Config Validation ──────────────────────────────────────────────────────
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_APP_ID',
] as const;

const missingVars = requiredEnvVars.filter((key) => !import.meta.env[key]);
if (missingVars.length > 0) {
  logger.error('Missing required environment variables:', missingVars);
  throw new Error(`Firebase config incomplete. Missing: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ─── Initialize Firebase ────────────────────────────────────────────────────
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  logger.group('Initialization');
  logger.info('Starting Firebase initialization...');
  logger.info('Project ID:', firebaseConfig.projectId);
  logger.info('Auth Domain:', firebaseConfig.authDomain);

  app = initializeApp(firebaseConfig);
  logger.success('Firebase App initialized');

  auth = getAuth(app);
  logger.success('Firebase Auth initialized');

  db = getFirestore(app);
  logger.success('Firestore initialized');

  storage = getStorage(app);
  logger.success('Firebase Storage initialized');

  // ─── Emulator Support (Development) ─────────────────────────────────────
  if (import.meta.env.VITE_USE_EMULATORS === 'true') {
    logger.warn('Using Firebase Emulators');
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    logger.success('All emulators connected');
  }

  logger.groupEnd();
  logger.success('🚀 Firebase fully initialized and ready');
} catch (error) {
  logger.groupEnd();
  logger.error('Failed to initialize Firebase:', error);
  throw error;
}

// ─── Auth State Logger ──────────────────────────────────────────────────────
auth.onAuthStateChanged((user) => {
  if (user) {
    logger.info(`Auth state: User signed in [${user.uid}] ${user.email || 'No email'}`);
  } else {
    logger.info('Auth state: No user signed in');
  }
});

export { app, auth, db, storage, logger };
export default app;
