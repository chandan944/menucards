// ─── Category Types ─────────────────────────────────────────────────────────

export interface Category {
  id: string;
  storeId: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  order: number;
  visibility: boolean;
  featured: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  icon: string;
  visibility: boolean;
  featured: boolean;
}
