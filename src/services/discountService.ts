// ─── Discount Service ───────────────────────────────────────────────────────
import { where, orderBy } from 'firebase/firestore';
import { getDocument, getCollection, createDocument, updateDocument, removeDocument } from '@/lib/firestore';
import { logger } from '@/config/firebase';
import type { Discount, DiscountFormData } from '@/types';

const LOG = '[🏷️ DiscountService]';
const getPath = (storeId: string) => `stores/${storeId}/discounts`;

export async function getDiscounts(storeId: string): Promise<Discount[]> {
  return getCollection<Discount>(getPath(storeId), [orderBy('createdAt', 'desc')]);
}

export async function getActiveDiscounts(storeId: string): Promise<Discount[]> {
  return getCollection<Discount>(getPath(storeId), [
    where('active', '==', true),
  ]);
}

export async function getDiscount(storeId: string, discountId: string): Promise<Discount | null> {
  return getDocument<Discount>(getPath(storeId), discountId);
}

export async function createDiscount(storeId: string, data: DiscountFormData): Promise<string> {
  logger.info(`${LOG} Creating discount: ${data.name}`);
  return createDocument(getPath(storeId), {
    ...data,
    storeId,
    usageCount: 0,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  });
}

export async function updateDiscount(
  storeId: string,
  discountId: string,
  data: Partial<DiscountFormData>
): Promise<void> {
  return updateDocument(getPath(storeId), discountId, data as Record<string, unknown>);
}

export async function deleteDiscount(storeId: string, discountId: string): Promise<void> {
  logger.info(`${LOG} Deleting discount: ${discountId}`);
  return removeDocument(getPath(storeId), discountId);
}

export async function toggleDiscount(storeId: string, discountId: string, active: boolean): Promise<void> {
  return updateDocument(getPath(storeId), discountId, { active });
}
