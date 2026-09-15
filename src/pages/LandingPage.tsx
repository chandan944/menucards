// ─── Minimalist Claymorphic Landing Page (Monochrome Black & White) ──────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, staggerChild } from '@/storefront/animations';
import { Button } from '@/components/ui';
import { themeList } from '@/themes/themeRegistry';
import {
  QrCode, Palette, BarChart3, Smartphone, Sparkles, ArrowRight, Store, ShoppingBag,
  Zap, Star, Check, Phone, MessageCircle, ShieldCheck, MapPin, X, ExternalLink,
  Scissors, Shirt, Laptop, Coffee, Gem, Dumbbell, Wrench, Package, ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';

// Demo sample items representing ALL shop types (Retail, Salon, Electronics, Cafe, Jewelry, Gym)
const MULTI_SHOP_ITEMS = [
  { id: '1', shopType: 'Retail Boutique', name: 'Artisan Minimalist Denim Jacket', price: '₹2,499', salePrice: '₹1,999', rating: '4.9', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', badge: 'NEW COLLECTION' },
  { id: '2', shopType: 'Salon & Spa', name: 'Organic Hydrating Facial Treatment', price: '₹1,499', salePrice: '₹1,199', rating: '4.9', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&auto=format&fit=crop&q=80', badge: 'MOST POPULAR' },
  { id: '3', shopType: 'Electronics & Mobiles', name: 'ANC Wireless Noise-Canceling Earbuds', price: '₹4,999', salePrice: '₹3,999', rating: '4.8', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', badge: 'TOP RATED' },
  { id: '4', shopType: 'Cafe & Bakery', name: 'Ceremonial Japanese Matcha Latte', price: '₹249', salePrice: '₹199', rating: '4.9', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop&q=80', badge: 'BESTSELLER' },
];

const SHOP_CATEGORIES = [
  { name: 'Retail & Boutiques', icon: Shirt, count: 'Fashion, Shoes, Apparel' },
  { name: 'Salons & Spas', icon: Scissors, count: 'Hair Cut, Spa, Grooming' },
  { name: 'Electronics & Mobiles', icon: Laptop, count: 'Phones, Gadgets, Repair' },
  { name: 'Cafes & Restaurants', icon: Coffee, count: 'Coffee, Dining, Bakery' },
  { name: 'Jewelry & Watches', icon: Gem, count: 'Gold, Diamonds, Watches' },
  { name: 'Gyms & Fitness', icon: Dumbbell, count: 'Memberships, Training' },
  { name: 'Services & Hardware', icon: Wrench, count: 'Repairs, Tools, Services' },
  { name: 'General Supermarket', icon: Package, count: 'Groceries, Daily Needs' },
];

const CORE_FEATURES = [
  { icon: Palette, title: '15 Minimalist Clay Templates', desc: 'Crafted for every business type — clothing boutiques, salons, cafes, electronics, and local service shops.' },
  { icon: MessageCircle, title: '0% Commission Direct Orders', desc: 'Customers order directly via WhatsApp or phone call. Keep 100% of your revenue without marketplace cuts.' },
  { icon: QrCode, title: 'Custom 3D QR & Stand Studio', desc: 'Design high-resolution QR codes and 3D acrylic table stands ready for instant high-quality printing.' },
  { icon: ShieldCheck, title: 'Verified Customer Reviews', desc: 'Sign-in verification prevents fake review spam while displaying verified buyer badges on your storefront.' },
  { icon: BarChart3, title: 'Real-Time Scan Analytics', desc: 'Monitor daily QR scans, profile visits, customer interactions, and top-clicked catalog products.' },
  { icon: Smartphone, title: 'No App Installation Required', desc: 'Instant Progressive Web App (PWA) loading. Customers scan your QR code and browse your catalog in under 3 seconds.' },
];

export default function LandingPage() {
  const [activeDemoShopId, setActiveDemoShopId] = useState('macha_boba');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewModalTheme, setPreviewModalTheme] = useState<typeof themeList[0] | null>(null);
  const [selectedDemoItem, setSelectedDemoItem] = useState<typeof MULTI_SHOP_ITEMS[0] | null>(null);

  const activeTheme = themeList.find(t => t.id === activeDemoShopId) || themeList[0];

  const filteredThemes = filterCategory === 'all'
    ? themeList
    : themeList.filter(t => t.category?.toLowerCase().includes(filterCategory.toLowerCase()) || t.name.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">

      {/* ─── Top Announcement Bar (Minimalist Monochrome) ────────────────────── */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 py-2 px-4 text-xs font-medium text-center tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Digital Storefronts & QR Menus for All Shop Types • 15 Templates Included • 0% Commission</span>
      </div>

      {/* ─── Claymorphic Navigation Header ───────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/90 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">StoreFront <span className="text-zinc-400">QR</span></span>
              <span className="text-[10px] text-zinc-400 font-medium">Digital Storefronts for All Shops</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300">
            <a href="#shops" className="hover:text-white transition-colors">Shop Types</a>
            <a href="#templates" className="hover:text-white transition-colors">15 Templates</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <Link to="/s/demo" className="hover:text-white transition-colors flex items-center gap-1 text-zinc-400">
              Live Demo Store <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800/50">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-white text-zinc-950 font-bold hover:bg-zinc-200 shadow-[0_4px_14px_rgba(255,255,255,0.15)] border-0">
                Create Your Store
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section with Claymorphic Backdrop & B&W Phone Mockup ───────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Clay Backdrop Gradient Accents */}
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Convincing Copy & Shop CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <ScrollReveal variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/70 text-zinc-300 text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                For Boutiques, Salons, Electronics, Cafes, Retail & Services
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] text-white">
                Turn QR Scans Into <br />
                <span className="text-zinc-400 underline decoration-zinc-700 underline-offset-8">
                  Instant Direct Orders
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Build a sleek digital storefront, catalog, and 3D QR table stand for your business in under 60 seconds. Zero marketplace commissions — direct customer orders straight to WhatsApp or Call.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_10px_25px_rgba(255,255,255,0.15)] border-0" icon={<ArrowRight className="w-5 h-5 text-zinc-950" />}>
                    Start Free Storefront
                  </Button>
                </Link>
                <Link to="/s/demo" target="_blank">
                  <Button variant="ghost" size="lg" className="border border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-2xl px-6 py-4" icon={<ExternalLink className="w-4 h-4 text-zinc-400" />}>
                    View Live Store Demo
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Shop Types Pills */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="pt-6 border-t border-zinc-800/80">
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-3">Designed for all businesses:</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-300">
                  {['🛍️ Clothing Boutiques', '💇 Salons & Spas', '📱 Electronics', '☕ Cafes & Dining', '💎 Jewelry Stores', '🏋️ Gyms', '🛠️ Repair Services'].map((shop, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {shop}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Live B&W Clay Phone Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <ScrollReveal variant="scale">
              <div className="relative w-full max-w-[360px] sm:max-w-[400px]">

                {/* Clay Phone Frame */}
                <div className="rounded-[42px] p-3 bg-zinc-900 border-2 border-zinc-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
                  
                  {/* Shop Type Switcher Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-2 border-b border-zinc-800 pt-1">
                    {themeList.slice(0, 5).map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveDemoShopId(t.id)}
                        className={clsx(
                          'px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap border',
                          activeDemoShopId === t.id
                            ? 'bg-white text-zinc-950 border-white shadow-md'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        )}
                      >
                        {t.name.split('&')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Phone Screen Mockup */}
                  <div
                    className="rounded-[30px] overflow-hidden min-h-[540px] flex flex-col justify-between text-left transition-all duration-300"
                    style={{ backgroundColor: activeTheme.colors.background, color: activeTheme.colors.text }}
                  >
                    {/* Header Image & Logo */}
                    <div className="relative h-40 overflow-hidden bg-zinc-950">
                      <img src={activeTheme.heroImage} alt="" className="w-full h-full object-cover opacity-85" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 text-white font-bold text-[9px] border border-white/20">
                        {activeTheme.badgeText}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-md flex-shrink-0">
                          <img src={activeTheme.heroImage} alt="" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> OPEN NOW
                          </span>
                          <h4 className="text-sm font-black text-white leading-tight truncate" style={{ fontFamily: activeTheme.typography.headingFont }}>
                            {activeTheme.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Item List */}
                    <div className="p-3 grid grid-cols-2 gap-2 flex-1 overflow-hidden">
                      {MULTI_SHOP_ITEMS.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedDemoItem(item)}
                          className="rounded-2xl overflow-hidden border p-2 flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: activeTheme.colors.surface, borderColor: activeTheme.colors.border }}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden mb-1.5 relative bg-zinc-100">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-zinc-950 text-white font-bold text-[8px]">
                              {item.badge}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold opacity-60 uppercase block truncate">{item.shopType}</span>
                            <p className="text-[10px] font-bold truncate leading-tight" style={{ fontFamily: activeTheme.typography.headingFont }}>{item.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] font-black" style={{ color: activeTheme.colors.accent }}>{item.salePrice}</span>
                              <span className="text-[9px] line-through opacity-50">{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mockup Footer */}
                    <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: activeTheme.colors.border }}>
                      <span className="text-[9px] font-semibold opacity-70">Direct Shop Ordering</span>
                      <button className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white shadow flex items-center gap-1" style={{ backgroundColor: activeTheme.colors.accent }}>
                        <MessageCircle className="w-3 h-3 fill-white" /> Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Shop Categories Grid (For All Business Types) ──────────────────── */}
      <section id="shops" className="py-20 px-6 bg-zinc-950 border-t border-zinc-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Multi-Industry Platform</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Built for Every Shop & Store Type
              </h2>
              <p className="text-zinc-400 text-sm">
                Whether you sell clothes, provide salon services, repair gadgets, or run a cafe — StoreFront QR has you covered.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SHOP_CATEGORIES.map((cat, idx) => (
              <motion.div key={idx} variants={staggerChild}>
                <div className="p-5 rounded-3xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 transition-all text-left group">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{cat.name}</h3>
                  <p className="text-[11px] text-zinc-400">{cat.count}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 15 Curated Design Templates Showcase ───────────────────────────── */}
      <section id="templates" className="py-24 px-6 bg-[#09090b] border-t border-zinc-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">15 Design Templates</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                15 Curated Storefront Styles
              </h2>
              <p className="text-zinc-400 text-sm">
                Click any template card below to inspect its typography, color palettes, and responsive storefront layout.
              </p>
            </div>
          </ScrollReveal>

          {/* Category Filter Pills */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
            {[
              { id: 'all', label: 'All 15 Templates' },
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
                  'px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border',
                  filterCategory === cat.id
                    ? 'bg-white text-zinc-950 border-white shadow-md scale-105'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 15 Templates Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredThemes.map((t) => (
              <motion.div key={t.id} variants={staggerChild}>
                <div
                  onClick={() => setPreviewModalTheme(t)}
                  className="group relative rounded-3xl border border-zinc-800 bg-zinc-900/80 hover:border-zinc-500 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
                >
                  <div className="relative h-32 overflow-hidden bg-zinc-950">
                    <img src={t.heroImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-white uppercase border border-white/20">
                      {t.category || 'Store'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-white" style={{ fontFamily: t.typography.headingFont }}>{t.name}</h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">{t.description}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[t.colors.primary, t.colors.accent, t.colors.background].map((c, i) => (
                          <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Core Platform Features ──────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/80 relative">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Capabilities</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                Everything You Need to Run Your Digital Shop
              </h2>
              <p className="text-zinc-400 text-sm">
                Built for maximum conversion, zero platform fees, and effortless catalog updates.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_FEATURES.map((f) => (
              <motion.div key={f.title} variants={staggerChild}>
                <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-600 transition-all h-full group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 3-Step Setup Process ───────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-[#09090b] border-t border-zinc-800/80 relative">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">3 Steps</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                How StoreFront Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick Your Template', desc: 'Select from 15 minimalist design themes tailored for your shop type.', icon: Palette },
              { step: '02', title: 'Add Catalog & Prices', desc: 'Upload item photos, set prices, variants, add-ons, and phone/WhatsApp number.', icon: ShoppingBag },
              { step: '03', title: 'Print QR Stand & Sell', desc: 'Download your high-resolution QR code and 3D acrylic table stand to start taking direct orders.', icon: QrCode },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.15}>
                <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-center relative group hover:border-zinc-600 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white text-zinc-950 flex items-center justify-center mx-auto mb-4 font-black shadow-lg">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block mb-1">STEP {s.step}</span>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
        <ScrollReveal>
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Launch Your Digital Storefront?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join clothing boutiques, salons, electronics stores, cafes & local shops going digital today.
            </p>
            <div className="pt-4 flex items-center justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_10px_25px_rgba(255,255,255,0.15)] border-0" icon={<ArrowRight className="w-5 h-5 text-zinc-950" />}>
                  Create Your Storefront Free
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-zinc-800 bg-[#09090b] text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-zinc-950 font-black">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-sm">StoreFront QR</span>
          </div>
          <p>© {new Date().getFullYear()} StoreFront QR. Digital Storefronts & QR Menus for All Shop Types.</p>
        </div>
      </footer>

      {/* ─── Template Preview Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {previewModalTheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setPreviewModalTheme(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 text-left"
            >
              <button onClick={() => setPreviewModalTheme(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-44 rounded-2xl overflow-hidden bg-zinc-950">
                <img src={previewModalTheme.heroImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white font-bold text-xs border border-white/20">
                  {previewModalTheme.badgeText}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Font: {previewModalTheme.typography.headingFont}
                </span>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: previewModalTheme.typography.headingFont }}>
                  {previewModalTheme.name}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{previewModalTheme.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-1.5">
                  {[previewModalTheme.colors.primary, previewModalTheme.colors.accent, previewModalTheme.colors.background].map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border border-white/40 shadow" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <Link to="/register">
                  <Button size="sm" className="bg-white text-zinc-950 font-bold hover:bg-zinc-200">
                    Use This Template
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Demo Item Quick Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDemoItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedDemoItem(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 text-left"
            >
              <button onClick={() => setSelectedDemoItem(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-950">
                <img src={selectedDemoItem.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  ⭐ {selectedDemoItem.rating} • {selectedDemoItem.shopType}
                </span>
                <h3 className="text-base font-black text-white">{selectedDemoItem.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-black text-white">{selectedDemoItem.salePrice}</span>
                  <span className="text-xs line-through text-zinc-500">{selectedDemoItem.price}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <Link to="/register">
                  <Button size="sm" className="w-full bg-white text-zinc-950 font-bold hover:bg-zinc-200" icon={<MessageCircle className="w-4 h-4 text-zinc-950" />}>
                    Accept Direct Orders For Your Shop
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
