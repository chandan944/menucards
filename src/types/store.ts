// ─── Store & Business Types ─────────────────────────────────────────────────

export type BusinessType =
  | 'restaurant'
  | 'cafe'
  | 'bakery'
  | 'salon'
  | 'retail'
  | 'fashion'
  | 'electronics'
  | 'jewellery'
  | 'gym'
  | 'hotel'
  | 'service'
  | 'other';

export type StoreStatus = 'draft' | 'published' | 'archived';

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  website?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  slug: string;
  logo: string;
  cover: string;
  description: string;
  ownerName: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
  status: StoreStatus;
}

export interface Store {
  id: string;
  businessId: string;
  ownerId: string;
  name: string;
  slug: string;
  status: StoreStatus;
  theme: StoreThemeSettings;
  sections: StoreSection[];
  settings: StoreSettings;
  seo: StoreSEO;
  currency: string;
  currencySymbol: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  showCallButton: boolean;
  showWhatsappButton: boolean;
  showDirections: boolean;
  showSocialLinks: boolean;
  announcement: string;
  announcementActive: boolean;
}

export interface StoreSEO {
  title: string;
  description: string;
  ogImage: string;
}

export interface StoreThemeSettings {
  themeId: string;
  customColors: Partial<ThemeColors>;
  customTypography: Partial<ThemeTypography>;
  customRadius: string;
  customAnimationIntensity: 'none' | 'low' | 'medium' | 'high';
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
}

export type SectionType =
  | 'hero'
  | 'profile'
  | 'announcement'
  | 'categories'
  | 'featured'
  | 'productGrid'
  | 'offers'
  | 'gallery'
  | 'reviews'
  | 'contact'
  | 'social'
  | 'faq'
  | 'text'
  | 'footer';

export interface StoreSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  config: Record<string, unknown>;
}
