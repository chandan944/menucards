// ─── Minimalist Claymorphic Landing Page (Light Theme) ──────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, staggerChild } from '@/storefront/animations';
import { Button } from '@/components/ui';
import { themeList } from '@/themes/themeRegistry';
import {
  QrCode, Palette, BarChart3, Smartphone, Sparkles, ArrowRight, Store, ShoppingBag,
  Zap, Star, Check, Phone, MessageCircle, ShieldCheck, MapPin, X, ExternalLink,
  Scissors, Shirt, Laptop, Coffee, Gem, Dumbbell, Wrench, Package, ArrowUpRight,
  Monitor, Tablet, Armchair, ChevronRight, Eye, CheckCircle2, TrendingUp, Layers,
  LayoutGrid, Award
} from 'lucide-react';
import { clsx } from 'clsx';

// Multi-business demo showcase items for the interactive phone mockup
const MULTI_BUSINESS_DEMOS = [
  {
    id: 'laptop_store',
    name: 'Laptop & Tech Studio',
    category: 'Laptops & Computers',
    badge: 'TECH STORE DEMO',
    themeId: 'laptop_store',
    icon: Laptop,
    heroImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '1', name: 'MacBook Pro 16" M3 Max', price: '₹2,39,900', origPrice: '₹2,49,900', rating: '5.0', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', badge: 'BESTSELLER' },
      { id: '2', name: 'ASUS ROG Zephyrus G16 OLED', price: '₹1,74,900', origPrice: '₹1,89,900', rating: '4.9', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80', badge: 'NEW' },
    ],
  },
  {
    id: 'mobile_store',
    name: 'Mobile & Gadgets Hub',
    category: 'Smartphones & Audio',
    badge: 'MOBILE SHOP DEMO',
    themeId: 'mobile_store',
    icon: Smartphone,
    heroImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '3', name: 'iPhone 15 Pro Max 256GB Titanium', price: '₹1,39,900', origPrice: '₹1,49,900', rating: '4.9', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', badge: 'HOT DEAL' },
      { id: '4', name: 'ANC Wireless Spatial Earbuds', price: '₹5,999', origPrice: '₹8,999', rating: '4.8', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', badge: 'TOP RATED' },
    ],
  },
  {
    id: 'furniture_store',
    name: 'Furniture & Living Studio',
    category: 'Home Decor & Furniture',
    badge: 'FURNITURE DEMO',
    themeId: 'furniture_store',
    icon: Armchair,
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '5', name: 'Nordic Velvet Ergonomic Armchair', price: '₹14,999', origPrice: '₹18,999', rating: '4.9', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', badge: 'EXCLUSIVE' },
      { id: '6', name: 'Solid Oak Minimalist Executive Desk', price: '₹21,999', origPrice: '₹24,999', rating: '4.9', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80', badge: 'HANDMADE' },
    ],
  },
  {
    id: 'boutique_store',
    name: 'Macha Artisan Boutique',
    category: 'Apparel & Fashion',
    badge: 'BOUTIQUE DEMO',
    themeId: 'macha_boba',
    icon: Shirt,
    heroImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '7', name: 'Artisan Oversized Denim Jacket', price: '₹2,499', origPrice: '₹3,999', rating: '4.9', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', badge: 'NEW COLLECTION' },
      { id: '8', name: 'Italian Leather Minimalist Tote', price: '₹4,499', origPrice: '₹5,499', rating: '4.8', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', badge: 'POPULAR' },
    ],
  },
  {
    id: 'salon_store',
    name: 'Pastry & Velvet Spa Studio',
    category: 'Salon & Beauty Services',
    badge: 'SALON DEMO',
    themeId: 'pastry_sweets',
    icon: Scissors,
    heroImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '9', name: 'Organic Hydrating Facial & Scalp Therapy', price: '₹1,499', origPrice: '₹1,999', rating: '5.0', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&auto=format&fit=crop&q=80', badge: 'BOOK NOW' },
      { id: '10', name: 'Botanical Hair Spa & Aromatherapy', price: '₹1,199', origPrice: '₹1,499', rating: '4.9', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80', badge: 'RELAXING' },
    ],
  },
  {
    id: 'cafe_store',
    name: 'Asian Poke & Matcha Bar',
    category: 'Cafes & Dining',
    badge: 'CAFE DEMO',
    themeId: 'asian_poke',
    icon: Coffee,
    heroImage: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop&q=80',
    products: [
      { id: '11', name: 'Ceremonial Grade Uji Matcha Latte', price: '₹299', origPrice: '₹349', rating: '4.9', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop&q=80', badge: 'FRESH BREW' },
      { id: '12', name: 'Fresh Salmon Poke & Grain Bowl', price: '₹449', origPrice: '₹499', rating: '4.9', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', badge: 'HEALTHY' },
    ],
  },
];

const SHOP_CATEGORIES = [
  { name: 'Laptop & Computer Stores', icon: Laptop, desc: 'MacBooks, Gaming PCs, Monitors, Accessories & Repairing', count: '100% Compatible' },
  { name: 'Mobile & Electronics Hubs', icon: Smartphone, desc: 'Smartphones, Audio Earbuds, Smartwatches & Screen Services', count: 'Instant Catalog' },
  { name: 'Furniture & Living Showrooms', icon: Armchair, desc: 'Sofas, Dining Tables, Ergonomic Office Desks & Lighting', count: 'High-Res Specs' },
  { name: 'Fashion & Boutiques', icon: Shirt, desc: 'Apparel, Shoes, Handbags, Jewelry & Seasonal Collections', count: 'Visual Galleries' },
  { name: 'Salons, Spas & Grooming', icon: Scissors, desc: 'Haircut Packages, Facials, Massages & Beauty Products', count: 'Direct Booking' },
  { name: 'Cafes, Dining & Bakeries', icon: Coffee, desc: 'Digital QR Table Menus, Specialty Coffee, Pastries & Ordering', count: 'Table QR Stand' },
  { name: 'Hardware & Repair Shops', icon: Wrench, desc: 'Tool Kits, Electrical Accessories, Plumbing & On-Site Repair', count: 'Service Listings' },
  { name: 'Supermarkets & Groceries', icon: Package, desc: 'Daily Essentials, Organic Produce, Snacks & Delivery', count: 'Fast Checkout' },
];

const CORE_FEATURES = [
  { icon: Palette, title: '18 Minimalist Clay Templates', desc: 'Pre-designed themes optimized specifically for tech stores, electronics, furniture, boutiques, cafes & salons.' },
  { icon: MessageCircle, title: '0% Commission Direct WhatsApp Orders', desc: 'Customers order directly through WhatsApp or phone call. You keep 100% of your earnings with no middleman cuts.' },
  { icon: QrCode, title: '3D Acrylic QR Stand Studio', desc: 'Generate high-res vector QR codes and 3D acrylic table stands ready for high-quality printing.' },
  { icon: ShieldCheck, title: 'Verified Customer Reviews', desc: 'OTP & Google sign-in verification stops spam reviews while showcasing authentic buyer feedback.' },
  { icon: BarChart3, title: 'Real-Time Scan & Click Analytics', desc: 'Track daily QR scans, unique storefront visits, top-viewed products, and direct contact conversions.' },
  { icon: Smartphone, title: 'Zero App Installation Required', desc: 'Instant Progressive Web App (PWA). Customers scan your QR code and browse your catalog in under 2 seconds.' },
];

export default function LandingPage() {
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewModalTheme, setPreviewModalTheme] = useState<typeof themeList[0] | null>(null);

  const activeDemo = MULTI_BUSINESS_DEMOS[activeDemoIndex];
  const ActiveIcon = activeDemo.icon;

  const filteredThemes = filterCategory === 'all'
    ? themeList
    : themeList.filter(t => {
        const cat = t.category?.toLowerCase() || '';
        const name = t.name.toLowerCase();
        const fc = filterCategory.toLowerCase();
        if (fc === 'tech') return cat.includes('tech') || name.includes('laptop') || name.includes('mobile');
        if (fc === 'home') return cat.includes('home') || name.includes('furniture');
        if (fc === 'fashion') return cat.includes('fashion') || name.includes('boba') || name.includes('pastry');
        if (fc === 'dining') return cat.includes('specialty') || cat.includes('modern') || name.includes('cafe') || name.includes('sushi') || name.includes('biryani');
        return cat.includes(fc) || name.includes(fc);
      });

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-800 font-sans selection:bg-slate-900 selection:text-white">

      {/* ─── Top Announcement Bar (Clay Light Minimalist) ────────────────────── */}
      <div className="bg-slate-900 text-slate-100 py-2.5 px-4 text-xs font-semibold text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Digital Storefronts & QR Menus for Laptop Stores, Mobiles, Furniture, Boutiques & Cafes • 0% Commission</span>
      </div>

      {/* ─── Claymorphic Light Navigation Header ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#f4f5f8]/85 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white border border-white/90 shadow-[4px_6px_16px_rgba(15,23,42,0.08),-4px_-4px_12px_rgba(255,255,255,0.9)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">StoreFront <span className="text-slate-500">QR</span></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">For All Shops & Showrooms</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#shops" className="hover:text-slate-900 transition-colors">Shop Demos</a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">18 Templates</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <Link to="/s/demo" target="_blank" className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-800 font-extrabold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              Live Demo Store <ArrowUpRight className="w-3.5 h-3.5 text-slate-700" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-700 font-bold hover:text-slate-900 hover:bg-slate-200/50">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-[0_6px_20px_rgba(15,23,42,0.15)] rounded-2xl border-0">
                Create Your Store
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section with Claymorphic 3D Card Backdrop ───────────────────── */}
      <section className="relative py-16 lg:py-24 px-6 overflow-hidden">
        {/* Soft Clay Ambient Accents */}
        <div className="absolute top-12 left-1/4 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Convincing Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <ScrollReveal variant="fadeUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 shadow-[4px_6px_14px_rgba(15,23,42,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] text-slate-800 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Laptop Stores • Mobile Shops • Furniture • Boutiques • Salons • Cafes</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] text-slate-900">
                Turn QR Scans Into <br />
                <span className="text-slate-600 underline decoration-slate-300 underline-offset-8">
                  Direct WhatsApp Orders
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Create a high-converting digital storefront, product catalog, and 3D acrylic QR stand for your business in 60 seconds. <strong className="text-slate-900 font-bold">Zero commission fees</strong> — orders arrive directly to your phone.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 font-black text-base px-8 py-4 rounded-2xl shadow-[0_12px_28px_rgba(15,23,42,0.18)] border-0" icon={<ArrowRight className="w-5 h-5 text-white" />}>
                    Create Free Storefront
                  </Button>
                </Link>
                <Link to="/s/demo" target="_blank">
                  <Button variant="ghost" size="lg" className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-100 rounded-2xl px-6 py-4 shadow-[4px_6px_16px_rgba(15,23,42,0.06),-4px_-4px_12px_rgba(255,255,255,0.9)] font-extrabold" icon={<ExternalLink className="w-4 h-4 text-slate-700" />}>
                    View Live Demo Store
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick Stats Banner */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div className="bg-white p-3.5 rounded-2xl border border-white/80 shadow-[6px_10px_20px_rgba(15,23,42,0.04),-6px_-6px_16px_rgba(255,255,255,0.9)]">
                  <p className="text-2xl font-black text-slate-900">0%</p>
                  <p className="text-[11px] text-slate-500 font-bold">Marketplace Commission</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-white/80 shadow-[6px_10px_20px_rgba(15,23,42,0.04),-6px_-6px_16px_rgba(255,255,255,0.9)]">
                  <p className="text-2xl font-black text-slate-900">18+</p>
                  <p className="text-[11px] text-slate-500 font-bold">Business Templates</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-white/80 shadow-[6px_10px_20px_rgba(15,23,42,0.04),-6px_-6px_16px_rgba(255,255,255,0.9)]">
                  <p className="text-2xl font-black text-slate-900">&lt; 2s</p>
                  <p className="text-[11px] text-slate-500 font-bold">QR Catalog Scan Speed</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Live Interactive 3D Phone Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <ScrollReveal variant="scale">
              <div className="relative w-full max-w-[360px] sm:max-w-[420px]">

                {/* Clay Phone Frame Container */}
                <div className="rounded-[44px] p-3.5 bg-white border border-slate-200/90 shadow-[16px_24px_48px_-8px_rgba(15,23,42,0.12),-12px_-12px_32px_rgba(255,255,255,0.95)] overflow-hidden">
                  
                  {/* Shop Demo Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-2 border-b border-slate-100 pt-1">
                    {MULTI_BUSINESS_DEMOS.map((demo, idx) => {
                      const TabIcon = demo.icon;
                      return (
                        <button
                          key={demo.id}
                          onClick={() => setActiveDemoIndex(idx)}
                          className={clsx(
                            'px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap border flex items-center gap-1.5',
                            activeDemoIndex === idx
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          )}
                        >
                          <TabIcon className="w-3.5 h-3.5" />
                          <span>{demo.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Phone Screen Mockup */}
                  <div className="rounded-[32px] overflow-hidden bg-slate-50 border border-slate-200/60 text-left transition-all duration-300 min-h-[520px] flex flex-col justify-between">
                    
                    {/* Header Banner */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img src={activeDemo.heroImage} alt="" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white font-black text-[10px] border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                        <ActiveIcon className="w-3 h-3 text-amber-400" />
                        <span>{activeDemo.badge}</span>
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">{activeDemo.category}</p>
                        <h3 className="text-lg font-black leading-tight">{activeDemo.name}</h3>
                      </div>
                    </div>

                    {/* Product Items List inside Phone */}
                    <div className="p-3.5 space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Catalog Products</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">● 100% In Stock</span>
                      </div>

                      {activeDemo.products.map(p => (
                        <div key={p.id} className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-[4px_6px_12px_rgba(15,23,42,0.03)] flex items-center gap-3">
                          <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 inline-block mb-0.5">{p.badge}</span>
                            <p className="text-xs font-extrabold text-slate-900 truncate leading-snug">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-slate-900">{p.price}</span>
                              <span className="text-[10px] text-slate-400 line-through font-semibold">{p.origPrice}</span>
                              <span className="text-[10px] font-extrabold text-amber-500 ml-auto flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {p.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Mock Direct Order Action Button inside Phone */}
                      <div className="pt-2">
                        <Link to={`/s/demo?theme=${activeDemo.themeId}`} target="_blank" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all">
                          <MessageCircle className="w-4 h-4" />
                          Order via WhatsApp (0% Fee)
                        </Link>
                      </div>
                    </div>

                    {/* Store Contact Footer inside Phone */}
                    <div className="p-3 bg-white border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> Tech Plaza, Main Rd</span>
                      <span className="text-slate-900 font-extrabold">Instant Scan PWA</span>
                    </div>

                  </div>
                </div>

                {/* Clay Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-3xl border border-white/80 shadow-[10px_16px_32px_rgba(15,23,42,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)] hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Direct WhatsApp Checkout</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Zero Commission Fees</p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ─── Business Types Section ("Built For Every Shop & Store") ───────────── */}
      <section id="shops" className="py-20 px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          
          <ScrollReveal variant="fadeUp">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
                Universal Business Support
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Designed For Every Store & Showroom
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-medium">
                Not just for food — StoreFront QR powers laptop stores, mobile shops, furniture boutiques, salons, gyms, hardware & retail centers.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid of 8 Shop Types */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHOP_CATEGORIES.map((shop, i) => {
              const Icon = shop.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerChild}
                  className="bg-[#f4f5f8] p-6 rounded-3xl border border-white/80 shadow-[8px_12px_24px_-4px_rgba(15,23,42,0.05),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[12px_18px_32px_-4px_rgba(15,23,42,0.08),-8px_-8px_20px_rgba(255,255,255,0.95)] transition-all text-left flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">{shop.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{shop.desc}</p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-extrabold text-slate-700">
                    <span>{shop.count}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </StaggerContainer>

        </div>
      </section>

      {/* ─── 18 Theme Templates Gallery Section ──────────────────────────────── */}
      <section id="templates" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12 text-center">

          <ScrollReveal variant="fadeUp">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                18 Handcrafted Templates
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Pick A Theme Built For Your Niche
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-medium">
                Switch themes instantly with 1-click. Fully customizable colors, typography, card shapes & hero image layouts.
              </p>
            </div>
          </ScrollReveal>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All Templates (18)', icon: LayoutGrid },
              { id: 'tech', label: 'Laptops & Tech', icon: Laptop },
              { id: 'home', label: 'Furniture & Home', icon: Armchair },
              { id: 'fashion', label: 'Boutiques & Fashion', icon: Shirt },
              { id: 'specialty', label: 'Salons & Spas', icon: Scissors },
              { id: 'dining', label: 'Cafes & Dining', icon: Coffee },
            ].map(cat => {
              const FilterIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={clsx(
                    'px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border whitespace-nowrap flex items-center gap-1.5',
                    filterCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  <FilterIcon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Templates Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filteredThemes.map(t => (
              <motion.div
                key={t.id}
                variants={staggerChild}
                className="bg-white rounded-3xl p-4 border border-white/90 shadow-[10px_16px_30px_-6px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[14px_22px_36px_-6px_rgba(15,23,42,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Thumbnail */}
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <img src={t.preview || t.heroImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/20">
                      {t.badgeText || t.category}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-black leading-tight">{t.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2">{t.description}</p>

                  {/* Color Swatch Preview */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Palette:</span>
                    <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.primary }} />
                    <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.accent }} />
                    <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: t.colors.background }} />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link to={`/s/demo?theme=${t.id}`} target="_blank" className="flex-1">
                    <Button size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800 font-extrabold rounded-xl text-xs py-2.5 shadow-sm border-0" icon={<ExternalLink className="w-3.5 h-3.5 text-white" />}>
                      Try Live Demo
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewModalTheme(t)}
                    className="bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs px-3 font-bold"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* ─── Core Features Section ───────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
              Built For Conversion
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Everything Your Business Needs To Win
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Eliminate third-party order commissions and give your local customers an ultra-fast digital store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-[#f4f5f8] p-6 rounded-3xl border border-white/80 shadow-[8px_12px_24px_-4px_rgba(15,23,42,0.05),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                    <Icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── How It Works Step-by-Step ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16 text-center">

          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Launch Your Storefront In 60 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="bg-white p-8 rounded-3xl border border-white/90 shadow-[10px_16px_30px_-6px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4">
              <span className="text-4xl font-black text-slate-900">01</span>
              <h3 className="text-xl font-black text-slate-900">Add Your Products & Services</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Add laptops, mobile accessories, sofas, apparel or salon packages with prices, images, ratings & discount tags.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-white/90 shadow-[10px_16px_30px_-6px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4">
              <span className="text-4xl font-black text-slate-900">02</span>
              <h3 className="text-xl font-black text-slate-900">Generate 3D Acrylic QR Stand</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Download your custom QR code and acrylic table stand graphics ready for high-quality counter printing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-white/90 shadow-[10px_16px_30px_-6px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-4">
              <span className="text-4xl font-black text-slate-900">03</span>
              <h3 className="text-xl font-black text-slate-900">Receive Direct WhatsApp Orders</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Customers scan, select products, and send order details straight to your WhatsApp. 100% earnings kept!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── Final CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-[40px] p-10 sm:p-16 text-center space-y-8 shadow-[0_25px_60px_rgba(15,23,42,0.25)] relative overflow-hidden">
          <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready To Upgrade Your Business Storefront?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Join thousands of laptop shops, electronics hubs, furniture showrooms & boutiques growing their direct sales with StoreFront QR.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link to="/register">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 font-black text-base px-8 py-4 rounded-2xl border-0 shadow-lg" icon={<ArrowRight className="w-5 h-5 text-slate-950" />}>
                Create Your Free Store Now
              </Button>
            </Link>
            <Link to="/s/demo" target="_blank">
              <Button variant="ghost" size="lg" className="border border-slate-700 text-slate-200 hover:bg-slate-800 rounded-2xl px-6 py-4 font-bold" icon={<ExternalLink className="w-4 h-4 text-slate-300" />}>
                Explore Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Minimalist Footer ───────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-slate-200/80 bg-white text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-900" />
            <span className="font-extrabold text-slate-900">StoreFront QR</span>
            <span>© 2026 StoreFront Studios. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/s/demo" className="hover:text-slate-900 transition-colors">Demo Store</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-slate-900 transition-colors">Register</Link>
          </div>
        </div>
      </footer>

      {/* ─── Theme Preview Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewModalTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
            onClick={() => setPreviewModalTheme(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative border border-slate-200"
            >
              <button
                onClick={() => setPreviewModalTheme(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {previewModalTheme.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900">{previewModalTheme.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{previewModalTheme.description}</p>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                <img src={previewModalTheme.preview || previewModalTheme.heroImage} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Font:</span>
                  <span className="text-xs font-black text-slate-900">{previewModalTheme.typography.headingFont}</span>
                </div>
                <Link to={`/s/demo?theme=${previewModalTheme.id}`} target="_blank">
                  <Button size="sm" className="bg-slate-900 text-white font-black rounded-xl px-6" icon={<ExternalLink className="w-4 h-4" />}>
                    Launch Full Demo Store
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
