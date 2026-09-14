// ─── Unified 3D Card & QR Design Studio ──────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner, getBusiness } from '@/services/storeService';
import { Button, Card, Input, Select, PageHeader, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Card3D, type CardConfig } from '@/components/ui/Card3D';
import { toPng } from 'html-to-image';
import {
  RotateCw, Download, Sparkles, Palette, Type, Smartphone, LayoutGrid,
  CreditCard, Check, Layers, Image as ImageIcon, Copy, RefreshCw, Eye,
  QrCode, Wifi, Tag, Award, Heart, Gift, Sliders, Clock, ShieldCheck, CheckSquare,
  FileImage, Scissors, Layers3, Grid
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Store, Business } from '@/types';

const GREETING_PRESETS = [
  {
    label: 'Thank You For Your Business',
    title: 'Thank You For Visiting!',
    body: 'We truly appreciate your support. Scan the front QR code to browse our full catalog, claim rewards, or leave a review!',
    coupon: 'THANKYOU10',
  },
  {
    label: '10% Discount Voucher',
    title: 'Enjoy 10% Off Next Visit!',
    body: 'Present this card at checkout or scan the QR code to redeem your exclusive 10% discount on your next order.',
    coupon: 'SAVE10VIP',
  },
  {
    label: 'Welcome To Our Store',
    title: 'Welcome To Our Store!',
    body: 'We are thrilled to have you here. Scan the QR code on the front to explore daily recommendations & special offers.',
    coupon: 'WELCOME2026',
  },
  {
    label: 'Instant Digital Menu & Order',
    title: 'Scan For Digital Menu',
    body: 'Skip the line! Scan the QR code to view our full digital menu, daily chef specials, and order directly from your phone.',
    coupon: '',
  },
];

