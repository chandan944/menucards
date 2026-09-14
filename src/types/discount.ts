// ─── Discount Types ─────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'flat' | 'bogo' | 'coupon' | 'freebie';

export interface Discount {
  id: string;
  storeId: string;
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  code: string;
  productIds: string[];
  categoryIds: string[];
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  active: boolean;
  usageLimit: number;
  usageCount: number;
  minOrderValue: number;
  maxDiscount: number;
  conditions: Record<string, unknown>;
  image: string;
  badge: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountFormData {
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  code: string;
  productIds: string[];
  categoryIds: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  active: boolean;
  usageLimit: number;
  minOrderValue: number;
  maxDiscount: number;
  image: string;
  badge: string;
}
