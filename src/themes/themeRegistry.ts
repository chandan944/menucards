// ─── Theme Registry: All 15 Store Templates ──────────────────────────────────
import type { ThemeConfig } from '@/types/theme';

const BASE_BLOCKS = ['hero','profile','announcement','categories','featured','productGrid','offers','gallery','reviews','contact','social','faq','text','footer'];

export const themeRegistry: Record<string, ThemeConfig & { heroImage?: string; badgeText?: string }> = {
  // 1. Macha Boba & Good Vibes (Reference Image 1)
  macha_boba: {
    id: 'macha_boba', name: 'Macha Boba & Good Vibes', description: 'Organic cream & sage green aesthetics with floating boba tea hero', preview: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&auto=format&fit=crop&q=80', badgeText: '100% REAL MATCHA', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#2b3e1f', secondary: '#f7f5ef', accent: '#4a6735', background: '#f7f5ef', surface: '#ffffff', surfaceHover: '#eef3ea', text: '#2b3e1f', textSecondary: '#627258', border: '#dbe5d5', success: '#4a6735', warning: '#e69138', error: '#cc0000' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '24px', button: '20px', input: '14px', badge: '12px' },
    cardStyle: 'elevated', buttonStyle: 'pill',
    shadows: { card: '0 8px 24px rgba(74,103,53,0.08)', hover: '0 16px 36px rgba(74,103,53,0.16)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'split', overlay: 'none', height: 'full' },
    productCard: { style: 'standard', hoverEffect: 'lift-glow', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 2. Pastry & Sweet Moments (Reference Image 2)
  pastry_sweets: {
    id: 'pastry_sweets', name: 'Pastry & Sweet Moments', description: 'Dusty cocoa & pastel rose with torn paper edge styling and serif elegance', preview: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', badgeText: 'FRESHLY BAKED DAILY', category: 'premium', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#4a2525', secondary: '#fbf5ef', accent: '#783535', background: '#fbf5ef', surface: '#f5e6de', surfaceHover: '#edd5c8', text: '#3d1e1e', textSecondary: '#8a6262', border: '#ebd5c7', success: '#6b8f71', warning: '#d99b26', error: '#c44343' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lora', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '28px', button: '24px', input: '14px', badge: '10px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 6px 20px rgba(120,53,53,0.06)', hover: '0 14px 32px rgba(120,53,53,0.12)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'fade' },
    hero: { style: 'cinematic', overlay: 'light', height: 'full' },
    productCard: { style: 'luxury', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 3. Asian Poke & Noodle Bowl (Reference Image 3)
  asian_poke: {
    id: 'asian_poke', name: 'Asian Poke & Noodle Bowl', description: 'Frosted gradient mesh with floating round bowl hero & star ratings', preview: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', badgeText: '★ 9.2 RATED BOWL', category: 'modern', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#1b262c', secondary: '#f4f8f3', accent: '#ff9f1c', background: '#e9f0e8', surface: 'rgba(255,255,255,0.85)', surfaceHover: '#ffffff', text: '#1b262c', textSecondary: '#5a6b73', border: 'rgba(255,255,255,0.6)', success: '#2ec4b6', warning: '#ff9f1c', error: '#e71d36' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '32px', button: '24px', input: '16px', badge: '14px' },
    cardStyle: 'glass', buttonStyle: 'pill',
    shadows: { card: '0 10px 30px rgba(0,0,0,0.06)', hover: '0 20px 40px rgba(255,159,28,0.2)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'split', overlay: 'blur', height: 'full' },
    productCard: { style: 'glass', hoverEffect: 'scale', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'minimal' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 4. Kanigiri Indian Biryani House (Reference Image 4)
  indian_biryani: {
    id: 'indian_biryani', name: 'Kanigiri Biryani House', description: 'Crisp white wave backdrop, mutton biryani hero with price tags & green/mustard clay cards', preview: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', badgeText: 'PRICE ₹360', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#2b2b2b', secondary: '#f9f9f9', accent: '#6b8e23', background: '#f9f9f9', surface: '#ffffff', surfaceHover: '#f0f4e8', text: '#2b2b2b', textSecondary: '#666666', border: '#e2e8d5', success: '#6b8e23', warning: '#e59b38', error: '#d9534f' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Inter', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '24px', button: '18px', input: '12px', badge: '16px' },
    cardStyle: 'elevated', buttonStyle: 'rounded',
    shadows: { card: '0 8px 24px rgba(107,142,35,0.12)', hover: '0 16px 36px rgba(107,142,35,0.2)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'slide' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift-glow', imageRatio: '4:3' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 5. Fresh Organic Catering (Reference Image 5)
  organic_catering: {
    id: 'organic_catering', name: 'Fresh Organic Catering', description: 'Clean white & emerald green design with top hero dish plate and feature grid badges', preview: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', badgeText: '100% ORGANIC', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#1e6b3b', secondary: '#f2f8f4', accent: '#1e6b3b', background: '#f8fbf9', surface: '#ffffff', surfaceHover: '#eaf4ee', text: '#193e27', textSecondary: '#547862', border: '#d8ebe0', success: '#1e6b3b', warning: '#f5a623', error: '#d0021b' },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '20px', button: '16px', input: '12px', badge: '10px' },
    cardStyle: 'bordered', buttonStyle: 'pill',
    shadows: { card: '0 4px 16px rgba(30,107,59,0.06)', hover: '0 12px 28px rgba(30,107,59,0.12)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'medium', parallax: true, tilt: false, stagger: true, reveal: 'fade' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 6. Gourmet Steakhouse & Bistro
  gourmet_bistro: {
    id: 'gourmet_bistro', name: 'Gourmet Steakhouse & Bistro', description: 'Moody dark charcoal & gold foil accents with sizzle steak hero image', preview: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', badgeText: 'PRIME AGED STEAKS', category: 'premium', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#141414', secondary: '#1e1e1e', accent: '#d4af37', background: '#0e0e0e', surface: '#1a1a1a', surfaceHover: '#262626', text: '#f5f5f5', textSecondary: '#a3a3a3', border: '#333333', success: '#2ec4b6', warning: '#d4af37', error: '#e63946' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lora', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '16px', button: '12px', input: '10px', badge: '8px' },
    cardStyle: 'elevated', buttonStyle: 'rounded',
    shadows: { card: '0 8px 32px rgba(0,0,0,0.4)', hover: '0 16px 48px rgba(212,175,55,0.2)', modal: '0 32px 64px rgba(0,0,0,0.5)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'blur' },
    hero: { style: 'cinematic', overlay: 'dark', height: 'full' },
    productCard: { style: 'luxury', hoverEffect: 'lift-glow', imageRatio: 'portrait' },
    navigation: { style: 'transparent', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 7. Tokyo Sushi & Ramen Bar
  tokyo_sushi: {
    id: 'tokyo_sushi', name: 'Tokyo Sushi & Ramen Bar', description: 'Zen Japanese minimalist aesthetics with crimson accents & bento grids', preview: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80', badgeText: 'FRESH OMAKASE', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#1d3557', secondary: '#faf8f5', accent: '#e63946', background: '#faf8f5', surface: '#ffffff', surfaceHover: '#f1faee', text: '#1d3557', textSecondary: '#457b9d', border: '#e8e2d9', success: '#2a9d8f', warning: '#e9c46a', error: '#e63946' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '16px', button: '12px', input: '8px', badge: '6px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 4px 16px rgba(29,53,87,0.06)', hover: '0 12px 32px rgba(230,57,70,0.15)', modal: '0 24px 48px rgba(0,0,0,0.12)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 8. Tropical Smoothie & Juicery
  tropical_juicery: {
    id: 'tropical_juicery', name: 'Tropical Smoothie & Juicery', description: 'Vibrant sunset gradients with cold-pressed juice badges & papaya tones', preview: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80', badgeText: 'COLD PRESSED 100%', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#2d1b4e', secondary: '#fff9f2', accent: '#ff6b6b', background: '#fff9f2', surface: '#ffffff', surfaceHover: '#fff0e5', text: '#2d1b4e', textSecondary: '#7b6882', border: '#ffe3d1', success: '#51cf66', warning: '#fcc419', error: '#ff6b6b' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '32px', button: '24px', input: '16px', badge: '16px' },
    cardStyle: 'elevated', buttonStyle: 'pill',
    shadows: { card: '0 10px 30px rgba(255,107,107,0.1)', hover: '0 18px 40px rgba(255,107,107,0.2)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'gradient', overlay: 'gradient', height: 'full' },
    productCard: { style: 'standard', hoverEffect: 'lift-glow', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 9. Italian Trattoria & Pizzeria
  italian_trattoria: {
    id: 'italian_trattoria', name: 'Italian Trattoria & Pizzeria', description: 'Rustic brick terracotta with woodfired pizza hero & tomato basil badges', preview: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80', badgeText: 'WOODFIRED OVEN', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#3a1e1e', secondary: '#fdf8f5', accent: '#c0392b', background: '#fdf8f5', surface: '#ffffff', surfaceHover: '#fbeee6', text: '#3a1e1e', textSecondary: '#7f5a5a', border: '#f2d6c9', success: '#27ae60', warning: '#f39c12', error: '#c0392b' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lora', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '20px', button: '16px', input: '12px', badge: '10px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 6px 20px rgba(192,57,43,0.08)', hover: '0 14px 32px rgba(192,57,43,0.16)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'slide' },
    hero: { style: 'cinematic', overlay: 'dark', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 10. Smash Burger Joint
  smash_burger: {
    id: 'smash_burger', name: 'Smash Burger Joint', description: 'Bold retro neon diner vibes with stacked burger hero & neobrutalism borders', preview: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', badgeText: 'DOUBLE SMASHED', category: 'bold', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#ffffff', secondary: '#18181c', accent: '#ffcc00', background: '#141416', surface: '#1f1f24', surfaceHover: '#2a2a30', text: '#ffffff', textSecondary: '#a1a1aa', border: '#33333d', success: '#10b981', warning: '#ffcc00', error: '#ef4444' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '900', bodyWeight: '400' },
    radius: { card: '16px', button: '12px', input: '10px', badge: '8px' },
    cardStyle: 'bordered', buttonStyle: 'square',
    shadows: { card: '0 6px 20px rgba(0,0,0,0.4)', hover: '0 0 24px rgba(255,204,0,0.25)', modal: '0 24px 48px rgba(0,0,0,0.5)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'cinematic', overlay: 'dark', height: 'full' },
    productCard: { style: 'bordered', hoverEffect: 'lift-glow', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'minimal' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 11. Artisanal French Bakery
  french_bakery: {
    id: 'french_bakery', name: 'Artisanal French Bakery', description: 'Parisian gold & ivory with warm butter croissant hero and elegant serif type', preview: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', badgeText: 'PUR BEURRE 100%', category: 'premium', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#3d2e1e', secondary: '#fdfbf7', accent: '#c68b59', background: '#fdfbf7', surface: '#f7f1e5', surfaceHover: '#efe5d5', text: '#3d2e1e', textSecondary: '#7a634e', border: '#e8dcce', success: '#5b8e66', warning: '#d99b26', error: '#c44343' },
    typography: { headingFont: 'DM Serif Display', bodyFont: 'Lora', headingWeight: '400', bodyWeight: '400' },
    radius: { card: '24px', button: '20px', input: '12px', badge: '10px' },
    cardStyle: 'elevated', buttonStyle: 'rounded',
    shadows: { card: '0 6px 20px rgba(198,139,89,0.08)', hover: '0 14px 32px rgba(198,139,89,0.16)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'low', parallax: true, tilt: false, stagger: true, reveal: 'fade' },
    hero: { style: 'image', overlay: 'light', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 12. Taco Fiesta Street Food
  taco_fiesta: {
    id: 'taco_fiesta', name: 'Taco Fiesta Street Food', description: 'Vibrant Mexican festival colors with spicy salsa badges & lime card accents', preview: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80', badgeText: 'HANDMADE TACOS', category: 'bold', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#2d1810', secondary: '#fffde7', accent: '#ff5722', background: '#fffde7', surface: '#ffffff', surfaceHover: '#fff9c4', text: '#2d1810', textSecondary: '#7a5240', border: '#ffe082', success: '#8bc34a', warning: '#ffc107', error: '#f44336' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '24px', button: '18px', input: '12px', badge: '12px' },
    cardStyle: 'bordered', buttonStyle: 'pill',
    shadows: { card: '0 8px 24px rgba(255,87,34,0.1)', hover: '0 16px 36px rgba(255,87,34,0.2)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'gradient', overlay: 'gradient', height: 'medium' },
    productCard: { style: 'bordered', hoverEffect: 'lift-glow', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 13. Craft Brewery & Taproom
  craft_brewery: {
    id: 'craft_brewery', name: 'Craft Brewery & Taproom', description: 'Amber malt & dark slate tones with foaming beer glass hero & barrel motifs', preview: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=80', badgeText: 'SMALL BATCH BREWS', category: 'dark', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#f39c12', secondary: '#1c1a17', accent: '#f39c12', background: '#141210', surface: '#1c1a17', surfaceHover: '#292622', text: '#f5e8d3', textSecondary: '#a69680', border: '#3d372e', success: '#27ae60', warning: '#f39c12', error: '#e74c3c' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '16px', button: '12px', input: '10px', badge: '8px' },
    cardStyle: 'elevated', buttonStyle: 'rounded',
    shadows: { card: '0 6px 24px rgba(0,0,0,0.5)', hover: '0 12px 32px rgba(243,156,18,0.2)', modal: '0 24px 48px rgba(0,0,0,0.6)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'slide' },
    hero: { style: 'cinematic', overlay: 'dark', height: 'full' },
    productCard: { style: 'standard', hoverEffect: 'lift-glow', imageRatio: 'square' },
    navigation: { style: 'transparent', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 14. Mediterranean Mezze Grill
  mediterranean_grill: {
    id: 'mediterranean_grill', name: 'Mediterranean Mezze Grill', description: 'Aegean sea breeze blue & crisp white with falafel & hummus bowl hero', preview: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', badgeText: 'FRESH MEZZE & GYRO', category: 'specialty', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#003566', secondary: '#f0f7ff', accent: '#0077b6', background: '#f0f7ff', surface: '#ffffff', surfaceHover: '#e0f2fe', text: '#001d3d', textSecondary: '#486581', border: '#bae6fd', success: '#52b788', warning: '#ffb703', error: '#d90429' },
    typography: { headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '28px', button: '20px', input: '14px', badge: '12px' },
    cardStyle: 'glass', buttonStyle: 'pill',
    shadows: { card: '0 8px 24px rgba(0,119,182,0.08)', hover: '0 16px 36px rgba(0,119,182,0.16)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'high', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'glass', hoverEffect: 'scale', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'standard' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 15. Modern Bento Box Cafe
  modern_bento: {
    id: 'modern_bento', name: 'Modern Bento Box Cafe', description: 'Japanese linen & sage matcha accents with organized bento grid layout', preview: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', badgeText: 'BALANCED BENTO SETS', category: 'modern', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#3a3a3a', secondary: '#f8f6f0', accent: '#6b705c', background: '#f8f6f0', surface: '#ffffff', surfaceHover: '#f0ede6', text: '#2b2b2b', textSecondary: '#6b705c', border: '#ddd8cc', success: '#6b705c', warning: '#cb997e', error: '#b7094c' },
    typography: { headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '20px', button: '16px', input: '10px', badge: '8px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 4px 16px rgba(107,112,92,0.06)', hover: '0 12px 28px rgba(107,112,92,0.12)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'low', parallax: true, tilt: false, stagger: true, reveal: 'fade' },
    hero: { style: 'split', overlay: 'none', height: 'compact' },
    productCard: { style: 'minimal', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'minimal' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 16. Laptop & Computer Store
  laptop_store: {
    id: 'laptop_store', name: 'Laptop & Tech Studio', description: 'Clean graphite & brushed silver clay aesthetic for computer stores & PC hardware', preview: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', badgeText: 'ORIGINAL WARRANTY', category: 'tech', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#0f172a', secondary: '#f8fafc', accent: '#0284c7', background: '#f1f5f9', surface: '#ffffff', surfaceHover: '#e2e8f0', text: '#0f172a', textSecondary: '#64748b', border: '#cbd5e1', success: '#10b981', warning: '#f59e0b', error: '#ef4444' },
    typography: { headingFont: 'Outfit', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '24px', button: '16px', input: '12px', badge: '10px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 8px 24px rgba(15,23,42,0.06)', hover: '0 16px 36px rgba(2,132,199,0.15)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'scale' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 17. Mobile & Electronics Hub
  mobile_store: {
    id: 'mobile_store', name: 'Mobile & Gadgets Hub', description: 'Monochrome slate with electric blue accents for smartphones, earbuds & repair shops', preview: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', badgeText: '100% GENUINE GADGETS', category: 'tech', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#18181b', secondary: '#f4f4f5', accent: '#2563eb', background: '#f4f4f5', surface: '#ffffff', surfaceHover: '#e4e4e7', text: '#18181b', textSecondary: '#71717a', border: '#d4d4d8', success: '#16a34a', warning: '#d97706', error: '#dc2626' },
    typography: { headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', headingWeight: '800', bodyWeight: '400' },
    radius: { card: '24px', button: '16px', input: '12px', badge: '10px' },
    cardStyle: 'elevated', buttonStyle: 'rounded',
    shadows: { card: '0 8px 24px rgba(24,24,27,0.06)', hover: '0 16px 36px rgba(37,99,235,0.15)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'medium', parallax: true, tilt: true, stagger: true, reveal: 'fade' },
    hero: { style: 'split', overlay: 'none', height: 'medium' },
    productCard: { style: 'standard', hoverEffect: 'lift', imageRatio: 'square' },
    navigation: { style: 'blur', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },

  // 18. Furniture & Home Decor Studio
  furniture_store: {
    id: 'furniture_store', name: 'Furniture & Living Studio', description: 'Nordic minimalist beige & warm oak tones for sofas, interior decor & furniture', preview: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80', heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80', badgeText: 'NORDIC HANDCRAFTED', category: 'home', author: 'StoreFront', version: '2.0', free: true, status: 'active',
    colors: { primary: '#292524', secondary: '#fbf9f6', accent: '#78716c', background: '#f5f2eb', surface: '#ffffff', surfaceHover: '#e7e5e4', text: '#1c1917', textSecondary: '#78716c', border: '#e7e5e4', success: '#15803d', warning: '#b45309', error: '#b91c1c' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lora', headingWeight: '700', bodyWeight: '400' },
    radius: { card: '28px', button: '20px', input: '14px', badge: '12px' },
    cardStyle: 'bordered', buttonStyle: 'rounded',
    shadows: { card: '0 6px 20px rgba(41,37,36,0.05)', hover: '0 14px 32px rgba(41,37,36,0.12)', modal: '0 24px 48px rgba(0,0,0,0.15)' },
    animations: { intensity: 'low', parallax: true, tilt: false, stagger: true, reveal: 'fade' },
    hero: { style: 'cinematic', overlay: 'light', height: 'medium' },
    productCard: { style: 'minimal', hoverEffect: 'lift', imageRatio: '4:3' },
    navigation: { style: 'solid', position: 'sticky' },
    footer: { style: 'detailed' },
    supportedBlocks: BASE_BLOCKS,
  },
};

export const themeList = Object.values(themeRegistry);
export default themeRegistry;

