// ─── Category Service ───────────────────────────────────────────────────────
import { orderBy } from 'firebase/firestore';
import { getDocument, getCollection, createDocument, updateDocument, removeDocument } from '@/lib/firestore';
import { logger } from '@/config/firebase';
import type { Category, CategoryFormData } from '@/types';

const LOG = '[📁 CategoryService]';
const getPath = (storeId: string) => `stores/${storeId}/categories`;

export async function getCategories(storeId: string): Promise<Category[]> {
  return getCollection<Category>(getPath(storeId), [orderBy('order', 'asc')]);
}

export async function getCategory(storeId: string, categoryId: string): Promise<Category | null> {
  return getDocument<Category>(getPath(storeId), categoryId);
}

export async function createCategory(storeId: string, data: CategoryFormData): Promise<string> {
  logger.info(`${LOG} Creating category: ${data.name}`);
  const existing = await getCategories(storeId);
  const maxOrder = existing.reduce((max, c) => Math.max(max, c.order || 0), 0);

  return createDocument(getPath(storeId), {
    ...data,
    storeId,
    order: maxOrder + 1,
    productCount: 0,
  });
}

export async function updateCategory(
  storeId: string,
  categoryId: string,
  data: Partial<CategoryFormData>
): Promise<void> {
  return updateDocument(getPath(storeId), categoryId, data as Record<string, unknown>);
}

export async function deleteCategory(storeId: string, categoryId: string): Promise<void> {
  logger.info(`${LOG} Deleting category: ${categoryId}`);
  return removeDocument(getPath(storeId), categoryId);
}

export async function reorderCategories(storeId: string, orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await updateDocument(getPath(storeId), orderedIds[i], { order: i });
  }
}
