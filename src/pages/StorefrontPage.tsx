// ─── Public Storefront Page ─────────────────────────────────────────────────
// This is the page customers see when scanning the QR code: /s/:slug
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoreBySlug, getBusiness } from '@/services/storeService';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { getActiveDiscounts } from '@/services/discountService';
import { getStoreReviews } from '@/services/reviewService';
import { trackEvent } from '@/services/analyticsService';
import { resolveTheme, themeToCSSVars, getThemeFontsUrl } from '@/themes/themeEngine';
import { ScrollReveal, StaggerContainer, staggerChild, TiltCard, ParallaxLayer } from '@/storefront/animations';
import { StoreReviewsSection } from '@/components/storefront/StoreReviewsSection';
import {
  MapPin, Phone, MessageCircle, Star, X, ArrowUp, ShoppingBag,
  Flame, Sparkles, CheckCircle2, Laptop, Smartphone, Armchair,
  Shirt, Scissors, Coffee, Search, Store as StoreIcon
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/SocialIcons';
import { clsx } from 'clsx';
import type { Store, Business, Product, Category, Discount, Review } from '@/types';

// ─── Demo Store Fallback Data for /s/demo ─────────────────────────────────────
const createDemoStore = (themeId: string = 'laptop_store'): Store => ({
  id: 'demo-store-id',
  businessId: 'demo-business-id',
  ownerId: 'demo-owner-id',
  name: 'Studio Electronics & Lifestyle Demo',
  slug: 'demo',
  status: 'published',
  theme: {
    themeId,
    customColors: {},
    customTypography: {},
    customRadius: '',
    customAnimationIntensity: 'high',
  },
  sections: [],
  settings: {
    whatsappNumber: '919876543210',
    whatsappMessage: 'Hi! I found your store through your digital storefront demo and would like to place an order.',
    showCallButton: true,
    showWhatsappButton: true,
    showDirections: true,
    showSocialLinks: true,
    announcement: '⚡ LIVE DEMO STORE: Order Laptops, Mobiles, Furniture & Boutiques via WhatsApp!',
    announcementActive: true,
  },
  seo: {
    title: 'Studio Electronics & Living | Live Digital Storefront Demo',
    description: 'Explore live digital storefront for laptops, smartphones, furniture and boutique products.',
    ogImage: '',
  },
  currency: 'INR',
  currencySymbol: '₹',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const DEMO_BUSINESS: Business = {
  id: 'demo-business-id',
  ownerId: 'demo-owner-id',
  name: 'Studio Tech & Living',
  type: 'electronics',
  slug: 'demo',
  logo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
  cover: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
  description: 'Premium Laptops, Mobile Electronics, Nordic Furniture & Lifestyle Apparel. Scan QR code to order directly via WhatsApp or Call with zero commissions.',
  ownerName: 'Studio Demo Manager',
  phone: '+919876543210',
  email: 'demo@storefront.app',
  location: 'Tech Plaza, MG Road, Metro City',
  website: 'https://storefront-demo.app',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'published',
};

const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-laptops', storeId: 'demo-store-id', name: 'Laptops & Computers', description: 'Ultraportables, Workstations & Gaming Laptops', image: '', icon: '💻', order: 1, visibility: true, featured: true, productCount: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat-mobiles', storeId: 'demo-store-id', name: 'Smartphones & Audio', description: 'Flagship Mobiles & Wireless Earbuds', image: '', icon: '📱', order: 2, visibility: true, featured: true, productCount: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat-furniture', storeId: 'demo-store-id', name: 'Furniture & Living', description: 'Nordic Armchairs, Oak Desks & LED Lighting', image: '', icon: '🛋️', order: 3, visibility: true, featured: true, productCount: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat-fashion', storeId: 'demo-store-id', name: 'Fashion & Boutiques', description: 'Denim Jackets, Totes & Apparel', image: '', icon: '🛍️', order: 4, visibility: true, featured: true, productCount: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat-salon', storeId: 'demo-store-id', name: 'Salon & Spa Services', description: 'Facials, Hair Spa & Grooming', image: '', icon: '💇', order: 5, visibility: true, featured: true, productCount: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat-cafe', storeId: 'demo-store-id', name: 'Cafe & Gourmet', description: 'Matcha Lattes & Artisanal Pastries', image: '', icon: '☕', order: 6, visibility: true, featured: true, productCount: 1, createdAt: new Date(), updatedAt: new Date() },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-macbook',
    storeId: 'demo-store-id',
    categoryId: 'cat-laptops',
    name: 'MacBook Pro 16" M3 Max',
    price: 249900,
    salePrice: 239900,
    description: 'Apple M3 Max chip with 14-core CPU and 30-core GPU, 36GB Unified Memory, 1TB SSD. 16.2" Liquid Retina XDR display with 120Hz ProMotion.',
    mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
    sku: 'MAC-M3-16',
    tags: ['Apple', 'M3 Max', 'Laptop'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-rog',
    storeId: 'demo-store-id',
    categoryId: 'cat-laptops',
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop',
    price: 189900,
    salePrice: 174900,
    description: 'Intel Core Ultra 9, NVIDIA RTX 4080 12GB, 32GB LPDDR5X RAM, 1TB Gen4 SSD, 240Hz OLED Display. Ultra-thin CNC aluminum body.',
    mainImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'],
    sku: 'ROG-G16-4080',
    tags: ['Gaming', 'RTX 4080', 'OLED'],
    status: 'active',
    featured: true,
    bestseller: false,
    isNew: true,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-dell',
    storeId: 'demo-store-id',
    categoryId: 'cat-laptops',
    name: 'Dell XPS 13 Ultra-Thin Laptop',
    price: 129900,
    salePrice: 119900,
    description: 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, 13.4" 4K+ Touchscreen Display. Seamless glass touchpad.',
    mainImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'],
    sku: 'DELL-XPS-13',
    tags: ['Dell', 'Ultrabook'],
    status: 'active',
    featured: false,
    bestseller: false,
    isNew: false,
    veg: false,
    spicy: false,
    premium: false,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-iphone',
    storeId: 'demo-store-id',
    categoryId: 'cat-mobiles',
    name: 'iPhone 15 Pro Max 256GB Titanium',
    price: 149900,
    salePrice: 139900,
    description: 'Aerospace-grade titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom, customizable Action button, USB-C 3.0 speeds.',
    mainImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'],
    sku: 'IPHONE-15PM',
    tags: ['iPhone', 'Titanium'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-s24',
    storeId: 'demo-store-id',
    categoryId: 'cat-mobiles',
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 129900,
    salePrice: 119900,
    description: '200MP Quad Telephoto Camera, Built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, Live Call Translate & AI Photo Assist.',
    mainImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'],
    sku: 'SAMS-S24U',
    tags: ['Samsung', 'Galaxy AI'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-earbuds',
    storeId: 'demo-store-id',
    categoryId: 'cat-mobiles',
    name: 'ANC Wireless Noise-Canceling Earbuds',
    price: 8999,
    salePrice: 5999,
    description: 'Active Noise Cancellation, 36hr total battery with wireless charging case, IPX5 spatial audio with head tracking.',
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    sku: 'AUDIO-EARBUDS',
    tags: ['Audio', 'Wireless'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: false,
    veg: false,
    spicy: false,
    premium: false,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-armchair',
    storeId: 'demo-store-id',
    categoryId: 'cat-furniture',
    name: 'Nordic Ergonomic Velvet Armchair',
    price: 18999,
    salePrice: 14999,
    description: 'Handcrafted solid beech wood frame with high-density plush velvet upholstery & ergonomic lumbar support.',
    mainImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'],
    sku: 'FURN-ARMCHAIR',
    tags: ['Living', 'Nordic'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-desk',
    storeId: 'demo-store-id',
    categoryId: 'cat-furniture',
    name: 'Solid Oak Minimalist Executive Desk',
    price: 24999,
    salePrice: 21999,
    description: 'Sustainably harvested solid white oak desk with built-in wireless Qi charger and hidden cable management tray.',
    mainImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'],
    sku: 'FURN-OAK-DESK',
    tags: ['Office', 'Oak'],
    status: 'active',
    featured: false,
    bestseller: false,
    isNew: false,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-lamp',
    storeId: 'demo-store-id',
    categoryId: 'cat-furniture',
    name: 'Dimmable Brushed Brass LED Desk Lamp',
    price: 4499,
    salePrice: 3299,
    description: 'Touch dimmable warm LED lamp with 3 color temperatures and 360-degree adjustable swivel head.',
    mainImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'],
    sku: 'LAMP-BRASS',
    tags: ['Lighting', 'Brass'],
    status: 'active',
    featured: false,
    bestseller: false,
    isNew: false,
    veg: false,
    spicy: false,
    premium: false,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-denim',
    storeId: 'demo-store-id',
    categoryId: 'cat-fashion',
    name: 'Artisan Minimalist Oversized Denim Jacket',
    price: 3999,
    salePrice: 2499,
    description: '100% Organic heavyweight cotton denim with custom matte black hardware.',
    mainImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'],
    sku: 'FASH-DENIM',
    tags: ['Fashion', 'Denim'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: false,
    spicy: false,
    premium: false,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-facial',
    storeId: 'demo-store-id',
    categoryId: 'cat-salon',
    name: 'Organic Hydrating Facial & Scalp Therapy',
    price: 1999,
    salePrice: 1499,
    description: '60-minute deep botanical facial treatment with aromatherapy scalp massage and collagen mask.',
    mainImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80'],
    sku: 'SPA-FACIAL',
    tags: ['Spa', 'Facial'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: false,
    veg: false,
    spicy: false,
    premium: true,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-matcha',
    storeId: 'demo-store-id',
    categoryId: 'cat-cafe',
    name: 'Ceremonial Grade Uji Matcha Latte',
    price: 349,
    salePrice: 299,
    description: 'First-harvest Kyoto Uji matcha whisked with organic oat milk and raw agave nectar.',
    mainImage: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop&q=80'],
    sku: 'CAFE-MATCHA',
    tags: ['Matcha', 'Cafe'],
    status: 'active',
    featured: true,
    bestseller: true,
    isNew: true,
    veg: true,
    spicy: false,
    premium: false,
    availability: true,
    variants: [],
    addons: [],
    customAttributes: {},
    order: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_DISCOUNTS: Discount[] = [
  {
    id: 'disc-1',
    storeId: 'demo-store-id',
    name: 'FLAT 20% OFF ON ALL TECH & GADGETS',
    description: 'Get 20% off on smartphones and laptop purchases',
    code: 'TECH20',
    type: 'percentage',
    value: 20,
    productIds: [],
    categoryIds: [],
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    active: true,
    usageLimit: 100,
    usageCount: 12,
    minOrderValue: 5000,
    maxDiscount: 2000,
    conditions: {},
    image: '',
    badge: 'OFFER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'disc-2',
    storeId: 'demo-store-id',
    name: 'FREE EXPRESS HOME DELIVERY & UNBOXING DEMO',
    description: 'Free home delivery on orders above 10,000',
    code: 'FREEDEMO',
    type: 'flat',
    value: 500,
    productIds: [],
    categoryIds: [],
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    active: true,
    usageLimit: 100,
    usageCount: 8,
    minOrderValue: 10000,
    maxDiscount: 500,
    conditions: {},
    image: '',
    badge: 'FREE DELIVERY',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_REVIEWS: Review[] = [
  { id: 'rev-1', storeId: 'demo-store-id', customerName: 'Alex Rivera', rating: 5, comment: 'Bought my MacBook Pro through WhatsApp! The digital storefront made comparing specs super smooth.', status: 'published', createdAt: new Date() },
  { id: 'rev-2', storeId: 'demo-store-id', customerName: 'Priya Sharma', rating: 5, comment: 'Scanned the QR stand in their furniture showroom and ordered the Velvet Armchair directly. Excellent service!', status: 'published', createdAt: new Date() },
  { id: 'rev-3', storeId: 'demo-store-id', customerName: 'Vikram Patel', rating: 5, comment: 'Fastest catalog scanning ever! My customers browse all mobile accessories in seconds.', status: 'published', createdAt: new Date() },
];

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const theme = useMemo(() => store?.theme ? resolveTheme(store.theme) : null, [store]);
  const cssVars = useMemo(() => theme ? themeToCSSVars(theme) : {}, [theme]);
  const fontsUrl = useMemo(() => theme ? getThemeFontsUrl(theme) : '', [theme]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedTheme = urlParams.get('theme') || 'laptop_store';

        if (slug === 'demo' || slug.includes('demo')) {
          setStore(createDemoStore(requestedTheme));
          setBusiness(DEMO_BUSINESS);
          setProducts(DEMO_PRODUCTS);
          setCategories(DEMO_CATEGORIES);
          setDiscounts(DEMO_DISCOUNTS);
          setReviews(DEMO_REVIEWS);
          setLoading(false);
          document.title = "Live Demo Storefront | Laptops, Mobiles, Furniture & Boutiques";
          return;
        }

        const s = await getStoreBySlug(slug);
        if (!s) {
          setError(true);
          setLoading(false);
          return;
        }
        setStore(s);

        const [biz, prods, cats, offers, revs] = await Promise.all([
          getBusiness(s.businessId),
          getProducts(s.id),
          getCategories(s.id),
          getActiveDiscounts(s.id),
          getStoreReviews(s.id),
        ]);

        setBusiness(biz);
        setProducts(prods.filter(p => p.status === 'active'));
        setCategories(cats.filter(c => c.visibility !== false));
        setDiscounts(offers);
        setReviews(revs);

        // Track real analytics events
        const isQRScan = window.location.search.includes('src=qr');
        if (isQRScan) {
          trackEvent(s.id, 'qr_scan', { source: 'qr_code' });
        }
        trackEvent(s.id, 'store_view', { isQRScan });

        // SEO
        document.title = s.seo?.title || `${biz?.name || 'Store'} | Digital Storefront`;
      } catch (err) {
        console.error(err);
        if (slug === 'demo' || slug?.includes('demo')) {
          const urlParams = new URLSearchParams(window.location.search);
          const requestedTheme = urlParams.get('theme') || 'laptop_store';
          setStore(createDemoStore(requestedTheme));
          setBusiness(DEMO_BUSINESS);
          setProducts(DEMO_PRODUCTS);
          setCategories(DEMO_CATEGORIES);
          setDiscounts(DEMO_DISCOUNTS);
          setReviews(DEMO_REVIEWS);
          setError(false);
        } else {
          setError(true);
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  // Scroll listener
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Use ONLY actual business products, categories, and discounts (NO automatic fake data!)
  const displayProducts = products;
  const displayCategories = categories;
  const displayDiscounts = discounts;

  const filteredProducts = selectedCategory === 'all'
    ? displayProducts
    : displayProducts.filter(p => p.categoryId === selectedCategory);

  const featuredProducts = displayProducts.filter(p => p.featured);
  const currency = store?.currencySymbol || '₹';

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
    if (store) trackEvent(store.id, 'product_view', { productId: p.id, productName: p.name });
  };

  const handleWhatsApp = () => {
    if (!business?.phone) return;
    const msg = encodeURIComponent(store?.settings?.whatsappMessage || `Hi, I found your store through your digital storefront.`);
    window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
    if (store) trackEvent(store.id, 'whatsapp_click');
  };

  const handleCall = () => {
    if (!business?.phone) return;
    window.open(`tel:${business.phone}`, '_self');
    if (store) trackEvent(store.id, 'call_click');
  };

  // ─── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full" />
          <p className="text-sm font-semibold tracking-wider uppercase text-amber-400 animate-pulse">Loading Storefront...</p>
        </div>
      </div>
    );
  }

  if (error || !store || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Store not found</h1>
        <p className="text-surface-500">This store may not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <>
      {/* Load theme fonts */}
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      <div className="storefront min-h-screen" style={{ ...cssVars, backgroundColor: 'var(--sf-background)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}>

        {/* ─── Live Demo Interactive Switcher (Only on /s/demo) ─── */}
        {(slug === 'demo' || slug?.includes('demo')) && (
          <div className="bg-slate-900 text-slate-100 py-2.5 px-4 text-xs font-semibold flex items-center justify-between gap-4 overflow-x-auto border-b border-slate-800 sticky top-0 z-50 shadow-md">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-amber-300">DEMO TEMPLATES:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {[
                { id: 'laptop_store', label: 'Laptop Store', Icon: Laptop },
                { id: 'mobile_store', label: 'Mobile Store', Icon: Smartphone },
                { id: 'furniture_store', label: 'Furniture', Icon: Armchair },
                { id: 'macha_boba', label: 'Boutique', Icon: Shirt },
                { id: 'pastry_sweets', label: 'Salon & Spa', Icon: Scissors },
                { id: 'asian_poke', label: 'Cafe & Bakery', Icon: Coffee },
              ].map(t => {
                const SwitchIcon = t.Icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setStore(prev => prev ? { ...prev, theme: { ...prev.theme, themeId: t.id } } : null)}
                    className={clsx(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                      store?.theme?.themeId === t.id
                        ? "bg-amber-400 text-slate-950 shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    <SwitchIcon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Announcement Bar (Only if configured by store owner) ─── */}
        {store?.settings?.announcementActive && store.settings.announcement && (
          <div className="py-2.5 px-4 text-xs font-bold text-center text-white shadow-sm" style={{ backgroundColor: 'var(--sf-accent)' }}>
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> {store.settings.announcement}
            </span>
          </div>
        )}

        {/* ─── Ultra-Sleek Professional Hero Banner ────────────────────────── */}
        <section className="relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
          {/* Cover Background */}
          {business.cover ? (
            <ParallaxLayer speed={0.3} className="absolute inset-0">
              <img src={business.cover} alt="" className="w-full h-full object-cover" />
            </ParallaxLayer>
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, var(--sf-primary), var(--sf-accent))` }} />
          )}

          {/* High-Contrast Gradient Backdrop Mask for 100% Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

          {/* Clean Hero Content Box */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 flex flex-col items-center text-center">
            
            {/* Store Avatar Logo */}
            <ScrollReveal variant="scale">
              <div className="relative mb-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/40 shadow-2xl overflow-hidden p-1 flex items-center justify-center">
                  {business.logo ? (
                    <img src={business.logo} alt={business.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-4xl font-black text-white">
                      {business.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg border-2 border-slate-900" title="Verified Store">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </ScrollReveal>

            {/* Status & Category Badges */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> OPEN NOW
                </span>
                {business.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" /> {business.location}
                  </span>
                )}
              </div>
            </ScrollReveal>

            {/* Business Title */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md" style={{ fontFamily: 'var(--sf-heading-font)' }}>
                {business.name}
              </h1>
            </ScrollReveal>

            {/* Business Description */}
            {business.description && (
              <ScrollReveal variant="fadeUp" delay={0.3}>
                <p className="text-white/85 max-w-lg text-sm sm:text-base leading-relaxed font-normal drop-shadow-sm mb-4">
                  {business.description}
                </p>
              </ScrollReveal>
            )}

            {/* Quick Action Buttons */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {business.phone && (
                  <button onClick={handleWhatsApp} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                    <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                  </button>
                )}
                {business.phone && (
                  <button onClick={handleCall} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-md text-white text-sm font-bold hover:bg-white/25 transition-all border border-white/20 shadow-xl active:scale-95">
                    <Phone className="w-4 h-4 text-amber-300" /> Call Store
                  </button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Sticky Category Nav (Only rendered if owner created categories) ─── */}
        {displayCategories.length > 0 && (
          <div className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ backgroundColor: 'var(--sf-background)', borderColor: 'var(--sf-border)' }}>
            <div className="max-w-5xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={clsx('px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5',
                    selectedCategory === 'all' ? 'text-white scale-105' : 'hover:opacity-80'
                  )}
                  style={{
                    backgroundColor: selectedCategory === 'all' ? 'var(--sf-accent)' : 'var(--sf-surface)',
                    color: selectedCategory === 'all' ? 'white' : 'var(--sf-text-secondary)',
                    border: '1px solid var(--sf-border)',
                  }}
                >
                  <span>✨ All Items</span>
                </button>
                {displayCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={clsx('px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5',
                      selectedCategory === c.id ? 'scale-105' : 'hover:opacity-80'
                    )}
                    style={{
                      backgroundColor: selectedCategory === c.id ? 'var(--sf-accent)' : 'var(--sf-surface)',
                      color: selectedCategory === c.id ? 'white' : 'var(--sf-text-secondary)',
                      border: '1px solid var(--sf-border)',
                    }}
                  >
                    {c.icon && <span className="text-base">{c.icon}</span>}
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Offers & Discount Banners (Only if owner created active deals) ─── */}
        {displayDiscounts.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 py-6">
            <ScrollReveal>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {displayDiscounts.map((d) => (
                  <div
                    key={d.id}
                    className="flex-shrink-0 px-6 py-5 rounded-3xl min-w-[260px] relative overflow-hidden shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, var(--sf-accent), var(--sf-primary))` }}
                  >
                    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-300" /> Active Deal
                      </span>
                      {d.code && (
                        <span className="text-white text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-lg border border-white/20">
                          {d.code}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-xl font-black tracking-tight mb-1">
                      {d.type === 'percentage' ? `${d.value}% OFF` : d.type === 'flat' ? `${currency}${d.value} OFF` : d.name}
                    </p>
                    <p className="text-white/85 text-xs font-medium">{d.description || d.name}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ─── Featured Products Section ──────────────────────────────── */}
        {featuredProducts.length > 0 && selectedCategory === 'all' && (
          <section className="max-w-5xl mx-auto px-4 py-6">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2" style={{ fontFamily: 'var(--sf-heading-font)', color: 'var(--sf-text)' }}>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" /> Featured Favorites
                </h2>
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🔥 Specials
                </span>
              </div>
            </ScrollReveal>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredProducts.map((p) => (
                <ScrollReveal key={p.id} variant="scale">
                  <TiltCard intensity={6} className="group flex-shrink-0 w-[200px] cursor-pointer">
                    <div
                      onClick={() => handleProductClick(p)}
                      className="rounded-3xl overflow-hidden relative transition-all duration-300 hover:shadow-2xl"
                      style={{ backgroundColor: 'var(--sf-surface)', border: `1px solid var(--sf-border)`, boxShadow: 'var(--sf-shadow-card)' }}
                    >
                      {p.mainImage ? (
                        <div className="aspect-square overflow-hidden relative">
                          <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-md flex items-center gap-0.5">
                              ⭐ FEATURED
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center text-5xl" style={{ backgroundColor: 'var(--sf-surface)' }}>🛍️</div>
                      )}
                      <div className="p-4">
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--sf-text)' }}>{p.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-base font-black text-amber-500">
                            {currency}{p.salePrice && p.salePrice < p.price ? p.salePrice : p.price}
                          </span>
                          {p.salePrice && p.salePrice < p.price && (
                            <span className="text-xs line-through" style={{ color: 'var(--sf-text-secondary)' }}>{currency}{p.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ─── Product Grid / Empty State ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2" style={{ fontFamily: 'var(--sf-heading-font)', color: 'var(--sf-text)' }}>
              <ShoppingBag className="w-6 h-6" style={{ color: 'var(--sf-accent)' }} />
              {selectedCategory === 'all' ? 'Products & Menu' : displayCategories.find(c => c.id === selectedCategory)?.name}
            </h2>
            {displayProducts.length > 0 && (
              <span className="text-xs font-semibold" style={{ color: 'var(--sf-text-secondary)' }}>
                Showing {filteredProducts.length} items
              </span>
            )}
          </div>

          {displayProducts.length === 0 ? (
            /* Clean Empty State when store owner hasn't added products */
            <div className="py-16 px-6 text-center rounded-3xl border border-dashed my-6 max-w-xl mx-auto" style={{ borderColor: 'var(--sf-border)', backgroundColor: 'var(--sf-surface)' }}>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 text-3xl">
                🛍️
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--sf-text)' }}>No products listed yet</h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--sf-text-secondary)' }}>
                {business.name} hasn't added any products or menu items to their store yet. Check back soon!
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <motion.div key={p.id} variants={staggerChild}>
                  <TiltCard intensity={5} className="group cursor-pointer h-full">
                    <div
                      onClick={() => handleProductClick(p)}
                      className="rounded-3xl overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative border"
                      style={{
                        backgroundColor: 'var(--sf-surface)',
                        borderColor: 'var(--sf-border)',
                        boxShadow: 'var(--sf-shadow-card)',
                      }}
                    >
                      <div>
                        {p.mainImage ? (
                          <div className="aspect-square overflow-hidden relative">
                            <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" loading="lazy" />
                            
                            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                              {p.bestseller && (
                                <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                                  <Flame className="w-3 h-3 fill-white" /> BESTSELLER
                                </span>
                              )}
                              {p.isNew && (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> NEW
                                </span>
                              )}
                              {p.premium && (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                                  👑 PREMIUM
                                </span>
                              )}
                            </div>

                            {p.salePrice && p.salePrice < p.price && (
                              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-white text-[10px] font-black shadow-md" style={{ backgroundColor: 'var(--sf-accent)' }}>
                                {Math.round((1 - p.salePrice / p.price) * 100)}% OFF
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center text-5xl" style={{ backgroundColor: 'var(--sf-surface)' }}>🛍️</div>
                        )}

                        <div className="p-4">
                          <div className="flex items-center gap-1.5 mb-1">
                            {p.veg && (
                              <span className="w-4 h-4 rounded border border-emerald-500 flex items-center justify-center" title="100% Vegetarian">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              </span>
                            )}
                            {p.spicy && <span className="text-xs" title="Spicy">🌶️</span>}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold truncate" style={{ color: 'var(--sf-text)' }}>{p.name}</h3>
                          {p.description && <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--sf-text-secondary)' }}>{p.description}</p>}
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between">
                        <div>
                          <span className="text-base sm:text-lg font-black" style={{ color: 'var(--sf-accent)' }}>
                            {currency}{p.salePrice && p.salePrice < p.price ? p.salePrice : p.price}
                          </span>
                          {p.salePrice && p.salePrice < p.price && (
                            <span className="text-xs line-through ml-1.5" style={{ color: 'var(--sf-text-secondary)' }}>{currency}{p.price}</span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(p);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                          style={{ backgroundColor: 'var(--sf-accent)' }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* ─── Customer Reviews Section ────────────────────────────────── */}
        <StoreReviewsSection
          storeId={store.id}
          storeName={business.name}
          reviews={reviews}
          onReviewAdded={(newReview) => setReviews(prev => [newReview, ...prev])}
        />

        {/* ─── Contact & Social ────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <ScrollReveal>
            <div className="rounded-3xl p-8 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--sf-surface)', border: `1px solid var(--sf-border)` }}>
              <h2 className="text-xl font-black mb-2" style={{ fontFamily: 'var(--sf-heading-font)' }}>Get in Touch with {business.name}</h2>
              <p className="text-xs sm:text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--sf-text-secondary)' }}>
                Have a question or want to order directly? Reach out to us anytime!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {business.phone && (
                  <button onClick={handleCall} className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm" style={{ backgroundColor: 'var(--sf-background)', border: `1px solid var(--sf-border)`, color: 'var(--sf-text)' }}>
                    <Phone className="w-4 h-4 text-amber-500" /> Call Now
                  </button>
                )}
                {business.phone && (
                  <button onClick={handleWhatsApp} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-md">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Chat
                  </button>
                )}
                {business.socialLinks?.instagram && (
                  <a href={`https://instagram.com/${business.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm" style={{ backgroundColor: 'var(--sf-background)', border: `1px solid var(--sf-border)`, color: 'var(--sf-text)' }}>
                    <InstagramIcon className="w-4 h-4 text-pink-500" /> Instagram
                  </a>
                )}
                {business.location && (
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(business.location)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm" style={{ backgroundColor: 'var(--sf-background)', border: `1px solid var(--sf-border)`, color: 'var(--sf-text)' }}>
                    <MapPin className="w-4 h-4 text-rose-500" /> Get Directions
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── Footer ─────────────────────────────────────────────────── */}
        <footer className="py-8 text-center border-t" style={{ borderColor: 'var(--sf-border)' }}>
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--sf-text-secondary)' }}>
              Powered by <span className="font-extrabold text-amber-500">StoreFront QR</span> • Modern Digital Storefronts
            </p>
          </div>
        </footer>

        {/* ─── Scroll to Top ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'var(--sf-accent)', color: 'white' }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ─── Product Detail Modal ───────────────────────────────────── */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh] overflow-y-auto max-w-2xl mx-auto shadow-2xl border-t border-white/20"
                style={{ backgroundColor: 'var(--sf-background)' }}
              >
                <div className="flex justify-center pt-3 pb-1"><div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'var(--sf-border)' }} /></div>
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center z-10 shadow-md" style={{ backgroundColor: 'var(--sf-surface)', color: 'var(--sf-text)' }}>
                  <X className="w-5 h-5" />
                </button>

                {selectedProduct.mainImage && (
                  <div className="aspect-[16/9] w-full overflow-hidden relative">
                    <img src={selectedProduct.mainImage} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="px-6 py-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedProduct.veg && <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% VEG</span>}
                      {selectedProduct.spicy && <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">SPICY 🌶️</span>}
                      {selectedProduct.isNew && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">NEW ITEM</span>}
                      {selectedProduct.bestseller && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">BESTSELLER 🔥</span>}
                    </div>
                    <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--sf-heading-font)', color: 'var(--sf-text)' }}>{selectedProduct.name}</h2>
                  </div>

                  {selectedProduct.description && (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--sf-text-secondary)' }}>{selectedProduct.description}</p>
                  )}

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-amber-500">
                      {currency}{selectedProduct.salePrice && selectedProduct.salePrice < selectedProduct.price ? selectedProduct.salePrice : selectedProduct.price}
                    </span>
                    {selectedProduct.salePrice && selectedProduct.salePrice < selectedProduct.price && (
                      <span className="text-base line-through" style={{ color: 'var(--sf-text-secondary)' }}>{currency}{selectedProduct.price}</span>
                    )}
                  </div>

                  {/* Variants */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>Choose Option</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.variants.map((v) => (
                          <div key={v.id} className="px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: 'var(--sf-surface)', border: `1px solid var(--sf-border)` }}>
                            <span style={{ color: 'var(--sf-text)' }}>{v.name}</span>
                            <span className="font-extrabold text-amber-500">{currency}{v.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Addons */}
                  {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>Extra Add-ons</h3>
                      <div className="space-y-2">
                        {selectedProduct.addons.map((a) => (
                          <div key={a.id} className="flex items-center justify-between px-4 py-2.5 rounded-2xl" style={{ backgroundColor: 'var(--sf-surface)' }}>
                            <span className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>{a.name}</span>
                            <span className="text-sm font-extrabold text-amber-500">+{currency}{a.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Order */}
                  {business?.phone && (
                    <button onClick={() => {
                      const msg = encodeURIComponent(`Hi! I'd like to order ${selectedProduct.name} (${currency}${selectedProduct.price})`);
                      window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                    }} className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg active:scale-95 text-base">
                      <MessageCircle className="w-5 h-5" /> Order via WhatsApp
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
