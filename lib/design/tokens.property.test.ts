/**
 * Property-based tests for the DevAtlas design-token color palette
 * (`lib/design/tokens.ts`).
 *
 * Covers one correctness property from design.md:
 *
 * - Property 26: Design-token text/background pairs meet contrast thresholds
 *   (Req 13.4, 13.5)
 *
 * Every named text-on-background token pair, in both the light and dark
 * palettes, must meet WCAG 2.1 contrast: >= 4.5:1 for normal text (Req 13.4)
 * and >= 3:1 for large/bold text (Req 13.5). We assert each pair's contrast
 * ratio is >= 4.5:1, which satisfies BOTH thresholds simultaneously.
 *
 * The contrast ratio is computed here from first principles using the WCAG
 * relative-luminance formula, so the assertion does not depend on the comments
 * baked into the token module. The set of pairs is a fixed finite set; we wrap
 * the check in a fast-check property over `fc.constantFrom(...pairs)` so it runs
 * under the shared property harness and is tagged like the other properties.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  listTextBackgroundPairs,
  type TokenContrastPair,
} from "@/lib/design/tokens";

// ---------------------------------------------------------------------------
// WCAG relative luminance + contrast ratio
// ---------------------------------------------------------------------------

/** WCAG normal-text minimum contrast ratio (Req 13.4). */
const NORMAL_TEXT_MIN_RATIO = 4.5;

/** WCAG large/bold-text minimum contrast ratio (Req 13.5). */
const LARGE_TEXT_MIN_RATIO = 3;

/** Parses a `#rrggbb` (or `#rgb`) hex string into 0..255 RGB channels. */
function parseHex(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Linearizes a single 0..255 sRGB channel per the WCAG definition. */
function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG 2.1 relative luminance of an sRGB hex color. */
function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG 2.1 contrast ratio between a foreground and background hex color. */
function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Property 26: Design-token text/background pairs meet contrast thresholds
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 26: Design-token text/background pairs meet contrast thresholds", () => {
  // **Validates: Requirements 13.4, 13.5**

  const pairs = listTextBackgroundPairs();
  const pairArb: fc.Arbitrary<TokenContrastPair> = fc.constantFrom(...pairs);

  it("Feature: devatlas, Property 26: Design-token text/background pairs meet contrast thresholds — every text/background pair in both palettes is >=4.5:1 (so it also clears the 3:1 large-text bar)", () => {
    // Sanity: the set is non-empty so the property is not vacuous.
    expect(pairs.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(pairArb, (pair) => {
        const ratio = contrastRatio(pair.foreground, pair.background);
        // >= 4.5:1 satisfies both the normal-text (Req 13.4) and the
        // large/bold-text (Req 13.5) thresholds at once.
        expect(
          ratio,
          `${pair.theme}/${String(pair.name)} (${pair.foreground} on ${pair.background}) contrast ratio ${ratio.toFixed(2)}:1 is below ${NORMAL_TEXT_MIN_RATIO}:1`,
        ).toBeGreaterThanOrEqual(NORMAL_TEXT_MIN_RATIO);
        expect(ratio).toBeGreaterThanOrEqual(LARGE_TEXT_MIN_RATIO);
      }),
    );
  });
});
