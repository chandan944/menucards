// ─── Landing Page ───────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ScrollReveal, StaggerContainer, staggerChild, Floating, ParallaxLayer } from '@/storefront/animations';
import { Button } from '@/components/ui';
import {
  QrCode, Palette, BarChart3, Smartphone, Sparkles, ArrowRight, Store, ShoppingBag,
  Globe, Zap, Star, Check, ChevronRight, Layout, Image, Tag,
} from 'lucide-react';

const FEATURES = [
  { icon: Store, title: 'Digital Storefront', desc: 'Beautiful, theme-driven storefronts for any business type' },
  { icon: QrCode, title: 'Custom QR Codes', desc: 'Fully branded QR codes with logo, colors, and frames' },
  { icon: Palette, title: '10+ Premium Themes', desc: 'From Minimal to Luxury — pick your style' },
  { icon: ShoppingBag, title: 'Product Catalog', desc: 'Variants, add-ons, badges, images, and pricing' },
  { icon: Tag, title: 'Offers & Deals', desc: 'Percentage, flat, BOGO discounts with scheduling' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track views, scans, clicks, and popular products' },
  { icon: Smartphone, title: 'Mobile-First', desc: 'Optimized for QR scan → mobile browsing flow' },
  { icon: Globe, title: 'Shareable URL', desc: 'Custom slug URLs for every store' },
];

const BUSINESS_TYPES = ['Restaurants', 'Cafes', 'Salons', 'Retail', 'Fashion', 'Bakeries', 'Hotels', 'Gyms'];

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ─── Navigation ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="glass rounded-2xl px-4 py-2 flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">StoreFront</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-dots opacity-30" />

        {/* Floating decorations */}
        <Floating delay={0} className="absolute top-[20%] left-[10%] opacity-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-accent-violet rotate-12" />
        </Floating>
        <Floating delay={2} distance={16} className="absolute top-[30%] right-[15%] opacity-15">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-coral to-accent-amber -rotate-12" />
        </Floating>
        <Floating delay={1} distance={10} className="absolute bottom-[25%] left-[20%] opacity-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-emerald to-accent-cyan" />
        </Floating>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <ScrollReveal variant="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Free to start • No credit card required
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Create your{' '}
              <span className="gradient-text">digital storefront</span>
              {' '}in minutes
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.2}>
            <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Beautiful storefronts, menus, catalogs, and QR codes for any business.
              Share your products with the world — no app download needed.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  Create Your Store
                </Button>
              </Link>
              <Link to="/s/demo">
                <Button variant="secondary" size="lg" icon={<Layout className="w-4 h-4" />}>
                  View Demo Store
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.4}>
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-surface-400">
              {BUSINESS_TYPES.map((type) => (
                <span key={type} className="hidden sm:inline">{type}</span>
              ))}
              <span className="sm:hidden">For all business types</span>
            </div>
          </ScrollReveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-surface-300 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-surface-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Everything you need to go digital
              </h2>
              <p className="text-surface-500 max-w-xl mx-auto">
                From product catalogs to branded QR codes — we handle it all.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={staggerChild}>
                <div className="group p-6 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-surface-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-50 relative">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Live in 3 simple steps
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your store', desc: 'Add your business info, logo, and choose a theme', icon: Store },
              { step: '02', title: 'Add your products', desc: 'Upload images, set prices, organize categories', icon: ShoppingBag },
              { step: '03', title: 'Share your QR', desc: 'Download your branded QR code and start sharing', icon: QrCode },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.15}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center justify-center mx-auto mb-5">
                    <s.icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <div className="text-xs font-bold text-brand-500 mb-2">STEP {s.step}</div>
                  <h3 className="text-lg font-bold text-surface-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-surface-500">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(92,124,250,0.15),transparent_70%)]" />
        
        <ScrollReveal>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to create your storefront?
            </h2>
            <p className="text-surface-400 mb-8">
              Join thousands of businesses who've gone digital. Start for free.
            </p>
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started — It's Free
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center">
              <Store className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">StoreFront</span>
          </div>
          <p className="text-xs text-surface-400">© {new Date().getFullYear()} StoreFront. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
