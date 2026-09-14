import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Check, X, User, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { createReview, calculateReviewStats } from '@/services/reviewService';
import { useAuth } from '@/contexts/AuthContext';
import type { Review } from '@/types';
import { clsx } from 'clsx';

interface StoreReviewsSectionProps {
  storeId: string;
  storeName: string;
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export function StoreReviewsSection({
  storeId,
  storeName,
  reviews,
  onReviewAdded,
}: StoreReviewsSectionProps) {
  const { user, loginWithGoogle } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const stats = calculateReviewStats(reviews);

  const handleOpenReviewForm = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!customerName) {
      setCustomerName(user.displayName || user.email?.split('@')[0] || '');
    }
    setShowModal(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await loginWithGoogle();
      setShowAuthModal(false);
      setShowModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setAuthError(msg);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowModal(false);
      setShowAuthModal(true);
      return;
    }
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const reviewData: Omit<Review, 'id' | 'createdAt'> = {
        storeId,
        customerName: customerName.trim(),
        rating,
        comment: comment.trim(),
        status: 'published',
      };

      const id = await createReview(reviewData);

      const newReview: Review = {
        ...reviewData,
        id,
        createdAt: new Date().toISOString(),
      };

      onReviewAdded(newReview);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        setShowModal(false);
        setComment('');
        setRating(5);
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--sf-surface)',
          border: '1px solid var(--sf-border)',
          boxShadow: 'var(--sf-shadow-card)',
        }}
      >
        {/* Background Decorative Mesh Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 border border-amber-500/20">
                <Sparkles className="w-3 h-3" /> Verified Reviews
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2"
              style={{ fontFamily: 'var(--sf-heading-font)', color: 'var(--sf-text)' }}
            >
              <MessageSquare className="w-7 h-7" style={{ color: 'var(--sf-accent)' }} />
              Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--sf-text-secondary)' }}>
              Real feedback from customers of {storeName}
            </p>
          </div>

          <button
            onClick={handleOpenReviewForm}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 shadow-lg active:scale-95 group"
            style={{ backgroundColor: 'var(--sf-accent)' }}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Write a Review
          </button>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl mb-8" style={{ backgroundColor: 'var(--sf-background)', border: '1px solid var(--sf-border)' }}>
          {/* Average score */}
          <div className="flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-surface-200">
            <span className="text-4xl font-extrabold" style={{ color: 'var(--sf-text)' }}>
              {stats.totalReviews > 0 ? stats.averageRating : '0.0'}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={clsx(
                    'w-5 h-5',
                    star <= Math.round(stats.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-surface-300'
                  )}
                />
              ))}
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--sf-text-secondary)' }}>
              Based on {stats.totalReviews} customer {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution Progress Bars */}
          <div className="col-span-2 space-y-2 flex flex-col justify-center">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-medium flex items-center gap-0.5" style={{ color: 'var(--sf-text)' }}>
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sf-surface)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: 'var(--sf-accent)',
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono" style={{ color: 'var(--sf-text-secondary)' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Feed List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--sf-text-secondary)' }}>
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl transition-all"
                style={{ backgroundColor: 'var(--sf-background)', border: '1px solid var(--sf-border)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm"
                      style={{ backgroundColor: 'var(--sf-accent)' }}
                    >
                      {rev.customerName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>
                        {rev.customerName}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={clsx(
                              'w-3.5 h-3.5',
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-surface-300'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px]" style={{ color: 'var(--sf-text-secondary)' }}>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: 'var(--sf-text)' }}>
                  "{rev.comment}"
                </p>

                {/* Owner Reply */}
                {rev.reply && (
                  <div
                    className="mt-3 p-3.5 rounded-xl text-xs space-y-1"
                    style={{
                      backgroundColor: 'var(--sf-surface)',
                      borderLeft: '3px solid var(--sf-accent)',
                    }}
                  >
                    <p className="font-bold flex items-center gap-1.5" style={{ color: 'var(--sf-accent)' }}>
                      Response from {storeName}
                    </p>
                    <p style={{ color: 'var(--sf-text)' }}>{rev.reply.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Sign In Required Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowAuthModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center overflow-hidden border border-amber-500/20"
              style={{ backgroundColor: 'var(--sf-background)' }}
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-100 transition-colors"
                style={{ color: 'var(--sf-text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <LogIn className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--sf-text)', fontFamily: 'var(--sf-heading-font)' }}>
                Sign In Required
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: 'var(--sf-text-secondary)' }}>
                To maintain authentic & verified customer feedback, you must sign in before leaving a review for <strong className="text-amber-500">{storeName}</strong>.
              </p>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold border border-red-500/20">
                  {authError}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold bg-white text-slate-800 border border-slate-200 shadow-md hover:shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <a
                  href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="block w-full py-3.5 px-4 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-sm"
                  style={{ backgroundColor: 'var(--sf-accent)' }}
                >
                  Sign In with Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Write a Review Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setShowModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
              style={{ backgroundColor: 'var(--sf-background)', border: '1px solid var(--sf-border)' }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-100 transition-colors"
                style={{ color: 'var(--sf-text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--sf-text)' }}>
                    Thank You!
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--sf-text-secondary)' }}>
                    Your review has been submitted successfully.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                      <ShieldCheck className="w-4 h-4" /> Signed in as {user.email}
                    </div>
                    <h3 className="text-xl font-extrabold" style={{ color: 'var(--sf-text)', fontFamily: 'var(--sf-heading-font)' }}>
                      Write a Review
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--sf-text-secondary)' }}>
                      Share your experience with {storeName}
                    </p>
                  </div>

                  {/* Interactive Star Rating Selection */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl" style={{ backgroundColor: 'var(--sf-surface)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--sf-text-secondary)' }}>
                      Select Rating
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={clsx(
                              'w-8 h-8 transition-colors',
                              (hoverRating || rating) >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-surface-300'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold mt-2 text-amber-500">
                      {rating === 5 && 'Outstanding! ⭐⭐⭐⭐⭐'}
                      {rating === 4 && 'Very Good! ⭐⭐⭐⭐'}
                      {rating === 3 && 'Average ⭐⭐⭐'}
                      {rating === 2 && 'Fair ⭐⭐'}
                      {rating === 1 && 'Poor ⭐'}
                    </span>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--sf-text)' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--sf-surface)',
                        border: '1px solid var(--sf-border)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--sf-text)' }}>
                      Your Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or enjoy about this store?"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
                      style={{
                        backgroundColor: 'var(--sf-surface)',
                        border: '1px solid var(--sf-border)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--sf-accent)' }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
