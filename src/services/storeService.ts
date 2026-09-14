// ─── Store Service ──────────────────────────────────────────────────────────
import { where, orderBy } from 'firebase/firestore';
import { getDocument, getCollection, createDocument, updateDocument, removeDocument } from '@/lib/firestore';
import { generateUniqueSlug, claimSlug, releaseSlug } from '@/lib/slugify';
import { logger } from '@/config/firebase';
import type { Store, Business, StoreSection, StoreThemeSettings } from '@/types';

const LOG = '[🏪 StoreService]';

// ─── Default Store Sections ─────────────────────────────────────────────────
const DEFAULT_SECTIONS: StoreSection[] = [
  { id: 'hero', type: 'hero', visible: true, order: 0, config: { style: 'cinematic', height: 'medium' } },
  { id: 'profile', type: 'profile', visible: true, order: 1, config: { showSocial: true } },
  { id: 'announcement', type: 'announcement', visible: false, order: 2, config: { text: '' } },
  { id: 'categories', type: 'categories', visible: true, order: 3, config: { layout: 'scroll' } },
  { id: 'featured', type: 'featured', visible: true, order: 4, config: { limit: 6 } },
  { id: 'productGrid', type: 'productGrid', visible: true, order: 5, config: { columns: 2 } },
  { id: 'offers', type: 'offers', visible: true, order: 6, config: {} },
  { id: 'gallery', type: 'gallery', visible: false, order: 7, config: {} },
  { id: 'reviews', type: 'reviews', visible: false, order: 8, config: {} },
  { id: 'contact', type: 'contact', visible: true, order: 9, config: { showMap: false } },
  { id: 'social', type: 'social', visible: true, order: 10, config: {} },
  { id: 'footer', type: 'footer', visible: true, order: 11, config: {} },
];

const DEFAULT_THEME: StoreThemeSettings = {
  themeId: 'modern',
  customColors: {},
  customTypography: {},
  customRadius: '',
  customAnimationIntensity: 'medium',
};

// ─── Business CRUD ──────────────────────────────────────────────────────────
export async function createBusiness(data: Partial<Business> & { themeId?: string }, ownerId: string): Promise<string> {
  logger.info(`${LOG} Creating business: ${data.name}`);
  const slug = await generateUniqueSlug(data.name || 'store');
  const selectedThemeId = data.themeId || 'macha_boba';
  
  const businessId = await createDocument('businesses', {
    name: data.name,
    type: data.type,
    logo: data.logo,
    cover: data.cover,
    description: data.description,
    ownerName: data.ownerName,
    phone: data.phone,
    location: data.location,
    website: data.website,
    socialLinks: data.socialLinks || {},
    email: data.email,
    ownerId,
    slug,
    status: 'draft',
  });

  // Also create the store with the selected theme
  const storeId = await createDocument('stores', {
    businessId,
    ownerId,
    name: data.name || 'My Store',
    slug,
    status: 'draft',
    theme: {
      themeId: selectedThemeId,
      customColors: {},
      customTypography: {},
      customRadius: '',
      customAnimationIntensity: 'medium',
    },
    sections: DEFAULT_SECTIONS,
    settings: {
      whatsappNumber: data.phone || '',
      whatsappMessage: `Hi, I found your store through your digital storefront.`,
      showCallButton: true,
      showWhatsappButton: true,
      showDirections: true,
      showSocialLinks: true,
      announcement: '',
      announcementActive: false,
    },
    seo: {
      title: `${data.name} | Digital Storefront`,
      description: data.description || '',
      ogImage: data.cover || '',
    },
    currency: 'INR',
    currencySymbol: '₹',
  });

  // Claim the slug
  await claimSlug(slug, storeId);

  // Create business member (owner)
  await createDocument(`businesses/${businessId}/members`, {
    userId: ownerId,
    role: 'OWNER',
    joinedAt: new Date(),
  });

  logger.success(`${LOG} Business created: ${businessId}, Store: ${storeId}, Slug: ${slug}`);
  return businessId;
}

export async function getBusinessesByOwner(ownerId: string): Promise<Business[]> {
  const items = await getCollection<Business>('businesses', [
    where('ownerId', '==', ownerId),
  ]);
  return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getBusiness(id: string): Promise<Business | null> {
  return getDocument<Business>('businesses', id);
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<void> {
  return updateDocument('businesses', id, data as Record<string, unknown>);
}

// ─── Store CRUD ─────────────────────────────────────────────────────────────
export async function getStoresByBusiness(businessId: string): Promise<Store[]> {
  return getCollection<Store>('stores', [
    where('businessId', '==', businessId),
  ]);
}

export async function getStoresByOwner(ownerId: string): Promise<Store[]> {
  logger.info(`${LOG} Fetching stores for ownerId: ${ownerId}`);
  let items = await getCollection<Store>('stores', [
    where('ownerId', '==', ownerId),
  ]);

  if (items.length === 0) {
    logger.info(`${LOG} No direct stores found for owner ${ownerId}. Checking businesses...`);
    const businesses = await getCollection<Business>('businesses', [
      where('ownerId', '==', ownerId),
    ]);
    for (const b of businesses) {
      const bStores = await getStoresByBusiness(b.id);
      items.push(...bStores);
    }
  }

  // Deduplicate by id
  const uniqueStoresMap = new Map<string, Store>();
  items.forEach((s) => uniqueStoresMap.set(s.id, s));
  const uniqueStores = Array.from(uniqueStoresMap.values());

  return uniqueStores.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getStore(id: string): Promise<Store | null> {
  return getDocument<Store>('stores', id);
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const stores = await getCollection<Store>('stores', [
    where('slug', '==', slug),
  ]);
  return stores[0] || null;
}

export async function updateStore(id: string, data: Partial<Store>): Promise<void> {
  return updateDocument('stores', id, data as Record<string, unknown>);
}

export async function publishStore(id: string): Promise<void> {
  logger.info(`${LOG} Publishing store: ${id}`);
  return updateDocument('stores', id, { status: 'published' });
}

export async function unpublishStore(id: string): Promise<void> {
  logger.info(`${LOG} Unpublishing store: ${id}`);
  return updateDocument('stores', id, { status: 'draft' });
}

export async function updateStoreSections(id: string, sections: StoreSection[]): Promise<void> {
  return updateDocument('stores', id, { sections });
}

export async function updateStoreTheme(id: string, theme: StoreThemeSettings): Promise<void> {
  return updateDocument('stores', id, { theme });
}

// ─── Public Store (for storefront) ──────────────────────────────────────────
export async function getPublicStoreData(slug: string) {
  logger.info(`${LOG} Fetching public store: ${slug}`);
  const store = await getStoreBySlug(slug);
  if (!store) {
    logger.warn(`${LOG} Store not found for slug: ${slug}`);
    return null;
  }
  
  const business = await getBusiness(store.businessId);
  
  return { store, business };
}
