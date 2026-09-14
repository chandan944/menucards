export interface Review {
  id: string;
  storeId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt?: any;
  status?: 'published' | 'hidden';
  reply?: {
    text: string;
    createdAt?: any;
  };
}

export interface StoreReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
