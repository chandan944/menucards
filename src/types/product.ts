// ─── Product Types ──────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  sku?: string;
  available: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  price: number;
  salePrice?: number;
  sku: string;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  veg: boolean;
  spicy: boolean;
  premium: boolean;
  availability: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  customAttributes: Record<string, string>;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  sku: string;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  veg: boolean;
  spicy: boolean;
  premium: boolean;
  availability: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  customAttributes: Record<string, string>;
}