const THEME_FONTS = [
  { label: 'Outfit (Modern Clean)', value: 'Outfit, sans-serif' },
  { label: 'Inter (Sleek Tech)', value: 'Inter, sans-serif' },
  { label: 'Playfair Display (Serif Luxury)', value: "'Playfair Display', serif" },
  { label: 'Dancing Script (Handwriting Script)', value: "'Dancing Script', cursive" },
  { label: 'Great Vibes (Calligraphy Script)', value: "'Great Vibes', cursive" },
  { label: 'Cinzel (Roman Executive)', value: "'Cinzel', serif" },
  { label: 'Montserrat (Bold Geometric)', value: "'Montserrat', sans-serif" },
  { label: 'Space Grotesk (Futuristic Display)', value: "'Space Grotesk', sans-serif" },
  { label: 'Sacramento (Flowing Cursive)', value: "'Sacramento', cursive" },
  { label: 'Cormorant Garamond (Fine Editorial)', value: "'Cormorant Garamond', serif" },
  { label: 'Syne (Avant-Garde Designer)', value: "'Syne', sans-serif" },
  { label: 'Fira Code (Developer Monospace)', value: "'Fira Code', monospace" },
  { label: 'Plus Jakarta Sans (Corporate Clean)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'DM Serif Display (Classic Editorial)', value: "'DM Serif Display', serif" },
  { label: 'Lora (Timeless Serif)', value: "'Lora', serif" },
];

const DESIGNER_PALETTES = [
  {
    name: 'Claymorphism 3D Soft',
    material: 'claymorphic' as const,
    bgColor1: '#ffffff',
    bgColor2: '#eef3f8',
    textColor: '#0f172a',
    accentColor: '#2563eb',
    dotColor: '#2563eb',
  },
  {
    name: 'Neobrutalism Pop',
    material: 'neobrutalism' as const,
    bgColor1: '#fef08a',
    bgColor2: '#fde047',
    textColor: '#000000',
    accentColor: '#f43f5e',
    dotColor: '#000000',
  },
  {
    name: 'Maximalist Retro Pop',
    material: 'maximalism' as const,
    bgColor1: '#ff007f',
    bgColor2: '#7928ca',
    textColor: '#ffffff',
    accentColor: '#ffea00',
    dotColor: '#ffea00',
  },
  {
    name: 'Frosted Glassmorphism',
    material: 'frosted-glass' as const,
    bgColor1: 'rgba(255, 255, 255, 0.25)',
    bgColor2: 'rgba(255, 255, 255, 0.1)',
    textColor: '#0f172a',
    accentColor: '#0284c7',
    dotColor: '#0284c7',
  },
  {
    name: 'Obsidian & Gold',
    material: 'gold-foil' as const,
    bgColor1: '#0b0f19',
    bgColor2: '#1c1917',
    textColor: '#f8fafc',
    accentColor: '#d4af37',
    dotColor: '#d4af37',
  },
  {
    name: 'Cyberpunk Neon',
    material: 'cyber-neon' as const,
    bgColor1: '#09090b',
    bgColor2: '#18181b',
    textColor: '#38bdf8',
    accentColor: '#f43f5e',
    dotColor: '#38bdf8',
  },
  {
    name: 'Holographic Silver Shift',
    material: 'holographic' as const,
    bgColor1: '#ec4899',
    bgColor2: '#8b5cf6',
    textColor: '#ffffff',
    accentColor: '#06b6d4',
    dotColor: '#06b6d4',
  },
  {
    name: 'Brushed Titanium Slate',
    material: 'brushed-metal' as const,
    bgColor1: '#334155',
    bgColor2: '#1e293b',
    textColor: '#f8fafc',
    accentColor: '#38bdf8',
    dotColor: '#38bdf8',
  },
  {
    name: 'Kraft Eco Organic',
    material: 'kraft-paper' as const,
    bgColor1: '#d7c4b7',
    bgColor2: '#c5b0a2',
    textColor: '#3f2e21',
    accentColor: '#78431e',
    dotColor: '#3f2e21',
  },
  {
    name: 'Royal Velvet Violet',
    material: 'royal-velvet' as const,
    bgColor1: '#2e1065',
    bgColor2: '#4c1d95',
    textColor: '#faf5ff',
    accentColor: '#c084fc',
    dotColor: '#c084fc',
  },
  {
    name: 'Monochrome Editorial',
    material: 'monochrome-serif' as const,
    bgColor1: '#0f172a',
    bgColor2: '#020617',
    textColor: '#ffffff',
    accentColor: '#e2e8f0',
    dotColor: '#ffffff',
  },
  {
    name: 'Nordic Ice Scandinavian',
    material: 'nordic-ice' as const,
    bgColor1: '#e0f2fe',
    bgColor2: '#bae6fd',
    textColor: '#0369a1',
    accentColor: '#0284c7',
    dotColor: '#0284c7',
  },
];

const CARD_SHAPES = [
  { id: 'rounded', name: 'Classic Rounded', desc: 'Smooth 20px corners' },
  { id: 'pill', name: 'Super Pill Curve', desc: 'Curved 36px edge' },
  { id: 'sharp', name: 'Executive Sharp', desc: 'Crisp 4px straight edge' },
  { id: 'chamfer', name: 'Diagonal Cut Corner', desc: 'Notched corner cuts' },
  { id: 'arch', name: 'Arch Top Curve', desc: 'Arch curved top' },
];

const CARD_TEMPLATES: { id: string; name: string; category: string; desc: string; config: Partial<CardConfig> }[] = [
  {
    id: 'claymorphism-3d-app',
    name: 'Claymorphism 3D Soft',
    category: 'Modern Tech & App',
    desc: 'Soft 3D clay aesthetic with rounded pill cards, ambient shadows & top inner light reflection',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'extra-rounded',
        eyeStyle: 'extra-rounded',
        dotColor: '#2563eb',
        bgColor: '#ffffff',
        useCardAccentForQR: false,
        frameText: 'SCAN 3D APP',
        showFrameText: true,
      },
      front: {
        layout: 'center-qr',
        headerTitle: 'Fintech 3D App',
        headerSubtitle: 'CLAYMORPHIC DIGITAL WALLET',
        scriptFont: false,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'circle',
        badgeText: '3D CLAY UI',
        showBadge: true,
        qrLabel: 'Scan for Digital Storefront',
        showQR: true,
        showPhone: true,
        phone: '+1 (800) 3D-CLAY',
        showEmail: true,
        email: 'hello@claymorphism.app',
        showWebsite: true,
        website: 'claymorphism.app',
        showLocation: false,
        location: '',
        showSocials: true,
        instagram: 'clayui.app',
        facebook: '',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'greeting',
        brandName: 'Claymorphic Studio',
        tagline: 'Tactile 3D Digital Experience',
        greetingPreset: 'welcome',
        greetingTitle: 'Welcome to 3D Clay UI',
        greetingBody: 'Scan the QR code to experience our tactile digital storefront.',
        loyaltyStampsCount: 5,
        loyaltyRewardText: '',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: false,
      },
      styles: {
        material: 'claymorphic',
        cardShape: 'pill',
        bgType: 'gradient',
        bgColor1: '#ffffff',
        bgColor2: '#eef3f8',
        textColor: '#0f172a',
        accentColor: '#2563eb',
        fontFamily: "'Outfit', sans-serif",
        borderRadius: 28,
        pattern: 'none',
        borderStyle: 'solid',
      },
    },
  },
  {
    id: 'neobrutalism-yellow',
    name: 'Neobrutalism Pop',
    category: 'Creative & Agency',
    desc: 'Bold 4px black borders, hard black offset shadow, vibrant pop yellow & stark typography',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'square',
        eyeStyle: 'square',
        dotColor: '#000000',
        bgColor: '#ffffff',
        useCardAccentForQR: false,
        frameText: 'SCAN NOW!',
        showFrameText: true,
      },
      front: {
        layout: 'hero-avatar',
        headerTitle: 'BRUTAL LABS',
        headerSubtitle: 'NEOBRUTALISM CREATIVE STUDIO',
        scriptFont: false,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'square',
        badgeText: 'NEOBRUTALISM',
        showBadge: true,
        qrLabel: 'SCAN TO CONNECT',
        showQR: true,
        showPhone: true,
        phone: '+1 (555) 909-0000',
        showEmail: true,
        email: 'raw@brutallabs.design',
        showWebsite: true,
        website: 'brutallabs.design',
        showLocation: false,
        location: '',
        showSocials: true,
        instagram: 'brutal.labs',
        facebook: '',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'greeting',
        brandName: 'BRUTAL LABS',
        tagline: 'Raw Bold Digital Design',
        greetingPreset: 'custom',
        greetingTitle: 'NO BORING CARDS.',
        greetingBody: 'We build high-impact, raw, bold digital designs.',
        loyaltyStampsCount: 5,
        loyaltyRewardText: '',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: false,
      },
      styles: {
        material: 'neobrutalism',
        cardShape: 'sharp',
        bgType: 'solid',
        bgColor1: '#fef08a',
        bgColor2: '#fde047',
        textColor: '#000000',
        accentColor: '#f43f5e',
        fontFamily: "'Space Grotesk', sans-serif",
        borderRadius: 4,
        pattern: 'none',
        borderStyle: 'solid',
      },
    },
  },
  {
    id: 'canva-stylist',
    name: 'Canva Stylist & Salon',
    category: 'Beauty & Hair',
    desc: 'Portrait card with handwriting script header, central QR & social links',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'rounded',
        eyeStyle: 'dot',
        dotColor: '#2b2927',
        bgColor: 'rgba(255, 255, 255, 0.85)',
        useCardAccentForQR: false,
        frameText: 'BOOK APPOINTMENT',
        showFrameText: true,
      },
      front: {
        layout: 'center-qr',
        headerTitle: 'Aiah Blake',
        headerSubtitle: 'CERTIFIED HAIR STYLIST',
        scriptFont: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        showAvatar: true,
        avatarShape: 'circle',
        badgeText: 'VERIFIED STYLIST',
        showBadge: true,
        qrLabel: 'Scan to View Services & Book',
        showQR: true,
        showPhone: true,
        phone: '+1 (555) 321-4567',
        showEmail: true,
        email: 'hello@aiahblake.com',
        showWebsite: true,
        website: 'aiahblake.com',
        showLocation: false,
        location: '',
        showSocials: true,
        instagram: 'aiahblake',
        facebook: 'aiahblakestudio',
        twitter: '',
        whatsapp: '+15553214567',
      },
      back: {
        layout: 'greeting',
        brandName: 'Aiah Blake Studio',
        tagline: 'Elegance & Modern Hair Styling',
        greetingPreset: 'thank-you',
        greetingTitle: 'Thank You For Visiting!',
        greetingBody: 'Scan the QR code on the front to book your next hair appointment or browse our full digital menu.',
        couponCode: 'HAIR10',
        showCoupon: true,
        loyaltyStampsCount: 5,
        loyaltyRewardText: 'Buy 5 Services, Get 1 Free Treatment!',
        logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        showLogo: true,
        showSecondaryQR: false,
      },
      styles: {
        material: 'matte',
        cardShape: 'pill',
        bgType: 'solid',
        bgColor1: '#d4d0cb',
        bgColor2: '#c4c0bb',
        textColor: '#2b2927',
        accentColor: '#6e5d4f',
        fontFamily: 'Outfit, sans-serif',
        borderRadius: 24,
        pattern: 'none',
        borderStyle: 'solid',
      },
    },
  },
  {
    id: 'thank-you-card',
    name: 'Customer Thank You & Voucher',
    category: 'Retail & E-Commerce',
    desc: 'Thank you card with discount coupon code & social handle list',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'dots',
        eyeStyle: 'extra-rounded',
        dotColor: '#1e1e1e',
        bgColor: '#ffffff',
        useCardAccentForQR: false,
        frameText: 'CLAIM DISCOUNT',
        showFrameText: true,
      },
      front: {
        layout: 'badge-script',
        headerTitle: 'Thank You!',
        headerSubtitle: 'For Shopping With Us',
        scriptFont: true,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'circle',
        badgeText: '10% OFF VOUCHER',
        showBadge: true,
        qrLabel: 'Scan for Digital Catalog & Offers',
        showQR: true,
        showPhone: true,
        phone: '+1 (800) 555-0199',
        showEmail: true,
        email: 'support@storefront.com',
        showWebsite: true,
        website: 'yourstore.com',
        showLocation: true,
        location: 'Main St, Cityville',
        showSocials: true,
        instagram: 'yourbusiness',
        facebook: 'yourbusiness.official',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'greeting',
        brandName: 'Artisanal Goods',
        tagline: 'Handcrafted with Love & Care',
        greetingPreset: 'discount-voucher',
        greetingTitle: 'We Value Your Support!',
        greetingBody: 'Present this card or scan the QR code to receive 10% off your next purchase in-store or online.',
        couponCode: 'THANKYOU10',
        showCoupon: true,
        loyaltyStampsCount: 5,
        loyaltyRewardText: '',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: false,
      },
      styles: {
        material: 'matte',
        cardShape: 'rounded',
        bgType: 'solid',
        bgColor1: '#f5efeb',
        bgColor2: '#e5dfdb',
        textColor: '#2c221e',
        accentColor: '#8c533e',
        fontFamily: "'Lora', serif",
        borderRadius: 16,
        pattern: 'dots',
        borderStyle: 'dashed',
      },
    },
  },
  {
    id: 'loyalty-stamp-card',
    name: 'Loyalty Rewards Stamp Card',
    category: 'Cafe & Bakery',
    desc: 'Features 5 or 10 stamp reward grid on back of card',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'extra-rounded',
        eyeStyle: 'extra-rounded',
        dotColor: '#3c2415',
        bgColor: '#fdf6ee',
        useCardAccentForQR: false,
        frameText: 'SCAN MENU',
        showFrameText: true,
      },
      front: {
        layout: 'classic',
        headerTitle: 'Matcha & Coffee Co.',
        headerSubtitle: 'ARTISANAL CAFE & BAKERY',
        scriptFont: false,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'circle',
        badgeText: 'VIP LOYALTY CARD',
        showBadge: true,
        qrLabel: 'Scan to View Menu & Order',
        showQR: true,
        showPhone: true,
        phone: '+1 (555) 432-1099',
        showEmail: true,
        email: 'coffee@matchaco.com',
        showWebsite: true,
        website: 'matchaco.com',
        showLocation: false,
        location: '',
        showSocials: true,
        instagram: 'matchacoffee',
        facebook: '',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'loyalty-stamp',
        brandName: 'Matcha Coffee Club',
        tagline: 'Buy 5 Coffees, Get 1 Free!',
        greetingPreset: 'custom',
        greetingTitle: 'Loyalty Rewards',
        greetingBody: 'Get a stamp with every coffee purchase. 5th drink is on us!',
        loyaltyStampsCount: 5,
        loyaltyRewardText: 'Collect 5 stamps for a free artisanal coffee!',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: false,
      },
      styles: {
        material: 'matte',
        cardShape: 'rounded',
        bgType: 'solid',
        bgColor1: '#3c2415',
        bgColor2: '#28170c',
        textColor: '#fdf6ee',
        accentColor: '#d4a373',
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: 20,
        pattern: 'waves',
        borderStyle: 'none',
      },
    },
  },
  {
    id: 'wifi-guest-card',
    name: 'Customer WiFi Access Card',
    category: 'Hotel & Lounge',
    desc: 'Displays WiFi network SSID & password badge on back side',
    config: {
      orientation: 'portrait',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'center',
        dotPattern: 'classy-rounded',
        eyeStyle: 'dot',
        dotColor: '#0284c7',
        bgColor: '#ffffff',
        useCardAccentForQR: false,
        frameText: 'FREE WIFI SCAN',
        showFrameText: true,
      },
      front: {
        layout: 'center-qr',
        headerTitle: 'Sunset Hotel & Lounge',
        headerSubtitle: 'GUEST SERVICES & LOUNGE',
        scriptFont: false,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'circle',
        badgeText: 'FREE GUEST WIFI',
        showBadge: true,
        qrLabel: 'Scan for Guest Services & Menu',
        showQR: true,
        showPhone: true,
        phone: 'Dial 0 from room',
        showEmail: true,
        email: 'concierge@sunsethotel.com',
        showWebsite: true,
        website: 'sunsethotel.com',
        showLocation: false,
        location: '',
        showSocials: true,
        instagram: 'sunsethotellounge',
        facebook: '',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'wifi-card',
        brandName: 'Sunset Hotel WiFi',
        tagline: 'High Speed Guest Access',
        greetingPreset: 'welcome',
        greetingTitle: 'Welcome to Sunset Lounge',
        greetingBody: 'Connect to our complimentary high-speed guest network below.',
        wifiName: 'Sunset_Guest_WiFi',
        wifiPass: 'enjoyyourstay2026',
        loyaltyStampsCount: 5,
        loyaltyRewardText: '',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: true,
      },
      styles: {
        material: 'glossy-glass',
        cardShape: 'pill',
        bgType: 'gradient',
        bgColor1: '#0f172a',
        bgColor2: '#0369a1',
        textColor: '#ffffff',
        accentColor: '#38bdf8',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderRadius: 20,
        pattern: 'grid',
        borderStyle: 'solid',
      },
    },
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Obsidian & Gold Foil',
    category: 'Luxury & Boutique',
    desc: 'Deep charcoal background with gold foil borders & gold QR code',
    config: {
      orientation: 'landscape',
      qr: {
        dataUrl: '',
        size: 'medium',
        position: 'side',
        dotPattern: 'classy',
        eyeStyle: 'square',
        dotColor: '#d4af37',
        bgColor: '#0b0f19',
        useCardAccentForQR: true,
        frameText: 'PRIVATE CATALOG',
        showFrameText: true,
      },
      front: {
        layout: 'split-modern',
        headerTitle: 'AURELIA',
        headerSubtitle: 'HAUTE HORLOGERIE & JEWELRY',
        scriptFont: false,
        avatarUrl: '',
        showAvatar: false,
        avatarShape: 'circle',
        badgeText: 'VIP SALON',
        showBadge: true,
        qrLabel: 'SCAN PRIVATE COLLECTION',
        showQR: true,
        showPhone: true,
        phone: '+1 (800) 777-9000',
        showEmail: true,
        email: 'concierge@aurelia.com',
        showWebsite: true,
        website: 'aurelia.luxury',
        showLocation: true,
        location: 'Fifth Ave, New York',
        showSocials: true,
        instagram: 'aurelia.boutique',
        facebook: '',
        twitter: '',
        whatsapp: '',
      },
      back: {
        layout: 'greeting',
        brandName: 'A U R E L I A',
        tagline: 'Private Client Experience',
        greetingPreset: 'custom',
        greetingTitle: 'By Private Appointment',
        greetingBody: 'Scan the QR code to request a private viewing or browse our latest horlogerie releases.',
        loyaltyStampsCount: 5,
        loyaltyRewardText: '',
        logoUrl: '',
        showLogo: false,
        showSecondaryQR: true,
      },
      styles: {
        material: 'gold-foil',
        cardShape: 'chamfer',
        bgType: 'solid',
        bgColor1: '#0b0f19',
        bgColor2: '#1c1917',
        textColor: '#f8fafc',
        accentColor: '#d4af37',
        fontFamily: "'Playfair Display', serif",
        borderRadius: 12,
        pattern: 'none',
        borderStyle: 'gold-border',
      },
    },
  },
];

