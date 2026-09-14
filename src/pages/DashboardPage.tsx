// ─── Dashboard Home Page (Claymorphism 3D Theme) ────────────────────────────
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { getActiveDiscounts } from '@/services/discountService';
import { getAnalyticsSummary } from '@/services/analyticsService';
import { Button, Card, Skeleton, EmptyState, PageHeader, Badge, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import {
  Eye, QrCode, ShoppingBag, Tag, Plus, ExternalLink, ArrowRight, CreditCard,
  TrendingUp, BarChart3, Grid3X3, Palette, Settings, Sparkles, Copy, Check, Star
} from 'lucide-react';
import type { Store, AnalyticsSummary } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState<{ products: number; categories: number; offers: number }>({ products: 0, categories: 0, offers: 0 });
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const stores = await getStoresByOwner(user.uid);
        if (stores.length > 0) {
          const s = stores[0];
          setStore(s);

          const [prods, cats, discounts, summary] = await Promise.all([
            getProducts(s.id),
            getCategories(s.id),
            getActiveDiscounts(s.id),
            getAnalyticsSummary(s.id, 30),
          ]);
          setStats({ products: prods.length, categories: cats.length, offers: discounts.length });
          setAnalytics(summary);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    })();
  }, [user, navigate]);

  const copyUrl = () => {
    if (!store) return;
    navigator.clipboard.writeText(`${window.location.origin}/s/${store.slug}`);
    setCopied(true);
    toast.success('Store URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!store) {
    return (
      <EmptyState
        icon={<Sparkles className="w-8 h-8" />}
        title="No store yet"
        description="Create your first 3D digital storefront to get started"
        action={<Link to="/onboarding"><Button icon={<Plus className="w-4 h-4" />}>Create Store</Button></Link>}
      />
    );
  }

  const statCards = [
    { label: 'Store Views', value: analytics?.totalViews || 0, icon: Eye, color: 'text-blue-600 bg-blue-50/80', trend: '+12%' },
    { label: 'QR Scans', value: analytics?.qrScans || 0, icon: QrCode, color: 'text-purple-600 bg-purple-50/80', trend: '+8%' },
    { label: 'Products', value: stats.products, icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50/80' },
    { label: 'Active Offers', value: stats.offers, icon: Tag, color: 'text-amber-600 bg-amber-50/80' },
  ];

  const quickActions = [
    { label: 'Add Product', icon: ShoppingBag, to: '/dashboard/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Add Category', icon: Grid3X3, to: '/dashboard/categories', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'QR Studio', icon: QrCode, to: '/dashboard/qr-studio', color: 'bg-purple-50 text-purple-600' },
    { label: '3D Card Studio', icon: CreditCard, to: '/dashboard/card-studio', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Store Reviews', icon: Star, to: '/dashboard/reviews', color: 'bg-amber-50 text-amber-600' },
    { label: 'Analytics', icon: BarChart3, to: '/dashboard/analytics', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <PageTransition>
      <PageHeader
        title={`Welcome back${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} 👋`}
        description="Here is your 3D digital storefront performance overview"
        action={
          <div className="flex items-center gap-3">
            <Link to={`/s/${store.slug}`} target="_blank">
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>View Public Store</Button>
            </Link>
            {store.status === 'draft' && (
              <Badge variant="warning">Draft Mode</Badge>
            )}
            {store.status === 'published' && (
              <Badge variant="success">Live Store</Badge>
            )}
          </div>
        }
      />

      {/* Clay 3D Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {s.value.toLocaleString()}
                  </p>
                  {s.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">{s.trend} this month</span>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-[4px_4px_10px_rgba(148,163,184,0.12),inset_0_1px_2px_rgba(255,255,255,0.8)] ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to}>
              <Card hover className="!p-5 flex flex-col items-center gap-3 text-center h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-[4px_4px_10px_rgba(148,163,184,0.12),inset_0_1px_2px_rgba(255,255,255,0.8)] ${a.color}`}>
                  <a.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">{a.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Store URL Card */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Your Digital Storefront URL
            </h3>
            <p className="text-xs text-slate-500 mb-3">Share this link or print your 3D QR card for customers to scan</p>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200/80 shadow-[inset_2px_2px_4px_rgba(148,163,184,0.15)] flex items-center gap-2">
                <code className="text-xs font-mono font-bold text-blue-700">
                  {window.location.origin}/s/{store.slug}
                </code>
              </div>
              <button
                onClick={copyUrl}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <Link to="/dashboard/qr-studio">
            <Button variant="primary" size="sm" icon={<QrCode className="w-4 h-4" />}>
              Generate 3D QR Card
            </Button>
          </Link>
        </div>
      </Card>

      {/* Empty states for products */}
      {stats.products === 0 && (
        <Card>
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8" />}
            title="No products added yet"
            description="Add your first product to start building your digital storefront catalog."
            action={
              <Link to="/dashboard/products">
                <Button icon={<Plus className="w-4 h-4" />}>Add Product</Button>
              </Link>
            }
          />
        </Card>
      )}
    </PageTransition>
  );
}
