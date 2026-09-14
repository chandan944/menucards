// ─── Slug Generation Utility ────────────────────────────────────────────────
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, logger } from '@/config/firebase';

/**
 * Converts a string into a URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

/**
 * Checks if a slug is already taken in the slugs collection
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  try {
    const slugRef = doc(db, 'slugs', slug);
    const slugDoc = await getDoc(slugRef);
    return !slugDoc.exists();
  } catch (error) {
    logger.error('Error checking slug availability:', error);
    return false;
  }
}

/**
 * Generates a unique slug by appending numbers if needed
 */
export async function generateUniqueSlug(baseName: string): Promise<string> {
  let slug = createSlug(baseName);
  let counter = 0;
  let candidate = slug;

  while (!(await isSlugAvailable(candidate))) {
    counter++;
    candidate = `${slug}-${counter}`;
    logger.info(`Slug "${slug}" taken, trying "${candidate}"`);
  }

  return candidate;
}

/**
 * Claims a slug by writing it to the slugs collection
 */
export async function claimSlug(slug: string, storeId: string): Promise<void> {
  try {
    await setDoc(doc(db, 'slugs', slug), {
      storeId,
      createdAt: new Date(),
    });
    logger.success(`Slug "${slug}" claimed for store ${storeId}`);
  } catch (error) {
    logger.error('Error claiming slug:', error);
    throw error;
  }
}

/**
 * Releases a slug back to the pool
 */
export async function releaseSlug(slug: string): Promise<void> {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'slugs', slug));
    logger.success(`Slug "${slug}" released`);
  } catch (error) {
    logger.error('Error releasing slug:', error);
  }
}
