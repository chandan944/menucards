// ─── Auth Context ───────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, logger } from '@/config/firebase';

const LOG = '[🔐 Auth]';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Create or update user document in Firestore
async function syncUserDoc(user: FirebaseUser) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      logger.info(`${LOG} Creating user document for ${user.uid}`);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        avatar: user.photoURL || '',
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Database') || msg.includes('offline') || msg.includes('not found')) {
      logger.warn(`${LOG} Firestore database '(default)' is not created yet in Firebase Console. Authentication succeeded. Please enable Firestore Database in Firebase Console.`);
    } else {
      logger.warn(`${LOG} Could not sync user doc:`, msg);
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logger.info(`${LOG} Setting up auth listener...`);
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        logger.success(`${LOG} User authenticated: ${firebaseUser.email}`);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        await syncUserDoc(firebaseUser);
      } else {
        logger.info(`${LOG} No user`);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      logger.info(`${LOG} Logging in: ${email}`);
      await signInWithEmailAndPassword(auth, email, password);
      logger.success(`${LOG} Login successful`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      logger.error(`${LOG} Login error:`, msg);
      setError(formatAuthError(msg));
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      logger.info(`${LOG} Registering: ${email}`);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await syncUserDoc(cred.user);
      logger.success(`${LOG} Registration successful`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      logger.error(`${LOG} Register error:`, msg);
      setError(formatAuthError(msg));
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      logger.info(`${LOG} Google sign-in...`);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      logger.success(`${LOG} Google sign-in successful`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      logger.error(`${LOG} Google sign-in error:`, msg);
      setError(formatAuthError(msg));
      throw err;
    }
  };

  const loginAsDemoUser = async () => {
    try {
      setError(null);
      logger.info(`${LOG} Logging in as Demo Store Owner...`);
      const demoEmail = 'demo@storefront.app';
      const demoPassword = 'DemoUser123!';

      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      } catch (err: any) {
        if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential' || String(err).includes('invalid-credential') || String(err).includes('user-not-found')) {
          try {
            const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
            await updateProfile(cred.user, { displayName: 'Demo Store Owner' });
            await syncUserDoc(cred.user);
          } catch {
            setUser({
              uid: 'demo-store-owner-id',
              email: demoEmail,
              displayName: 'Demo Store Owner',
              photoURL: '',
            });
          }
        } else {
          setUser({
            uid: 'demo-store-owner-id',
            email: demoEmail,
            displayName: 'Demo Store Owner',
            photoURL: '',
          });
        }
      }
      logger.success(`${LOG} Demo store owner login complete`);
    } catch (err: unknown) {
      logger.warn(`${LOG} Demo login fallback activated`);
      setUser({
        uid: 'demo-store-owner-id',
        email: 'demo@storefront.app',
        displayName: 'Demo Store Owner',
        photoURL: '',
      });
    }
  };

  const logout = async () => {
    logger.info(`${LOG} Logging out...`);
    await signOut(auth);
    logger.success(`${LOG} Logged out`);
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      logger.success(`${LOG} Password reset email sent to ${email}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      logger.error(`${LOG} Password reset error:`, msg);
      setError(formatAuthError(msg));
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, loginWithGoogle, loginAsDemoUser, logout, resetPassword, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function formatAuthError(msg: string): string {
  if (msg.includes('unauthorized-domain')) {
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your Vercel domain';
    return `Unauthorized Domain: Firebase blocked Google OAuth on "${currentDomain}". To fix, add "${currentDomain}" in Firebase Console -> Authentication -> Settings -> Authorized Domains. Or click "Sign In as Demo Owner" below!`;
  }
  if (msg.includes('user-not-found')) return 'No account found with this email';
  if (msg.includes('wrong-password')) return 'Incorrect password';
  if (msg.includes('email-already-in-use')) return 'An account already exists with this email';
  if (msg.includes('weak-password')) return 'Password should be at least 6 characters';
  if (msg.includes('invalid-email')) return 'Invalid email address';
  if (msg.includes('too-many-requests')) return 'Too many attempts. Try again later';
  if (msg.includes('popup-closed-by-user')) return 'Sign-in popup was closed';
  if (msg.includes('invalid-credential')) return 'Invalid email or password';
  return msg;
}

export default AuthContext;
