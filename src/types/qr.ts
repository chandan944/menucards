// ─── QR Types ───────────────────────────────────────────────────────────────

export type QRPattern = 'squares' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type QREyeStyle = 'square' | 'dot' | 'rounded' | 'classy' | 'classy-rounded';
export type QRGradientType = 'linear' | 'radial' | 'none';
export type QRFrameStyle = 'none' | 'simple' | 'rounded' | 'badge' | 'banner';
export type QRExportFormat = 'png' | 'jpeg' | 'svg';

export interface QRDesign {
  id: string;
  storeId: string;
  storeUrl: string;
  // Dots
  pattern: QRPattern;
  dotColor: string;
  // Background
  backgroundColor: string;
  // Gradient
  gradientType: QRGradientType;
  gradientColor1: string;
  gradientColor2: string;
  gradientRotation: number;
  // Eyes
  eyeStyle: QREyeStyle;
  eyeColor: string;
  eyeInnerColor: string;
  // Logo
  logoUrl: string;
  logoSize: number;
  logoPadding: number;
  logoBackgroundColor: string;
  logoShape: 'square' | 'circle';
  // Frame
  frameStyle: QRFrameStyle;
  frameColor: string;
  frameText: string;
  frameTextColor: string;
  // Settings
  size: number;
  margin: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  createdAt: Date;
  updatedAt: Date;
}

export interface QRPreset {
  id: string;
  name: string;
  preview: string;
  design: Partial<QRDesign>;
}

export interface QRCardDesign {
  id: string;
  storeId: string;
  orientation: 'portrait' | 'square' | 'landscape';
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage: string;
  elements: QRCardElement[];
  createdAt: Date;
}

export interface QRCardElement {
  id: string;
  type: 'logo' | 'text' | 'qr' | 'image' | 'shape' | 'icon' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  zIndex: number;
  config: Record<string, unknown>;
}
