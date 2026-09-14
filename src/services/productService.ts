// ─── Product Service ────────────────────────────────────────────────────────
import { where, orderBy } from 'firebase/firestore';
import { getDocument, getCollection, createDocument, updateDocument, removeDocument, batchDelete } from '@/lib/firestore';
import { logger } from '@/config/firebase';
import type { Product, ProductFormData } from '@/types';

const LOG = '[📦 ProductService]';
const getPath = (storeId: string) => `stores/${storeId}/products`;

export async function getProducts(storeId: string): Promise<Product[]> {
  return getCollection<Product>(getPath(storeId), [orderBy('order', 'asc')]);
}

export async function getProductsByCategory(storeId: string, categoryId: string): Promise<Product[]> {
  const items = await getCollection<Product>(getPath(storeId), [
    where('categoryId', '==', categoryId),
  ]);
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getFeaturedProducts(storeId: string): Promise<Product[]> {
  return getCollection<Product>(getPath(storeId), [
    where('featured', '==', true),
    where('status', '==', 'active'),
  ]);
}

export async function getProduct(storeId: string, productId: string): Promise<Product | null> {
  return getDocument<Product>(getPath(storeId), productId);
}

export async function createProduct(storeId: string, data: ProductFormData, imageUrl: string): Promise<string> {
  logger.info(`${LOG} Creating product: ${data.name} in store ${storeId}`);
  
  // Get next order number
  const existing = await getProducts(storeId);
  const maxOrder = existing.reduce((max, p) => Math.max(max, p.order || 0), 0);

  return createDocument(getPath(storeId), {
    ...data,
    storeId,
    mainImage: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    order: maxOrder + 1,
  });
}

export async function updateProduct(
  storeId: string,
  productId: string,
  data: Partial<ProductFormData>
): Promise<void> {
  return updateDocument(getPath(storeId), productId, data as Record<string, unknown>);
}

export async function deleteProduct(storeId: string, productId: string): Promise<void> {
  logger.info(`${LOG} Deleting product: ${productId}`);
  return removeDocument(getPath(storeId), productId);
}

export async function bulkDeleteProducts(storeId: string, productIds: string[]): Promise<void> {
  logger.info(`${LOG} Bulk deleting ${productIds.length} products`);
  return batchDelete(getPath(storeId), productIds);
}

export async function bulkUpdateCategory(
  storeId: string,
  productIds: string[],
  categoryId: string
): Promise<void> {
  logger.info(`${LOG} Bulk updating category for ${productIds.length} products`);
  for (const id of productIds) {
    await updateDocument(getPath(storeId), id, { categoryId });
  }
}

export async function bulkUpdateStatus(
  storeId: string,
  productIds: string[],
  status: string
): Promise<void> {
  logger.info(`${LOG} Bulk updating status for ${productIds.length} products`);
  for (const id of productIds) {
    await updateDocument(getPath(storeId), id, { status });
  }
}

export async function reorderProducts(storeId: string, orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await updateDocument(getPath(storeId), orderedIds[i], { order: i });
  }
}
