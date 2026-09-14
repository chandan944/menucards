// ─── Analytics Types ────────────────────────────────────────────────────────

export type AnalyticsEventType =
  | 'store_view'
  | 'unique_visitor'
  | 'qr_scan'
  | 'product_view'
  | 'category_view'
  | 'offer_click'
  | 'whatsapp_click'
  | 'call_click'
  | 'directions_click'
  | 'social_click'
  | 'share_click';

export interface AnalyticsEvent {
  id: string;
  storeId: string;
  type: AnalyticsEventType;
  timestamp: Date;
  sessionId: string;
  metadata: {
    productId?: string;
    categoryId?: string;
    offerId?: string;
    platform?: string;
    referrer?: string;
    [key: string]: unknown;
  };
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  qrScans: number;
  productViews: number;
  whatsappClicks: number;
  callClicks: number;
  directionsClicks: number;
  topProducts: { id: string; name: string; views: number }[];
  topCategories: { id: string; name: string; views: number }[];
  viewsByDate: { date: string; views: number }[];
}

export type AnalyticsDateRange = 'today' | '7days' | '30days' | 'custom';
