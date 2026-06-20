/**
 * DevAtlas design tokens.
 *
 * This module is the single source of truth for the DevAtlas color system,
 * mirroring the semantic color variables defined in `app/globals.css` as plain
 * hex values so they can be unit-tested for WCAG contrast (task 14.2,
 * Property 26) without parsing CSS.
 *
 * The palette is intentionally chosen so that EVERY text-on-background token
 * pair meets WCAG 2.1 contrast:
 *   - >= 4.5:1 for normal text (Req 13.4)
 *   - >= 3:1 for large/bold text (Req 13.5)
 *
 * A typography scale and spacing scale are also exported here and mirrored in
 * `app/globals.css` so the app applies a single, uniform scale everywhere
 * (Req 12.1).
 *
 * This module contains data + a pure helper only — no React, no side effects.
 */

/** A foreground (text) color placed on a background color. Both are hex. */
export interface ColorPair {
  /** Hex color of the text/foreground (e.g. "#0f172a"). */
  foreground: string;
  /** Hex color of the surface the text sits on (e.g. "#ffffff"). */
  background: string;
}

/** The set of named text-on-background pairs that must meet contrast. */
export interface ThemePairs {
  /** Body text on the page background. */
  foregroundOnBackground: ColorPair;
  /** Text inside a card surface. */
  cardForegroundOnCard: ColorPair;
  /** Text inside a popover/menu surface. */
  popoverForegroundOnPopover: ColorPair;
  /** Label text on a primary (call-to-action) surface. */
  primaryForegroundOnPrimary: ColorPair;
  /** Label text on a secondary surface. */
  secondaryForegroundOnSecondary: ColorPair;
  /** Muted/secondary text on the page background. */
  mutedForegroundOnBackground: ColorPair;
  /** Muted/secondary text on a muted surface. */
  mutedForegroundOnMuted: ColorPair;
  /** Text on an accent surface. */
  accentForegroundOnAccent: ColorPair;
  /** Label text on a destructive surface. */
  destructiveForegroundOnDestructive: ColorPair;
}

export type ThemeName = "light" | "dark";

/**
 * The complete light + dark palette as text-on-background pairs.
 *
 * Light theme is the default (Req 12.1); the dark theme is applied under the
 * `.dark` class (Req 12.2). The same hex values are declared in
 * `app/globals.css`.
 */
export const designTokens: Record<ThemeName, ThemePairs> = {
  light: {
    // ~17.8:1
    foregroundOnBackground: { foreground: "#0f172a", background: "#ffffff" },
    // ~17.8:1
    cardForegroundOnCard: { foreground: "#0f172a", background: "#ffffff" },
    // ~17.8:1
    popoverForegroundOnPopover: { foreground: "#0f172a", background: "#ffffff" },
    // ~6.3:1 (white on indigo-600)
    primaryForegroundOnPrimary: { foreground: "#ffffff", background: "#4f46e5" },
    // ~16.3:1 (slate-900 on slate-100)
    secondaryForegroundOnSecondary: { foreground: "#0f172a", background: "#f1f5f9" },
    // ~7.6:1 (slate-600 on white)
    mutedForegroundOnBackground: { foreground: "#475569", background: "#ffffff" },
    // ~6.9:1 (slate-600 on slate-100)
    mutedForegroundOnMuted: { foreground: "#475569", background: "#f1f5f9" },
    // ~10.2:1 (indigo-900 on indigo-50)
    accentForegroundOnAccent: { foreground: "#312e81", background: "#eef2ff" },
    // ~4.8:1 (white on red-600)
    destructiveForegroundOnDestructive: { foreground: "#ffffff", background: "#dc2626" },
  },
  dark: {
    // ~18.0:1 (slate-50 on near-black)
    foregroundOnBackground: { foreground: "#f8fafc", background: "#0b1120" },
    // ~16.9:1
    cardForegroundOnCard: { foreground: "#f8fafc", background: "#111827" },
    // ~16.9:1
    popoverForegroundOnPopover: { foreground: "#f8fafc", background: "#111827" },
    // ~8.0:1 (indigo-950 on indigo-300)
    primaryForegroundOnPrimary: { foreground: "#1e1b4b", background: "#a5b4fc" },
    // ~14.0:1 (slate-50 on slate-800)
    secondaryForegroundOnSecondary: { foreground: "#f8fafc", background: "#1e293b" },
    // ~7.3:1 (slate-400 on near-black)
    mutedForegroundOnBackground: { foreground: "#94a3b8", background: "#0b1120" },
    // ~5.7:1 (slate-400 on slate-800)
    mutedForegroundOnMuted: { foreground: "#94a3b8", background: "#1e293b" },
    // ~9.3:1 (indigo-100 on indigo-900)
    accentForegroundOnAccent: { foreground: "#e0e7ff", background: "#312e81" },
    // ~4.8:1 (white on red-600)
    destructiveForegroundOnDestructive: { foreground: "#ffffff", background: "#dc2626" },
  },
};

/** A single text/background pair flattened with its theme and name. */
export interface TokenContrastPair extends ColorPair {
  theme: ThemeName;
  /** The name of the pair within its theme (key of {@link ThemePairs}). */
  name: keyof ThemePairs;
}

/**
 * Lists every text-on-background token pair across both palettes that must
 * meet the WCAG contrast thresholds. The contrast property test (task 14.2)
 * iterates this list.
 */
export function listTextBackgroundPairs(): TokenContrastPair[] {
  const themes: ThemeName[] = ["light", "dark"];
  const pairs: TokenContrastPair[] = [];
  for (const theme of themes) {
    const themePairs = designTokens[theme];
    for (const name of Object.keys(themePairs) as (keyof ThemePairs)[]) {
      const pair = themePairs[name];
      pairs.push({ theme, name, ...pair });
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Typography scale (Req 12.1)
// ---------------------------------------------------------------------------

/** A single step on the type scale: font size + matching line height (rem). */
export interface TypeStep {
  /** Font size, e.g. "1rem". */
  size: string;
  /** Line height, e.g. "1.5rem". */
  lineHeight: string;
}

/**
 * The single typography scale applied uniformly across DevAtlas. Mirrors the
 * `--text-*` tokens in `app/globals.css`.
 */
export const typographyScale: Record<string, TypeStep> = {
  xs: { size: "0.75rem", lineHeight: "1rem" },
  sm: { size: "0.875rem", lineHeight: "1.25rem" },
  base: { size: "1rem", lineHeight: "1.5rem" },
  lg: { size: "1.125rem", lineHeight: "1.75rem" },
  xl: { size: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { size: "1.5rem", lineHeight: "2rem" },
  "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
  "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
  "5xl": { size: "3rem", lineHeight: "1.1" },
  "6xl": { size: "3.75rem", lineHeight: "1.05" },
};

/** Font family stacks applied across the app. */
export const fontFamilies = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
  heading: "var(--font-heading)",
} as const;

// ---------------------------------------------------------------------------
// Spacing scale (Req 12.1)
// ---------------------------------------------------------------------------

/**
 * The single spacing scale (rem) applied uniformly across DevAtlas. The values
 * follow a 4px (0.25rem) base step and mirror the spacing usage in the app.
 */
export const spacingScale: Record<string, string> = {
  "0": "0rem",
  px: "0.0625rem",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "32": "8rem",
};
