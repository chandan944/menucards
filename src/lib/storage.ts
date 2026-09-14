// ─── Firebase Storage Helpers ───────────────────────────────────────────────
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, logger } from '@/config/firebase';
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from './constants';

const LOG = '[🗃️ Storage]';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

/**
 * Validate an image file before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File too large: ${sizeMB}MB. Maximum: 5MB` };
  }
  return { valid: true };
}

/**
 * Compress an image before upload using canvas
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            logger.info(`${LOG} Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
            resolve(blob);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File | Blob,
  path: string,
  fileName?: string
): Promise<UploadResult> {
  try {
    const name = fileName || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fullPath = `${path}/${name}`;
    const storageRef = ref(storage, fullPath);

    logger.info(`${LOG} Uploading to ${fullPath}...`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    logger.success(`${LOG} Upload complete: ${fullPath} (${(snapshot.metadata.size! / 1024).toFixed(0)}KB)`);
    
    return {
      url,
      path: fullPath,
      size: snapshot.metadata.size || 0,
    };
  } catch (error) {
    logger.error(`${LOG} Upload failed:`, error);
    throw error;
  }
}

/**
 * Helper to convert Blob/File to Base64 Data URL string instantly
 */
export function blobToBase64(blob: Blob | File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Upload an image: Uses high-performance client-side WebP compression to Base64.
 * 100% FREE on Firebase Spark plan (requires ZERO paid Firebase Storage billing/upgrade!).
 */
export async function uploadImage(
  file: File,
  _storagePath?: string,
  options?: { maxWidth?: number; quality?: number; skipCompression?: boolean }
): Promise<UploadResult> {
  // Validate
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Compress to lightweight WebP (~15KB - 30KB)
  let uploadBlob: File | Blob = file;
  if (!options?.skipCompression) {
    try {
      uploadBlob = await compressImage(file, options?.maxWidth || 800, options?.quality || 0.75);
    } catch {
      uploadBlob = file;
    }
  }

  // Convert instantly to Base64 data URL
  const base64Url = await blobToBase64(uploadBlob);
  logger.success(`${LOG} Image compressed & converted to 100% free WebP Base64 (${(uploadBlob.size / 1024).toFixed(0)}KB)`);

  return {
    url: base64Url,
    path: `free-storage/${Date.now()}`,
    size: uploadBlob.size,
  };
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    logger.success(`${LOG} Deleted: ${path}`);
  } catch (error) {
    logger.warn(`${LOG} Delete failed (may not exist): ${path}`, error);
  }
}
