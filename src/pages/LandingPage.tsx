// ─── Landing Page ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, staggerChild, Floating } from '@/storefront/animations';
import { Button } from '@/components/ui';
import { themeList } from '@/themes/themeRegistry';
import {
  QrCode, Palette, BarChart3, Smartphone, Sparkles, ArrowRight, Store, ShoppingBag,
  Zap, Star, Check, Layout, Tag, Phone, MessageCircle, CheckCircle2,
  MapPin, Flame, Eye, X, ExternalLink, ShieldCheck, Type, ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';

// Demo sample products for live template preview on the landing page
const DEMO_ITEMS = [
  { id: '1', name: 'Ceremonial Matcha Boba Latte', category: 'Drinks', price: '₹249', salePrice: '₹199', rating: '4.9', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop&q=80', badge: 'BESTSELLER' },
  { id: '2', name: 'Belgian Truffle Lava Cake', category: 'Pastry', price: '₹299', salePrice: '₹249', rating: '4.9', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', badge: 'FRESH' },
  { id: '3', name: 'Signature Wild Salmon Poke Bowl', category: 'Bowls', price: '₹349', salePrice: '₹299', rating: '4.8', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', badge: 'HEALTHY' },
  { id: '4', name: 'Hyderabadi Mutton Dum Biryani', category: 'Mains', price: '₹410', salePrice: '₹360', rating: '4.9', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', badge: 'SPECIAL' },
];

const FEATURES = [
  { icon: Palette, title: '15 Curated Niche Templates', desc: 'From Boba Cafes & Bakeries to Biryani Houses & Bistros — tailored layouts with custom Google Fonts.' },
  { icon: MessageCircle, title: '0% Commission Direct Orders', desc: 'Receive instant orders directly on WhatsApp or phone call without paying third-party marketplace fees.' },
  { icon: QrCode, title: '3D QR & Table Card Studio', desc: 'Generate customized QR codes and 3D acrylic table stands ready for instant high-res printing.' },
  { icon: ShieldCheck, title: 'Verified Customer Reviews', desc: 'Customer sign-in enforcement prevents fake review spam while displaying verified buyer badges.' },
  { icon: BarChart3, title: 'Real-Time Scan Analytics', desc: 'Track QR scan rates, customer engagement, active visitors, and top trending menu items.' },
  { icon: Smartphone, title: 'Zero App Download Needed', desc: 'PWA-optimized instant mobile web interface. Customers scan QR codes and order in under 5 seconds.' },
];

export default function LandingPage() {
  const [activeThemeId, setActiveThemeId] = useState('macha_boba');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewModalTheme, setPreviewModalTheme] = useState<typeof themeList[0] | null>(null);
  const [selectedDemoItem, setSelectedDemoItem] = useState<typeof DEMO_ITEMS[0] | null>(null);

  const activeTheme = themeList.find(t => t.id === activeThemeId) || themeList[0];

  const filteredThemes = filterCategory === 'all'
    ? themeList
    : themeList.filter(t => t.category?.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans">

      {/* ─── Top Announcement Bar ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white py-2 px-4 text-xs font-bold text-center tracking-wider uppercase shadow-md flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Create Your Digital Storefront & QR Menu in 60 Seconds • 15 Templates Included</span>
      </div>

      {/* ─── Glassmorphic Navigation Bar ────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">StoreFront <span className="text-amber-400">QR</span></span>
              <span className="text-[10px] text-slate-400 font-medium">Digital Menus & Storefronts</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#templates" className="hover:text-amber-400 transition-colors">15 Templates</a>
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <Link to="/s/demo" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              Live Demo Store <ArrowUpRight className="w-3 h-3 text-amber-400" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black shadow-lg border-0" icon={<Sparkles className="w-3.5 h-3.5 fill-slate-950" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section with Live Interactive Storefront Mockup ───────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-16 px-6 overflow-hidden">
        {/* Glowing Background Mesh Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Convincing Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <ScrollReveal variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                No App Download • 0% Marketplace Commission
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Turn QR Scans Into <br />
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
                  Instant Direct Orders
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Create modern digital storefronts, QR menus, and 3D acrylic table stands in under 60 seconds. Choose from 15 curated design templates for Boba, Pastries, Biryani, Poke, Bistro & more.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-2xl border-0" icon={<ArrowRight className="w-5 h-5" />}>
                    Create Your Store Free
                  </Button>
                </Link>
                <Link to="/s/demo" target="_blank">
                  <Button variant="secondary" size="lg" className="border border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-4" icon={<ExternalLink className="w-4 h-4 text-amber-400" />}>
                    View Live Store Demo
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick Metrics */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">15+</div>
                  <div className="text-xs text-slate-400 font-medium">Design Templates</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400">0%</div>
                  <div className="text-xs text-slate-400 font-medium">Order Commission</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt;60s</div>
                  <div className="text-xs text-slate-400 font-medium">Instant Setup</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Live Interactive Storefront Phone Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <ScrollReveal variant="scale">
              <div className="relative w-full max-w-[360px] sm:max-w-[400px]">

                {/* Floating 3D Stickers */}
                <Floating delay={0} className="absolute -top-6 -left-6 z-30">
                  <div className="px-3.5 py-2 rounded-2xl bg-amber-500/90 text-slate-950 text-xs font-black shadow-2xl backdrop-blur-md flex items-center gap-1.5 border border-amber-300">
                    <Star className="w-4 h-4 fill-slate-950" /> 4.9 Rating System
                  </div>
                </Floating>

                <Floating delay={1.5} className="absolute -bottom-6 -right-6 z-30">
                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/90 text-slate-950 text-xs font-black shadow-2xl backdrop-blur-md flex items-center gap-1.5 border border-emerald-300">
                    <MessageCircle className="w-4 h-4 fill-slate-950" /> 0% Fee Direct Orders
                  </div>
                </Floating>

                {/* Template Switcher Bar above Phone */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-hide mb-3 justify-center">
                  {themeList.slice(0, 5).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveThemeId(t.id)}
                      className={clsx(
                        'px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap border',
                        activeThemeId === t.id
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                          : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/30'
                      )}
                    >
                      {t.name.split('&')[0]}
                    </button>
                  ))}
                </div>

                {/* Phone Frame Container */}
                <div className="rounded-[40px] p-3 bg-slate-900 border-4 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div
                    className="rounded-[32px] overflow-hidden min-h-[560px] flex flex-col justify-between text-left transition-all duration-500"
                    style={{ backgroundColor: activeTheme.colors.background, color: activeTheme.colors.text }}
                  >
                    {/* Mockup Header Hero Banner */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img src={activeTheme.heroImage} alt="" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase border border-white/20">
                        {activeTheme.badgeText}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white p-0.5 shadow-lg overflow-hidden flex-shrink-0">
                          <img src={activeTheme.heroImage} alt="" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> OPEN NOW
                          </span>
                          <h4 className="text-base font-black text-white leading-tight truncate" style={{ fontFamily: activeTheme.typography.headingFont }}>
                            {activeTheme.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Category Pills */}
                    <div className="px-3 py-2 border-b flex gap-1.5 overflow-x-auto scrollbar-hide" style={{ borderColor: activeTheme.colors.border }}>
                      {['✨ All Items', '☕ Special Drinks', '🍰 Bakery', '🥗 Super Bowls'].map((cat, idx) => (
                        <span
                          key={idx}
                          className={clsx('px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap', idx === 0 ? 'text-white' : 'opacity-70')}
                          style={{ backgroundColor: idx === 0 ? activeTheme.colors.accent : activeTheme.colors.surface }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Mockup Products Grid */}
                    <div className="p-3 grid grid-cols-2 gap-2 flex-1 overflow-hidden">
                      {DEMO_ITEMS.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedDemoItem(item)}
                          className="rounded-2xl overflow-hidden border p-2 flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: activeTheme.colors.surface, borderColor: activeTheme.colors.border }}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[8px]">
                              {item.badge}
                            </span>
                          </div>
                          <div>
                            <p className="text-[11px] font-extrabold truncate" style={{ fontFamily: activeTheme.typography.headingFont }}>{item.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-black" style={{ color: activeTheme.colors.accent }}>{item.salePrice}</span>
                              <span className="text-[9px] line-through opacity-60">{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mockup Action Footer */}
                    <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: activeTheme.colors.border }}>
                      <span className="text-[10px] font-bold opacity-75">📞 Direct Order Ready</span>
                      <button className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-md flex items-center gap-1" style={{ backgroundColor: activeTheme.colors.accent }}>
                        <MessageCircle className="w-3.5 h-3.5 fill-white" /> Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── 15 Curated Design Templates Showcase ───────────────────────────── */}
      <section id="templates" className="py-24 px-6 bg-slate-900 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Palette className="w-3.5 h-3.5" /> 15 Niche Design Templates
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Tailored for Every Business Type
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Click any template to preview its typography, color palettes, hero layout, and custom sticker badges.
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
                  'px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap',
                  filterCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                  className="group relative rounded-3xl border border-white/10 overflow-hidden bg-slate-950 hover:border-amber-400/50 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                >
                  <div className="relative h-36 overflow-hidden bg-slate-900">
                    <img src={t.heroImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase border border-white/20">
                      {t.category || 'Store'}
                    </span>

                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[9px] font-medium text-white flex items-center gap-1 border border-white/30">
                      <Type className="w-3 h-3" /> {t.typography.headingFont}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white" style={{ fontFamily: t.typography.headingFont }}>{t.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{t.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[t.colors.primary, t.colors.accent, t.colors.background].map((c, i) => (
                          <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
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

      {/* ─── Key Features Section ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-slate-950 relative border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Everything You Need to Go Digital
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Built for maximum customer conversion, zero platform fees, and effortless menu management.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={staggerChild}>
                <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-400/40 transition-all duration-300 h-full group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── How It Works (3 Steps) ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" /> 3-Step Instant Setup
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                How StoreFront QR Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick Your Template', desc: 'Select from 15 curated design themes for Boba, Sweets, Biryani, Poke, or Bistro.', icon: Palette },
              { step: '02', title: 'Add Menu Items', desc: 'Upload high-res photos, set prices, add variants, add-ons, and special offer discounts.', icon: ShoppingBag },
              { step: '03', title: 'Print QR Stand & Sell', desc: 'Download your high-res QR code and 3D table cards to take direct WhatsApp & phone orders.', icon: QrCode },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.15}>
                <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 text-center relative overflow-hidden group hover:border-amber-400/50 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 flex items-center justify-center mx-auto mb-4 font-black shadow-lg">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">STEP {s.step}</span>
                  <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 opacity-20 blur-3xl pointer-events-none" />
        
        <ScrollReveal>
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Launch Your Digital Storefront?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join hundreds of restaurants, boba cafes, bakeries & stores transforming QR scans into direct orders today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-2xl border-0" icon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free Now
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-white/10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-sm">StoreFront QR</span>
          </div>
          <p>© {new Date().getFullYear()} StoreFront QR. Modern Digital Storefronts & QR Menus.</p>
        </div>
      </footer>

      {/* ─── Template Preview Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {previewModalTheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPreviewModalTheme(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 text-left"
            >
              <button onClick={() => setPreviewModalTheme(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950">
                <img src={previewModalTheme.heroImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white font-bold text-xs border border-white/20">
                  {previewModalTheme.badgeText}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Font: {previewModalTheme.typography.headingFont}
                </span>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: previewModalTheme.typography.headingFont }}>
                  {previewModalTheme.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{previewModalTheme.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  {[previewModalTheme.colors.primary, previewModalTheme.colors.accent, previewModalTheme.colors.background].map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border border-white/40 shadow" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <Link to="/register">
                  <Button size="sm" className="bg-amber-400 text-slate-950 font-extrabold hover:bg-amber-300">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedDemoItem(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 text-left"
            >
              <button onClick={() => setSelectedDemoItem(null)} className="absolute top-3 right-3 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950">
                <img src={selectedDemoItem.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  ⭐ {selectedDemoItem.rating} Rating • {selectedDemoItem.category}
                </span>
                <h3 className="text-lg font-black text-white">{selectedDemoItem.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-black text-amber-400">{selectedDemoItem.salePrice}</span>
                  <span className="text-xs line-through text-slate-500">{selectedDemoItem.price}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link to="/register">
                  <Button size="sm" className="w-full bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400" icon={<MessageCircle className="w-4 h-4 fill-slate-950" />}>
                    Start Accepting WhatsApp Orders
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
