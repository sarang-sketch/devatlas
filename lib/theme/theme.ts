/**
 * DevAtlas theme domain logic (design "Context Providers", Req 12).
 *
 * Pure, framework-free helpers for the theme system so the resolution rule can
 * be reasoned about and property-tested in isolation from React and the DOM.
 */

/** The two supported themes. The light theme is the default (Req 12.1). */
export type Theme = "light" | "dark";

/** The set of valid themes, used for validating stored values. */
const THEMES: readonly Theme[] = ["light", "dark"] as const;

/** Type guard: is the given string one of the supported themes? */
export function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

/**
 * Resolve the active theme from a (possibly absent or corrupt) stored value.
 *
 *   - Nothing stored (`null`) → `"light"` (Req 12.1: light default).
 *   - A value that is not a valid theme → `"light"` (defensive: corrupt store).
 *   - A valid stored theme → that theme (Req 12.6: apply the stored theme).
 *
 * Pure and total: every input maps to exactly one theme and it never throws.
 */
export function resolveTheme(stored: string | null): Theme {
  return isTheme(stored) ? stored : "light";
}