export default function CardStudioPage() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'qr' | 'front' | 'back' | 'styles'>('templates');
  const [isExporting, setIsExporting] = useState(false);

  // Unified Config State
  const [config, setConfig] = useState<CardConfig>({
    orientation: 'portrait',
    templateId: 'canva-stylist',
    qr: {
      dataUrl: '',
      size: 'medium',
      position: 'center',
      dotPattern: 'rounded',
      eyeStyle: 'dot',
      dotColor: '#2b2927',
      bgColor: 'rgba(255, 255, 255, 0.85)',
      useCardAccentForQR: false,
      frameText: 'BOOK APPOINTMENT',
      showFrameText: true,
    },
    front: {
      layout: 'center-qr',
      headerTitle: 'Aiah Blake',
      headerSubtitle: 'CERTIFIED HAIR STYLIST',
      scriptFont: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      showAvatar: true,
      avatarShape: 'circle',
      badgeText: 'VERIFIED STYLIST',
      showBadge: true,
      qrLabel: 'Scan to View Services & Book',
      showQR: true,
      showPhone: true,
      phone: '+1 (555) 321-4567',
      showEmail: true,
      email: 'hello@aiahblake.com',
      showWebsite: true,
      website: 'aiahblake.com',
      showLocation: false,
      location: '',
      showSocials: true,
      instagram: 'aiahblake',
      facebook: 'aiahblakestudio',
      twitter: '',
      whatsapp: '+15553214567',
    },
    back: {
      layout: 'greeting',
      brandName: 'Aiah Blake Studio',
      tagline: 'Elegance & Modern Hair Styling',
      greetingPreset: 'thank-you',
      greetingTitle: 'Thank You For Visiting!',
      greetingBody: 'Scan the QR code on the front to book your next hair appointment or browse our full digital menu.',
      couponCode: 'HAIR10',
      showCoupon: true,
      loyaltyStampsCount: 5,
      loyaltyRewardText: 'Buy 5 Services, Get 1 Free Treatment!',
      logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      showLogo: true,
      showSecondaryQR: false,
    },
    styles: {
      material: 'matte',
      cardShape: 'rounded',
      bgType: 'solid',
      bgColor1: '#d4d0cb',
      bgColor2: '#c4c0bb',
      textColor: '#2b2927',
      accentColor: '#6e5d4f',
      fontFamily: 'Outfit, sans-serif',
      borderRadius: 24,
      pattern: 'none',
      borderStyle: 'solid',
    },
  });

  const loadData = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (stores.length > 0) {
      const s = stores[0];
      setStore(s);
      const biz = await getBusiness(s.businessId);
      if (biz) {
        setBusiness(biz);
        const storeUrl = `${window.location.origin}/s/${s.slug}?src=qr`;
        setConfig((prev) => ({
          ...prev,
          qr: { ...prev.qr, dataUrl: storeUrl },
          front: {
            ...prev.front,
            headerTitle: biz.name || prev.front.headerTitle,
            headerSubtitle: biz.description ? biz.description.slice(0, 32) : prev.front.headerSubtitle,
            avatarUrl: biz.logo || prev.front.avatarUrl,
            phone: biz.phone || prev.front.phone,
            email: biz.email || prev.front.email,
            website: biz.website || `${s.slug}.storefront.com`,
            instagram: biz.socialLinks?.instagram || prev.front.instagram,
            facebook: biz.socialLinks?.facebook || prev.front.facebook,
            twitter: biz.socialLinks?.twitter || prev.front.twitter,
          },
          back: {
            ...prev.back,
            brandName: biz.name || prev.back.brandName,
            tagline: biz.description || prev.back.tagline,
            logoUrl: biz.logo || prev.back.logoUrl,
          },
        }));
      }
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const applyTemplate = (t: typeof CARD_TEMPLATES[0]) => {
    setConfig((prev) => ({
      ...prev,
      templateId: t.id,
      orientation: t.config.orientation || prev.orientation,
      qr: { ...prev.qr, ...t.config.qr, dataUrl: prev.qr.dataUrl },
      front: { ...prev.front, ...t.config.front },
      back: { ...prev.back, ...t.config.back },
      styles: { ...prev.styles, ...t.config.styles },
    }));
    toast.success(`Applied template: ${t.name}`);
  };

  const applyGreetingPreset = (presetKey: string) => {
    const p = GREETING_PRESETS.find((g) => g.title === presetKey || g.label === presetKey);
    if (p) {
      setConfig((prev) => ({
        ...prev,
        back: {
          ...prev.back,
          greetingTitle: p.title,
          greetingBody: p.body,
          couponCode: p.coupon || prev.back.couponCode,
        },
      }));
      toast.success('Greeting preset applied!');
    }
  };

  const applyPalette = (pal: typeof DESIGNER_PALETTES[0]) => {
    setConfig((prev) => ({
      ...prev,
      qr: {
        ...prev.qr,
        dotColor: pal.dotColor,
      },
      styles: {
        ...prev.styles,
        material: pal.material,
        bgColor1: pal.bgColor1,
        bgColor2: pal.bgColor2,
        textColor: pal.textColor,
        accentColor: pal.accentColor,
      },
    }));
    toast.success(`Applied ${pal.name} Palette!`);
  };

  // High-Res Card Snapshot Export Engine
  const handleDownloadCard = async (side: 'front' | 'back' | 'both') => {
    try {
      setIsExporting(true);
      toast.loading(`Generating high-resolution snapshot (${side} side)...`);

      const frontEl = document.getElementById('card-front-side');
      const backEl = document.getElementById('card-back-side');

      if (!frontEl || !backEl) {
        toast.dismiss();
        toast.error('Card element not ready for snapshot export');
        setIsExporting(false);
        return;
      }

      if (side === 'front') {
        const dataUrl = await toPng(frontEl, { quality: 1.0, pixelRatio: 3, style: { transform: 'none' } });
        const link = document.createElement('a');
        link.download = `card-front-side-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.dismiss();
        toast.success('Front Side downloaded in High-Res PNG!');
      } else if (side === 'back') {
        const dataUrl = await toPng(backEl, { quality: 1.0, pixelRatio: 3, style: { transform: 'none' } });
        const link = document.createElement('a');
        link.download = `card-back-side-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.dismiss();
        toast.success('Back Side downloaded in High-Res PNG!');
      } else if (side === 'both') {
        const frontDataUrl = await toPng(frontEl, { quality: 1.0, pixelRatio: 3, style: { transform: 'none' } });
        const backDataUrl = await toPng(backEl, { quality: 1.0, pixelRatio: 3, style: { transform: 'none' } });

        const imgFront = new Image();
        const imgBack = new Image();

        imgFront.src = frontDataUrl;
        imgBack.src = backDataUrl;

        await Promise.all([
          new Promise((res) => { imgFront.onload = res; }),
          new Promise((res) => { imgBack.onload = res; }),
        ]);

        const canvas = document.createElement('canvas');
        const padding = 40;
        const spacing = 40;
        canvas.width = imgFront.width + imgBack.width + padding * 2 + spacing;
        canvas.height = Math.max(imgFront.height, imgBack.height) + padding * 2 + 70;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText('FRONT SIDE', padding + 10, padding + 20);
          ctx.drawImage(imgFront, padding, padding + 35);

          ctx.fillText('BACK SIDE', padding + imgFront.width + spacing + 10, padding + 20);
          ctx.drawImage(imgBack, padding + imgFront.width + spacing, padding + 35);

          const combinedUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `card-dual-sided-${Date.now()}.png`;
          link.href = combinedUrl;
          link.click();
          toast.dismiss();
          toast.success('Both Sides (Dual Sheet) downloaded in High-Res PNG!');
        }
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.dismiss();
      toast.error('Failed to export card snapshot. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageTransition>
      <PageHeader
        title="3D Card & QR Design Studio 🎴"
        description="Design 2-sided 3D digital business cards, thank-you cards, loyalty cards, and customizable QR codes"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={<RotateCw className="w-4 h-4" />} onClick={() => setIsFlipped(!isFlipped)}>
              Flip Card ({isFlipped ? 'Back' : 'Front'})
            </Button>
            <div className="relative group">
              <Button icon={<Download className="w-4 h-4" />}>
                Download Card
              </Button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface-900 text-white rounded-2xl shadow-xl p-2 z-50 hidden group-hover:block space-y-1 border border-surface-700">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-surface-400 px-3 py-1">Download Options</p>
                <button
                  onClick={() => handleDownloadCard('front')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-800 flex items-center justify-between transition-all"
                >
                  <span>Front Side Only</span>
                  <FileImage className="w-3.5 h-3.5 text-brand-400" />
                </button>
                <button
                  onClick={() => handleDownloadCard('back')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-800 flex items-center justify-between transition-all"
                >
                  <span>Back Side Only</span>
                  <FileImage className="w-3.5 h-3.5 text-brand-400" />
                </button>
                <button
                  onClick={() => handleDownloadCard('both')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-800 flex items-center justify-between transition-all text-amber-300"
                >
                  <span>Both Sides (Dual Sheet)</span>
                  <Layers3 className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
            <Button icon={<Sparkles className="w-4 h-4" />} onClick={() => toast.success('Card Design Saved!')}>
              Save Design
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: 3D CARD STAGE & EXPORT BAR */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <Card className="w-full !p-6 flex flex-col items-center justify-center bg-gradient-to-b from-surface-100 to-surface-200/50 min-h-[560px] relative overflow-hidden">
            <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* View Lock Switch Bar */}
            <div className="w-full flex items-center justify-between gap-2 z-20 mb-6 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-surface-200 shadow-sm">
              <button
                onClick={() => setIsFlipped(false)}
                className={clsx(
                  'flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                  !isFlipped ? 'bg-brand-600 text-white shadow' : 'text-surface-600 hover:bg-surface-100'
                )}
              >
                <CreditCard className="w-3.5 h-3.5" /> Front Side View
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className={clsx(
                  'flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                  isFlipped ? 'bg-brand-600 text-white shadow' : 'text-surface-600 hover:bg-surface-100'
                )}
              >
                <Layers className="w-3.5 h-3.5" /> Back Side View
              </button>
            </div>

            {/* 3D Card Stage */}
            <div className="my-auto flex items-center justify-center">
              <Card3D config={config} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
            </div>

            <p className="text-xs text-surface-500 flex items-center gap-1.5 z-20 mt-4 mb-4">
              <Eye className="w-3.5 h-3.5 text-brand-600" /> Move mouse over card to tilt in 3D • Click to flip
            </p>

            {/* Quick Export Actions Bar */}
            <div className="w-full pt-4 border-t border-surface-200/80 z-20">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-surface-600 mb-2.5 text-center flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-brand-600" /> Instant Card Export Options
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={isExporting}
                  onClick={() => handleDownloadCard('front')}
                  className="py-2 px-2 rounded-xl bg-white border border-surface-200 hover:border-brand-500 text-[11px] font-bold text-surface-800 flex items-center justify-center gap-1 shadow-sm transition-all hover:bg-brand-50"
                >
                  Front Side
                </button>
                <button
                  disabled={isExporting}
                  onClick={() => handleDownloadCard('back')}
                  className="py-2 px-2 rounded-xl bg-white border border-surface-200 hover:border-brand-500 text-[11px] font-bold text-surface-800 flex items-center justify-center gap-1 shadow-sm transition-all hover:bg-brand-50"
                >
                  Back Side
                </button>
                <button
                  disabled={isExporting}
                  onClick={() => handleDownloadCard('both')}
                  className="py-2 px-2 rounded-xl bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow transition-all hover:bg-brand-700"
                >
                  Both Sides
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: EDITOR TABS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-surface-200 gap-1 overflow-x-auto">
            {[
              { id: 'templates', label: 'Templates', icon: LayoutGrid },
              { id: 'qr', label: 'QR Customization', icon: QrCode },
              { id: 'front', label: 'Front Details', icon: CreditCard },
              { id: 'back', label: 'Back Greetings', icon: Gift },
              { id: 'styles', label: 'Finishes & Colors', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={clsx(
                  'flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                    : 'border-transparent text-surface-500 hover:text-surface-900'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-surface-900">Choose Card Template & Purpose</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CARD_TEMPLATES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={clsx(
                      'p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col justify-between',
                      config.templateId === t.id
                        ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20'
                        : 'border-surface-200 bg-white hover:border-surface-300'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                          {t.category}
                        </span>
                        {config.templateId === t.id && (
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-surface-900 mb-1">{t.name}</h4>
                      <p className="text-xs text-surface-500 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MERGED QR CODE DESIGN STUDIO */}
          {activeTab === 'qr' && (
            <Card className="space-y-5">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand-600" /> Integrated QR Code Studio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="QR Pattern Style"
                  value={config.qr.dotPattern}
                  onChange={(e) => setConfig({ ...config, qr: { ...config.qr, dotPattern: e.target.value as any } })}
                  options={[
                    { value: 'rounded', label: 'Rounded Dots' },
                    { value: 'dots', label: 'Circular Dots' },
                    { value: 'classy', label: 'Classy Squares' },
                    { value: 'classy-rounded', label: 'Classy Rounded' },
                    { value: 'square', label: 'Standard Square' },
                    { value: 'extra-rounded', label: 'Extra Rounded' },
                  ]}
                />

                <Select
                  label="QR Eye Outer & Inner Style"
                  value={config.qr.eyeStyle}
                  onChange={(e) => setConfig({ ...config, qr: { ...config.qr, eyeStyle: e.target.value as any } })}
                  options={[
                    { value: 'extra-rounded', label: 'Soft Rounded Eyes' },
                    { value: 'dot', label: 'Circular Eye Center' },
                    { value: 'square', label: 'Classic Square Eyes' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1">QR Dot Color</label>
                  <input
                    type="color"
                    value={config.qr.dotColor}
                    onChange={(e) => setConfig({ ...config, qr: { ...config.qr, dotColor: e.target.value } })}
                    className="w-full h-10 rounded-xl cursor-pointer border border-surface-200 p-1"
                  />
                </div>
                <Input
                  label="QR Frame Badge Text"
                  value={config.qr.frameText || ''}
                  onChange={(e) => setConfig({ ...config, qr: { ...config.qr, frameText: e.target.value, showFrameText: true } })}
                  placeholder="e.g. SCAN ME, BOOK NOW, CLAIM DISCOUNT"
                />
              </div>

              <Input
                label="Center Logo Overlay URL (Optional)"
                value={config.qr.logoUrl || ''}
                onChange={(e) => setConfig({ ...config, qr: { ...config.qr, logoUrl: e.target.value } })}
                placeholder="https://..."
              />
            </Card>
          )}

          {/* TAB 3: FRONT SIDE DETAILS & TOGGLES */}
          {activeTab === 'front' && (
            <Card className="space-y-5">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-600" /> Front Side Elements & Fields
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Title / Person Name"
                  value={config.front.headerTitle}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, headerTitle: e.target.value } })}
                />
                <Input
                  label="Subtitle / Profession / Business"
                  value={config.front.headerSubtitle}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, headerSubtitle: e.target.value } })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Badge Banner Text"
                  value={config.front.badgeText || ''}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, badgeText: e.target.value, showBadge: true } })}
                  placeholder="e.g. VERIFIED, VIP MEMBER"
                />
                <Input
                  label="QR Subtitle Label"
                  value={config.front.qrLabel}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, qrLabel: e.target.value } })}
                />
              </div>

              {/* Element Toggle Switches */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-surface-100 text-xs font-semibold text-surface-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.scriptFont}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, scriptFont: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Script Font Title
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.showAvatar}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, showAvatar: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Show Avatar Image
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.showPhone}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, showPhone: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Show Phone Number
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.showEmail}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, showEmail: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Show Email
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.showWebsite}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, showWebsite: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Show Website
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.front.showSocials}
                    onChange={(e) => setConfig({ ...config, front: { ...config.front, showSocials: e.target.checked } })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  Show Social Handles
                </label>
              </div>

              <h4 className="font-semibold text-sm text-surface-800">Contact Info & Socials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone / WhatsApp"
                  value={config.front.phone}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, phone: e.target.value } })}
                />
                <Input
                  label="Email"
                  value={config.front.email}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, email: e.target.value } })}
                />
                <Input
                  label="Website / Link"
                  value={config.front.website}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, website: e.target.value } })}
                />
                <Input
                  label="Instagram Username"
                  value={config.front.instagram}
                  onChange={(e) => setConfig({ ...config, front: { ...config.front, instagram: e.target.value } })}
                />
              </div>
            </Card>
          )}

          {/* TAB 4: BACK SIDE GREETINGS & DESIGNS */}
          {activeTab === 'back' && (
            <Card className="space-y-5">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-600" /> Back Side Layout & Greetings
              </h3>

              <Select
                label="Back Side Card Purpose"
                value={config.back.layout}
                onChange={(e) => setConfig({ ...config, back: { ...config.back, layout: e.target.value as any } })}
                options={[
                  { value: 'greeting', label: 'Thank You & Discount Greeting Card' },
                  { value: 'loyalty-stamp', label: 'Loyalty Stamp Rewards Card' },
                  { value: 'wifi-card', label: 'Customer WiFi Access Card' },
                  { value: 'business-hours', label: 'Business Hours & Contact Details' },
                  { value: 'social-grid', label: 'Social Handles & Secondary QR' },
                ]}
              />

              {/* Preset Greeting Selector */}
              {config.back.layout === 'greeting' && (
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-2">Preset Greeting Message</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GREETING_PRESETS.map((g) => (
                      <button
                        key={g.label}
                        onClick={() => applyGreetingPreset(g.label)}
                        className="p-3 rounded-xl border border-surface-200 hover:border-brand-500 text-left text-xs font-medium bg-surface-50 hover:bg-brand-50/40 transition-all"
                      >
                        <p className="font-bold text-surface-900">{g.label}</p>
                        <p className="text-[11px] text-surface-500 truncate">{g.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Greeting Title"
                  value={config.back.greetingTitle}
                  onChange={(e) => setConfig({ ...config, back: { ...config.back, greetingTitle: e.target.value } })}
                />
                <Input
                  label="Coupon / Promo Code"
                  value={config.back.couponCode || ''}
                  onChange={(e) => setConfig({ ...config, back: { ...config.back, couponCode: e.target.value, showCoupon: true } })}
                />
              </div>

              <Input
                label="Greeting Message Body"
                value={config.back.greetingBody}
                onChange={(e) => setConfig({ ...config, back: { ...config.back, greetingBody: e.target.value } })}
              />

              {config.back.layout === 'loyalty-stamp' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200">
                  <Select
                    label="Stamps Count"
                    value={String(config.back.loyaltyStampsCount || 5)}
                    onChange={(e) => setConfig({ ...config, back: { ...config.back, loyaltyStampsCount: Number(e.target.value) as any } })}
                    options={[
                      { value: '5', label: '5 Stamps (1 Row)' },
                      { value: '10', label: '10 Stamps (2 Rows)' },
                    ]}
                  />
                  <Input
                    label="Loyalty Reward Text"
                    value={config.back.loyaltyRewardText || ''}
                    onChange={(e) => setConfig({ ...config, back: { ...config.back, loyaltyRewardText: e.target.value } })}
                    placeholder="Collect 5 stamps for a free coffee!"
                  />
                </div>
              )}

              {config.back.layout === 'wifi-card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200">
                  <Input
                    label="WiFi Network Name (SSID)"
                    value={config.back.wifiName || ''}
                    onChange={(e) => setConfig({ ...config, back: { ...config.back, wifiName: e.target.value } })}
                  />
                  <Input
                    label="WiFi Password"
                    value={config.back.wifiPass || ''}
                    onChange={(e) => setConfig({ ...config, back: { ...config.back, wifiPass: e.target.value } })}
                  />
                </div>
              )}
            </Card>
          )}

          {/* TAB 5: FINISHES, FONTS, PALETTES & SHAPES */}
          {activeTab === 'styles' && (
            <Card className="space-y-6">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-600" /> Finishes, Fonts, Color Palettes & Shapes
              </h3>

              {/* 1. Designer Color Palettes Swatches */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-2">Curated Designer Color Palettes</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DESIGNER_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      onClick={() => applyPalette(pal)}
                      className="p-2.5 rounded-xl border border-surface-200 hover:border-brand-500 flex items-center justify-between gap-2 text-xs font-semibold bg-surface-50 hover:bg-white transition-all shadow-sm group"
                    >
                      <span className="truncate text-surface-800 group-hover:text-brand-600">{pal.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: pal.bgColor1 }} />
                        <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: pal.accentColor }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Theme Typography Fonts Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Card Theme Typography Font"
                  value={config.styles.fontFamily}
                  onChange={(e) => setConfig({ ...config, styles: { ...config.styles, fontFamily: e.target.value } })}
                  options={THEME_FONTS}
                />

                <Select
                  label="Background Pattern Overlay"
                  value={config.styles.pattern}
                  onChange={(e) => setConfig({ ...config, styles: { ...config.styles, pattern: e.target.value as any } })}
                  options={[
                    { value: 'none', label: 'Clean / None' },
                    { value: 'dots', label: 'Radial Dot Matrix' },
                    { value: 'waves', label: 'Diagonal Waves' },
                    { value: 'grid', label: 'Architectural Grid' },
                  ]}
                />
              </div>

              {/* 3. Card Shapes Selector */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-2">Card Shape & Cut Finish</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CARD_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setConfig({ ...config, styles: { ...config.styles, cardShape: shape.id as any } })}
                      className={clsx(
                        'p-3 rounded-xl border text-left transition-all',
                        (config.styles.cardShape || 'rounded') === shape.id
                          ? 'border-brand-600 bg-brand-50/50 text-brand-700 ring-2 ring-brand-500/20 font-bold'
                          : 'border-surface-200 hover:bg-surface-50 text-surface-700 font-medium'
                      )}
                    >
                      <p className="text-xs">{shape.name}</p>
                      <p className="text-[10px] text-surface-500 font-normal">{shape.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Card Finish Material */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-2">Card Finish Material</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'matte', name: 'Premium Matte' },
                    { id: 'glossy-glass', name: 'Glassmorphism' },
                    { id: 'gold-foil', name: 'Obsidian Gold' },
                    { id: 'cyber-neon', name: 'Cyber Neon' },
                    { id: 'kraft-paper', name: 'Kraft Paper' },
                    { id: 'holographic', name: 'Holographic' },
                    { id: 'brushed-metal', name: 'Brushed Metal' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setConfig({ ...config, styles: { ...config.styles, material: m.id as any } })}
                      className={clsx(
                        'p-3 rounded-xl border text-xs font-semibold transition-all',
                        config.styles.material === m.id ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20' : 'border-surface-200 hover:bg-surface-50'
                      )}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Orientation Selector */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-2">Card Orientation</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setConfig({ ...config, orientation: 'portrait' })}
                    className={clsx(
                      'p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                      config.orientation === 'portrait' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-surface-200 hover:bg-surface-50'
                    )}
                  >
                    Vertical (2" x 3.5")
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, orientation: 'landscape' })}
                    className={clsx(
                      'p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                      config.orientation === 'landscape' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-surface-200 hover:bg-surface-50'
                    )}
                  >
                    Horizontal (3.5" x 2")
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, orientation: 'square' })}
                    className={clsx(
                      'p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                      config.orientation === 'square' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-surface-200 hover:bg-surface-50'
                    )}
                  >
                    Square (3" x 3")
                  </button>
                </div>
              </div>

              {/* 6. Custom Color Pickers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-surface-200">
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={config.styles.bgColor1}
                    onChange={(e) => setConfig({ ...config, styles: { ...config.styles, bgColor1: e.target.value } })}
                    className="w-full h-10 rounded-xl cursor-pointer border border-surface-200 p-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={config.styles.textColor}
                    onChange={(e) => setConfig({ ...config, styles: { ...config.styles, textColor: e.target.value } })}
                    className="w-full h-10 rounded-xl cursor-pointer border border-surface-200 p-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={config.styles.accentColor}
                    onChange={(e) => setConfig({ ...config, styles: { ...config.styles, accentColor: e.target.value } })}
                    className="w-full h-10 rounded-xl cursor-pointer border border-surface-200 p-1"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
