// ─── User Types ─────────────────────────────────────────────────────────────

export type UserRole = 'OWNER' | 'MANAGER' | 'EDITOR' | 'STAFF' | 'VIEWER';

export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  plan: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessMember {
  userId: string;
  role: UserRole;
  email: string;
  displayName: string;
  invitedAt: Date;
  joinedAt: Date | null;
}
