// ─── Store Reviews Management Page ──────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getStoreReviews, replyToReview, deleteReview, calculateReviewStats } from '@/services/reviewService';
import { Button, Card, Input, Textarea, Modal, EmptyState, Skeleton, PageHeader, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Star, MessageSquare, Reply, Trash2, Search, Filter, CheckCircle2, MessageCircle } from 'lucide-react';
import type { Review, StoreReviewStats } from '@/types';
import { clsx } from 'clsx';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reply Modal
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const stores = await getStoresByOwner(user.uid);
      if (stores.length === 0) {
        setLoading(false);
        return;
      }
      setStoreId(stores[0].id);
      setStoreName(stores[0].name);

      const revs = await getStoreReviews(stores[0].id);
      setReviews(revs);
    } catch (err) {
      console.error('Error loading reviews:', err);
      toast.error('Failed to load store reviews');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const stats: StoreReviewStats = calculateReviewStats(reviews);

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const handleOpenReply = (review: Review) => {
    setReplyingReview(review);
    setReplyText(review.reply?.text || '');
  };

  const handleSaveReply = async () => {
    if (!replyingReview || !replyText.trim() || !storeId) return;
    setSubmittingReply(true);

    try {
      await replyToReview(storeId, replyingReview.id, replyText.trim());
      toast.success('Reply published to customer review!');
      
      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === replyingReview.id
            ? { ...r, reply: { text: replyText.trim(), createdAt: new Date().toISOString() } }
            : r
        )
      );

      setReplyingReview(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!storeId) return;
    try {
      await deleteReview(storeId, reviewId);
      toast.success('Review removed');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove review');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <PageTransition>
      <PageHeader
        title="Store Reviews"
        description={`Manage customer feedback and ratings for ${storeName || 'your store'}`}
      />

      {/* ─── Metric Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4 border-surface-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{stats.averageRating || '0.0'}</p>
            <p className="text-xs text-surface-500 font-medium">Average Store Rating</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-surface-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{stats.totalReviews}</p>
            <p className="text-xs text-surface-500 font-medium">Total Reviews</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-surface-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{stats.distribution[5] || 0}</p>
            <p className="text-xs text-surface-500 font-medium">5-Star Reviews</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-surface-200">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">
              {reviews.filter((r) => r.reply).length}
            </p>
            <p className="text-xs text-surface-500 font-medium">Owner Responses</p>
          </div>
        </Card>
      </div>

      {/* ─── Search & Filters Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search reviews by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-surface-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setRatingFilter('all')}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              ratingFilter === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setRatingFilter(rating)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap',
                ratingFilter === rating
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              )}
            >
              {rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> (
              {stats.distribution[rating as 1 | 2 | 3 | 4 | 5] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* ─── Reviews Feed List ─────────────────────────────────────────── */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8 text-surface-400" />}
          title="No reviews found"
          description={
            searchQuery || ratingFilter !== 'all'
              ? 'Try adjusting your search or filter settings.'
              : 'Customer reviews left on your public storefront will appear here.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-5 hover:shadow-md transition-all border-surface-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {review.customerName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-surface-900">{review.customerName}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={clsx(
                            'w-3.5 h-3.5',
                            star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-surface-200'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-surface-400">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                  <button
                    onClick={() => handleOpenReply(review)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-100 text-surface-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    {review.reply ? 'Edit Reply' : 'Reply'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-surface-700 leading-relaxed bg-surface-50/60 p-3 rounded-xl">
                "{review.comment}"
              </p>

              {/* Owner Reply Display */}
              {review.reply && (
                <div className="mt-3 p-3.5 rounded-xl bg-brand-50/60 border-l-4 border-brand-500 text-xs">
                  <div className="flex items-center justify-between font-bold text-brand-800 mb-1">
                    <span>Response from {storeName}</span>
                    <span className="text-[10px] font-normal text-brand-600">
                      {review.reply.createdAt ? new Date(review.reply.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-surface-800">{review.reply.text}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ─── Reply Modal ────────────────────────────────────────────────── */}
      <Modal
        open={!!replyingReview}
        onClose={() => setReplyingReview(null)}
        title="Reply to Customer Review"
      >
        {replyingReview && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 text-xs">
              <div className="flex items-center gap-2 font-semibold text-surface-900 mb-1">
                <span>{replyingReview.customerName}</span>
                <span className="text-amber-500">{'★'.repeat(replyingReview.rating)}</span>
              </div>
              <p className="text-surface-600 italic">"{replyingReview.comment}"</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Your Public Response
              </label>
              <Textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank the customer for their review or address their feedback..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setReplyingReview(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveReply} loading={submittingReply}>
                Publish Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
