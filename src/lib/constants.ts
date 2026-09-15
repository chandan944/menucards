// ─── Application Constants ──────────────────────────────────────────────────

export const APP_NAME = 'StoreFront';
export const APP_TAGLINE = 'Create your digital storefront in minutes';
export const APP_URL = window.location.origin;

export const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
  { value: 'cafe', label: 'Cafe', icon: 'Coffee' },
  { value: 'bakery', label: 'Bakery', icon: 'Cake' },
  { value: 'salon', label: 'Salon', icon: 'Scissors' },
  { value: 'retail', label: 'Retail', icon: 'ShoppingBag' },
  { value: 'fashion', label: 'Fashion', icon: 'Shirt' },
  { value: 'electronics', label: 'Electronics', icon: 'Smartphone' },
  { value: 'jewellery', label: 'Jewellery', icon: 'Gem' },
  { value: 'gym', label: 'Gym', icon: 'Dumbbell' },
  { value: 'hotel', label: 'Hotel', icon: 'Hotel' },
  { value: 'service', label: 'Service', icon: 'Wrench' },
  { value: 'other', label: 'Other', icon: 'Store' },
] as const;

export const CURRENCIES = [
  { value: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { value: 'USD', symbol: '$', label: 'US Dollar' },
  { value: 'EUR', symbol: '€', label: 'Euro' },
  { value: 'GBP', symbol: '£', label: 'British Pound' },
  { value: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { value: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
] as const;

export const DEFAULT_CURRENCY = 'INR';
export const DEFAULT_CURRENCY_SYMBOL = '₹';

export const QR_FRAME_TEXTS = [
  'SCAN ME',
  'VIEW MENU',
  'OPEN STORE',
  'SCAN TO ORDER',
  'EXPLORE OUR MENU',
  'VISIT US ONLINE',
  'SCAN FOR DEALS',
] as const;

export const STICKER_CATEGORIES = [
  'food', 'offers', 'cafe', 'restaurant', 'sale',
  'festival', 'luxury', 'fashion', 'salon', 'fitness',
  'business', 'seasonal',
] as const;

export const STICKER_BADGES = [
  { text: 'BESTSELLER', color: '#FF6B35', bg: '#FFF3ED' },
  { text: 'NEW', color: '#10B981', bg: '#ECFDF5' },
  { text: '20% OFF', color: '#EF4444', bg: '#FEF2F2' },
  { text: 'HOT DEAL', color: '#F59E0B', bg: '#FFFBEB' },
  { text: 'LIMITED', color: '#8B5CF6', bg: '#F5F3FF' },
  { text: 'POPULAR', color: '#3B82F6', bg: '#EFF6FF' },
  { text: 'OPEN', color: '#10B981', bg: '#ECFDF5' },
  { text: 'SALE', color: '#EF4444', bg: '#FEF2F2' },
  { text: 'PREMIUM', color: '#D4AF37', bg: '#FFFDF0' },
  { text: 'VEG', color: '#22C55E', bg: '#F0FDF4' },
  { text: 'SPICY', color: '#EF4444', bg: '#FEF2F2' },
] as const;

export const PRODUCT_BADGES = {
  featured: { text: 'Featured', color: '#F59E0B' },
  bestseller: { text: 'Bestseller', color: '#EF4444' },
  isNew: { text: 'New', color: '#10B981' },
  veg: { text: 'Veg', color: '#22C55E' },
  spicy: { text: 'Spicy', color: '#EF4444' },
  premium: { text: 'Premium', color: '#D4AF37' },
} as const;

export const SECTION_TYPES = [
  { type: 'hero', label: 'Hero Banner', icon: 'Image' },
  { type: 'profile', label: 'Business Profile', icon: 'User' },
  { type: 'announcement', label: 'Announcement', icon: 'Megaphone' },
  { type: 'categories', label: 'Categories', icon: 'Grid3X3' },
  { type: 'featured', label: 'Featured Products', icon: 'Star' },
  { type: 'productGrid', label: 'All Products', icon: 'LayoutGrid' },
  { type: 'offers', label: 'Offers & Deals', icon: 'Tag' },
  { type: 'gallery', label: 'Gallery', icon: 'Images' },
  { type: 'reviews', label: 'Reviews', icon: 'MessageSquare' },
  { type: 'contact', label: 'Contact', icon: 'Phone' },
  { type: 'social', label: 'Social Links', icon: 'Share2' },
  { type: 'faq', label: 'FAQ', icon: 'HelpCircle' },
  { type: 'text', label: 'Custom Text', icon: 'Type' },
  { type: 'footer', label: 'Footer', icon: 'Minus' },
] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const THUMBNAIL_SIZE = 400;
