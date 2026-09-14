// ─── Theme Engine ───────────────────────────────────────────────────────────
// Maps theme config tokens → CSS custom properties on the storefront container
import type { ThemeConfig } from '@/types/theme';
import type { StoreThemeSettings } from '@/types/store';
import { themeRegistry } from './themeRegistry';

/**
 * Resolves a store's theme settings into a full ThemeConfig by merging
 * the base preset with custom overrides.
 */
export function resolveTheme(settings: StoreThemeSettings): ThemeConfig {
  const base = themeRegistry[settings.themeId] || themeRegistry['modern'];
  
  return {
    ...base,
    colors: { ...base.colors, ...settings.customColors },
    typography: { ...base.typography, ...settings.customTypography },
    radius: settings.customRadius
      ? { ...base.radius, card: settings.customRadius, button: settings.customRadius }
      : base.radius,
    animations: {
      ...base.animations,
      intensity: settings.customAnimationIntensity || base.animations.intensity,
    },
  };
}

/**
 * Converts a ThemeConfig into a CSS variable map for injection
 */
export function themeToCSSVars(theme: ThemeConfig): Record<string, string> {
  return {
    '--sf-primary': theme.colors.primary,
    '--sf-secondary': theme.colors.secondary,
    '--sf-accent': theme.colors.accent,
    '--sf-background': theme.colors.background,
    '--sf-surface': theme.colors.surface,
    '--sf-surface-hover': theme.colors.surfaceHover,
    '--sf-text': theme.colors.text,
    '--sf-text-secondary': theme.colors.textSecondary,
    '--sf-border': theme.colors.border,
    '--sf-heading-font': theme.typography.headingFont,
    '--sf-body-font': theme.typography.bodyFont,
    '--sf-radius': theme.radius.card,
    '--sf-radius-button': theme.radius.button,
    '--sf-shadow-card': theme.shadows.card,
    '--sf-shadow-hover': theme.shadows.hover,
  };
}

/**
 * Injects theme CSS vars onto an element
 */
export function applyThemeToElement(element: HTMLElement, theme: ThemeConfig): void {
  const vars = themeToCSSVars(theme);
  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Get Google Fonts URL for a theme
 */
export function getThemeFontsUrl(theme: ThemeConfig): string {
  const fonts = new Set([theme.typography.headingFont, theme.typography.bodyFont]);
  const families = Array.from(fonts)
    .filter((f) => !['system-ui', 'sans-serif', 'serif', 'monospace'].includes(f))
    .map((f) => `family=${f.replace(/\s/g, '+')}:wght@300;400;500;600;700;800`)
    .join('&');
  return families ? `https://fonts.googleapis.com/css2?${families}&display=swap` : '';
}
