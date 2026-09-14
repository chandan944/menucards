// ─── Appearance / Theme Page ────────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner, updateStoreTheme, publishStore, unpublishStore } from '@/services/storeService';
import { themeList } from '@/themes/themeRegistry';
import { Button, Card, Input, Select, PageHeader, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Check, Palette, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { Store, StoreThemeSettings } from '@/types';

export default function AppearancePage() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [theme, setTheme] = useState<StoreThemeSettings>({ themeId: 'macha_boba', customColors: {}, customTypography: {}, customRadius: '', customAnimationIntensity: 'medium' });
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (stores.length > 0) {
      setStore(stores[0]);
      if (stores[0].theme) setTheme(stores[0].theme);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      await updateStoreTheme(store.id, theme);
      toast.success('Theme updated successfully!');
    } catch { toast.error('Failed to update theme'); }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!store) return;
    try {
      if (store.status === 'published') { await unpublishStore(store.id); toast.info('Store unpublished'); }
      else { await publishStore(store.id); toast.success('Store published! 🎉'); }
      await load();
    } catch { toast.error('Failed to update status'); }
  };

  const filteredThemes = filterCategory === 'all'
    ? themeList
    : themeList.filter(t => t.category?.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <PageTransition>
      <PageHeader
        title="Storefront Theme & Appearance"
        description="Choose from 15 high-end templates inspired by world-class menus, cafes, & bistros"
        action={
          <div className="flex gap-2">
            {store && (
              <Button variant={store.status === 'published' ? 'secondary' : 'success'} onClick={handlePublish} icon={store.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}>
                {store.status === 'published' ? 'Unpublish' : 'Publish Store'}
              </Button>
            )}
            {store && (
              <a href={`/s/${store.slug}`} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>Preview Storefront</Button>
              </a>
            )}
          </div>
        }
      />

      {/* Theme Catalog Section */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-200">
          <div>
            <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-600" /> 15 Premium Templates
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">Click any template to instantly apply its colors, fonts, hero design, & badge styling</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'All 15' },
              { id: 'boba', label: 'Boba & Tea' },
              { id: 'sweets', label: 'Pastry & Sweets' },
              { id: 'asian', label: 'Asian & Poke' },
              { id: 'biryani', label: 'Biryani & Indian' },
              { id: 'organic', label: 'Organic & Bistro' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                  filterCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredThemes.map((t) => {
            const isActive = theme.themeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme({ ...theme, themeId: t.id })}
                className={clsx(
                  'group relative rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between text-left',
                  isActive
                    ? 'border-brand-500 shadow-lg ring-2 ring-brand-500/20 scale-[1.02]'
                    : 'border-surface-200 hover:border-surface-400 hover:shadow-md'
                )}
                style={{ backgroundColor: t.colors.surface }}
              >
                {/* Hero Preview Thumbnail */}
                <div className="relative h-28 overflow-hidden bg-slate-900">
                  <img src={t.heroImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase border border-white/20">
                    {t.category || 'Store'}
                  </div>

                  {isActive && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Theme Meta Info */}
                <div className="p-3 flex-1 flex flex-col justify-between" style={{ color: t.colors.text }}>
                  <div>
                    <h4 className="text-sm font-extrabold" style={{ fontFamily: t.typography.headingFont }}>{t.name}</h4>
                    <p className="text-[11px] leading-snug opacity-75 line-clamp-2 mt-0.5">{t.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[t.colors.primary, t.colors.accent, t.colors.background].map((c, i) => (
                        <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/5">
                      {t.badgeText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Customization Options */}
      <Card className="mb-6 p-6">
        <h3 className="font-bold text-surface-900 mb-4 text-base">Fine-Tune Styling</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-700">Custom Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.customColors?.accent || themeList.find(t => t.id === theme.themeId)?.colors.accent || '#5c7cfa'}
                onChange={(e) => setTheme({ ...theme, customColors: { ...theme.customColors, accent: e.target.value } })}
                className="w-10 h-10 rounded-xl border border-surface-200 cursor-pointer"
              />
              <Input
                value={theme.customColors?.accent || ''}
                onChange={(e) => setTheme({ ...theme, customColors: { ...theme.customColors, accent: e.target.value } })}
                placeholder="#5c7cfa"
              />
            </div>
          </div>
          <Select
            label="Animation Intensity"
            value={theme.customAnimationIntensity}
            onChange={(e) => setTheme({ ...theme, customAnimationIntensity: e.target.value as 'none' | 'low' | 'medium' | 'high' })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'low', label: 'Subtle' },
              { value: 'medium', label: 'Balanced (Recommended)' },
              { value: 'high', label: 'Dynamic 3D Effects' },
            ]}
          />
          <Input
            label="Corner Border Radius"
            placeholder="16px"
            value={theme.customRadius}
            onChange={(e) => setTheme({ ...theme, customRadius: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        {store && (
          <a href={`/s/${store.slug}`} target="_blank" rel="noreferrer">
            <Button variant="ghost" icon={<ExternalLink className="w-4 h-4" />}>View Live Store</Button>
          </a>
        )}
        <Button onClick={handleSave} loading={saving} icon={<Check className="w-4 h-4" />}>
          Save Theme Changes
        </Button>
      </div>
    </PageTransition>
  );
}
