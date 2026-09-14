// ─── Review Service ─────────────────────────────────────────────────────────
import { where, orderBy } from 'firebase/firestore';
import { getCollection, createDocument, updateDocument, removeDocument } from '@/lib/firestore';
import { logger } from '@/config/firebase';
import type { Review, StoreReviewStats } from '@/types';

const LOG = '[⭐ ReviewService]';

// ─── Default Sample Reviews for new stores / fallback demo ──────────────────
const DEFAULT_DEMO_REVIEWS: Omit<Review, 'id' | 'storeId'>[] = [
  {
    customerName: 'Sarah Jenkins',
    rating: 5,
    comment: 'Amazing experience! Loved the fast service and great quality products.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'published',
    reply: {
      text: 'Thank you Sarah! We are thrilled to hear you enjoyed your visit!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    customerName: 'Alex Rivera',
    rating: 5,
    comment: 'Super easy to order using the QR menu. Highly recommended!',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'published',
  },
  {
    customerName: 'Michael Chang',
    rating: 4,
    comment: 'Great selection of items and friendly staff. Will definitely visit again.',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    status: 'published',
  },
];

export async function getStoreReviews(storeId: string): Promise<Review[]> {
  logger.info(`${LOG} Fetching reviews for storeId: ${storeId}`);
  try {
    const reviews = await getCollection<Review>(`stores/${storeId}/reviews`, [
      orderBy('createdAt', 'desc'),
    ]);
    return reviews;
  } catch (err) {
    logger.warn(`${LOG} Failed to fetch Firestore reviews:`, err);
    return [];
  }
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  logger.info(`${LOG} Creating review for store: ${data.storeId}`);
  const reviewData = {
    ...data,
    rating: Number(data.rating),
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  try {
    const reviewId = await createDocument(`stores/${data.storeId}/reviews`, reviewData);
    logger.success(`${LOG} Review created successfully: ${reviewId}`);
    return reviewId;
  } catch (err) {
    logger.error(`${LOG} Error creating review in Firestore:`, err);
    return `local-rev-${Date.now()}`;
  }
}

export async function replyToReview(storeId: string, reviewId: string, replyText: string): Promise<void> {
  logger.info(`${LOG} Adding reply to review ${reviewId}`);
  const reply = {
    text: replyText,
    createdAt: new Date().toISOString(),
  };

  if (reviewId.startsWith('demo-review-')) {
    // Demo review update handled gracefully
    return;
  }

  await updateDocument(`stores/${storeId}/reviews`, reviewId, { reply });
}

export async function deleteReview(storeId: string, reviewId: string): Promise<void> {
  logger.info(`${LOG} Deleting review: ${reviewId}`);
  if (reviewId.startsWith('demo-review-')) return;
  await removeDocument(`stores/${storeId}/reviews`, reviewId);
}

export function calculateReviewStats(reviews: Review[]): StoreReviewStats {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[rating] = (distribution[rating] || 0) + 1;
    sum += r.rating;
  });

  const averageRating = Number((sum / reviews.length).toFixed(1));

  return {
    averageRating,
    totalReviews: reviews.length,
    distribution,
  };
}
