// ─── Theme Types ────────────────────────────────────────────────────────────
import { ThemeColors, ThemeTypography } from './store';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  author: string;
  version: string;
  free: boolean;
  status: 'active' | 'inactive' | 'beta';
  colors: ThemeColors;
  typography: ThemeTypography;
  radius: {
    card: string;
    button: string;
    input: string;
    badge: string;
  };
  cardStyle: 'flat' | 'elevated' | 'glass' | 'bordered' | 'gradient';
  buttonStyle: 'rounded' | 'pill' | 'square' | 'ghost';
  shadows: {
    card: string;
    hover: string;
    modal: string;
  };
  animations: {
    intensity: 'none' | 'low' | 'medium' | 'high';
    parallax: boolean;
    tilt: boolean;
    stagger: boolean;
    reveal: 'fade' | 'slide' | 'scale' | 'blur';
  };
  hero: {
    style: 'minimal' | 'cinematic' | 'gradient' | 'image' | 'split';
    overlay: 'none' | 'gradient' | 'blur' | 'dark' | 'light';
    height: 'compact' | 'medium' | 'full';
  };
  productCard: {
    style: 'minimal' | 'standard' | 'luxury' | 'glass' | 'bordered';
    hoverEffect: 'lift' | 'lift-glow' | 'scale' | 'tilt' | 'border';
    imageRatio: 'square' | 'portrait' | 'landscape' | '4:3';
  };
  navigation: {
    style: 'transparent' | 'solid' | 'blur' | 'minimal';
    position: 'top' | 'sticky';
  };
  footer: {
    style: 'minimal' | 'standard' | 'detailed';
  };
  supportedBlocks: string[];
}

export type ThemePresetId =
  | 'minimal'
  | 'modern'
  | 'luxury'
  | 'glass'
  | 'dark'
  | 'neon'
  | 'elegant'
  | 'nature'
  | 'cafe'
  | 'street'
  | 'macha_boba'
  | 'pastry_sweets'
  | 'asian_poke'
  | 'indian_biryani'
  | 'organic_catering'
  | 'gourmet_bistro'
  | 'tokyo_sushi'
  | 'tropical_juicery'
  | 'italian_trattoria'
  | 'smash_burger'
  | 'french_bakery'
  | 'taco_fiesta'
  | 'craft_brewery'
  | 'mediterranean_grill'
  | 'modern_bento';

