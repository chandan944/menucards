// ─── Analytics Page ─────────────────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getAnalyticsSummary } from '@/services/analyticsService';
import { Card, Skeleton, PageHeader, Badge } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { BarChart3, Eye, QrCode, ShoppingBag, Phone, MessageCircle, MapPin, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';
import type { AnalyticsSummary } from '@/types';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7' | '30' | '90'>('30');

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (!stores.length) { setLoading(false); return; }
    setStoreId(stores[0].id);
    const s = await getAnalyticsSummary(stores[0].id, Number(range));
    setSummary(s);
    setLoading(false);
  }, [user, range]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-2xl" /></div>;

  const stats = [
    { label: 'Total Views', value: summary?.totalViews || 0, icon: Eye, color: 'bg-blue-50 text-blue-600' },
    { label: 'Unique Visitors', value: summary?.uniqueVisitors || 0, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'QR Scans', value: summary?.qrScans || 0, icon: QrCode, color: 'bg-violet-50 text-violet-600' },
    { label: 'Product Views', value: summary?.productViews || 0, icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
    { label: 'WhatsApp Clicks', value: summary?.whatsappClicks || 0, icon: MessageCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Call Clicks', value: summary?.callClicks || 0, icon: Phone, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Analytics"
        description="Track your store performance"
        action={
          <div className="flex gap-1 bg-surface-100 rounded-xl p-1">
            {(['7', '30', '90'] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                range === r ? 'bg-white shadow-sm text-surface-900' : 'text-surface-500 hover:text-surface-700'
              )}>
                {r}d
              </button>
            ))}
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-surface-500">{s.label}</p>
                <p className="text-xl font-bold text-surface-900">{s.value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <h3 className="font-semibold text-surface-900 mb-4">Views Over Time</h3>
        {summary?.viewsByDate && summary.viewsByDate.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.viewsByDate}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e7f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="views" stroke="#5c7cfa" strokeWidth={2} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-surface-400 text-sm">
            <BarChart3 className="w-6 h-6 mr-2" /> No data yet. Share your store to start tracking.
          </div>
        )}
      </Card>

      {/* Top Products */}
      {summary?.topProducts && summary.topProducts.length > 0 && (
        <Card>
          <h3 className="font-semibold text-surface-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {summary.topProducts.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                <div className="flex-1"><p className="text-sm font-medium text-surface-800">{p.name}</p></div>
                <Badge variant="brand">{p.views} views</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageTransition>
  );
}
