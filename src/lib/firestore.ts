// ─── Firestore Helpers & Logger ─────────────────────────────────────────────
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  writeBatch,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, logger } from '@/config/firebase';

const LOG = '[📦 Firestore]';

/**
 * Convert Firestore Timestamps to Dates in a document
 */
export function convertTimestamps<T extends DocumentData>(data: T): T {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (result[key] instanceof Timestamp) {
      (result as Record<string, unknown>)[key] = (result[key] as Timestamp).toDate();
    }
  }
  return result;
}

/**
 * Get a single document by path
 */
export async function getDocument<T>(path: string, id: string): Promise<T | null> {
  try {
    const ref = doc(db, path, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      logger.warn(`${LOG} Document not found: ${path}/${id}`);
      return null;
    }
    return { id: snap.id, ...convertTimestamps(snap.data()) } as T;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Database') || msg.includes('offline') || msg.includes('not found')) {
      logger.warn(`${LOG} Firestore database is not initialized/created in Firebase Console. Returning null for ${path}/${id}.`);
      return null;
    }
    logger.error(`${LOG} Error getting ${path}/${id}:`, error);
    return null;
  }
}

/**
 * Get all documents in a collection with optional constraints
 */
export async function getCollection<T>(
  path: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const ref = collection(db, path);
    const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
    const snap = await getDocs(q);
    const results = snap.docs.map((d) => ({ id: d.id, ...convertTimestamps(d.data()) } as T));
    logger.info(`${LOG} Fetched ${results.length} docs from ${path}`);
    return results;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Database') || msg.includes('offline') || msg.includes('not found')) {
      logger.warn(`${LOG} Firestore database is not created in Firebase Console yet. Returning empty list for ${path}.`);
      return [];
    }
    logger.error(`${LOG} Error fetching ${path}:`, error);
    return [];
  }
}

/**
 * Create a document with auto-generated or custom ID
 */
export async function createDocument(
  path: string,
  data: Record<string, unknown>,
  customId?: string
): Promise<string> {
  try {
    const ref = customId ? doc(db, path, customId) : doc(collection(db, path));
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, docData);
    logger.success(`${LOG} Created doc ${path}/${ref.id}`);
    return ref.id;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Database') || msg.includes('offline') || msg.includes('not found')) {
      const friendlyErr = 'Firestore Database is not created yet in your Firebase Project. Please go to Firebase Console -> Firestore Database -> Click "Create database".';
      logger.error(`${LOG} ${friendlyErr}`);
      throw new Error(friendlyErr);
    }
    logger.error(`${LOG} Error creating doc in ${path}:`, error);
    throw error;
  }
}

/**
 * Update an existing document
 */
export async function updateDocument(
  path: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const ref = doc(db, path, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    logger.success(`${LOG} Updated doc ${path}/${id}`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Database') || msg.includes('offline') || msg.includes('not found')) {
      const friendlyErr = 'Firestore Database is not created yet in your Firebase Project. Please go to Firebase Console -> Firestore Database -> Click "Create database".';
      logger.error(`${LOG} ${friendlyErr}`);
      throw new Error(friendlyErr);
    }
    logger.error(`${LOG} Error updating ${path}/${id}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function removeDocument(path: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, path, id));
    logger.success(`${LOG} Deleted doc ${path}/${id}`);
  } catch (error) {
    logger.error(`${LOG} Error deleting ${path}/${id}:`, error);
    throw error;
  }
}

/**
 * Batch delete multiple documents
 */
export async function batchDelete(path: string, ids: string[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      batch.delete(doc(db, path, id));
    });
    await batch.commit();
    logger.success(`${LOG} Batch deleted ${ids.length} docs from ${path}`);
  } catch (error) {
    logger.error(`${LOG} Batch delete error in ${path}:`, error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on a collection
 */
export function subscribeToCollection<T>(
  path: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const ref = collection(db, path);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  
  return onSnapshot(q, (snap) => {
    const results = snap.docs.map((d) => ({ id: d.id, ...convertTimestamps(d.data()) } as T));
    callback(results);
  }, (error) => {
    logger.error(`${LOG} Subscription error on ${path}:`, error);
  });
}

export { collection, doc, query, where, orderBy, limit, serverTimestamp, writeBatch, onSnapshot };
