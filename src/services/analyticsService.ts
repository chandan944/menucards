// ─── Analytics Service ──────────────────────────────────────────────────────
import { where, orderBy, limit } from 'firebase/firestore';
import { getCollection, createDocument } from '@/lib/firestore';
import { logger } from '@/config/firebase';
import type { AnalyticsEvent, AnalyticsSummary, AnalyticsEventType } from '@/types';

const LOG = '[📊 AnalyticsService]';
const getPath = (storeId: string) => `stores/${storeId}/analytics`;

// Generate a simple session ID
function getSessionId(): string {
  let sid = sessionStorage.getItem('sf_session');
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('sf_session', sid);
  }
  return sid;
}

export async function trackEvent(
  storeId: string,
  type: AnalyticsEventType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await createDocument(getPath(storeId), {
      storeId,
      type,
      sessionId: getSessionId(),
      metadata: {
        ...metadata,
        platform: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        referrer: document.referrer || 'direct',
      },
    });
  } catch (error) {
    logger.warn(`${LOG} Failed to track event:`, error);
  }
}

export async function getAnalyticsSummary(
  storeId: string,
  days: number = 30
): Promise<AnalyticsSummary> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await getCollection<AnalyticsEvent>(getPath(storeId), [
    where('createdAt', '>=', since),
    orderBy('createdAt', 'desc'),
  ]);

  const sessions = new Set(events.map((e) => e.sessionId));
  const byType = (t: AnalyticsEventType) => events.filter((e) => e.type === t).length;

  // Product view counts
  const productViews = events
    .filter((e) => e.type === 'product_view' && e.metadata?.productId)
    .reduce<Record<string, { id: string; name: string; views: number }>>((acc, e) => {
      const pid = e.metadata.productId as string;
      if (!acc[pid]) acc[pid] = { id: pid, name: (e.metadata.productName as string) || pid, views: 0 };
      acc[pid].views++;
      return acc;
    }, {});

  // Views by date
  const viewsByDate = events
    .filter((e) => e.type === 'store_view')
    .reduce<Record<string, number>>((acc, e) => {
      const d = e.timestamp instanceof Date ? e.timestamp : new Date();
      const key = d.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  return {
    totalViews: byType('store_view'),
    uniqueVisitors: sessions.size,
    qrScans: byType('qr_scan'),
    productViews: byType('product_view'),
    whatsappClicks: byType('whatsapp_click'),
    callClicks: byType('call_click'),
    directionsClicks: byType('directions_click'),
    topProducts: Object.values(productViews).sort((a, b) => b.views - a.views).slice(0, 10),
    topCategories: [],
    viewsByDate: Object.entries(viewsByDate)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}
