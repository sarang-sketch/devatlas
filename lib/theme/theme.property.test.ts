/**
 * Property-based tests for the DevAtlas theme resolution logic
 * (`lib/theme/theme.ts`).
 *
 * Covers one correctness property from design.md:
 *
 * - Property 25: Theme persistence round trip and default resolution
 *   (Req 12.1, 12.3, 12.6)
 *
 * The store-then-resolve round trip is modelled directly: `resolveTheme` is the
 * pure resolution rule applied to a (possibly absent or corrupt) stored value,
 * so persisting a theme `t` and resolving it must return `t`. Resolution of an
 * absent value (`null`) must yield the light default. For arbitrary strings,
 * resolution returns the stored value iff it is exactly a valid theme and the
 * light default otherwise.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import { isTheme, resolveTheme, type Theme } from "@/lib/theme/theme";

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** The two supported themes (Req 12.1, 12.6). */
const VALID_THEMES: readonly Theme[] = ["light", "dark"] as const;

/** Generates one of the two valid themes. */
const themeArb: fc.Arbitrary<Theme> = fc.constantFrom(...VALID_THEMES);

/**
 * Generates arbitrary strings, biased to include the valid theme strings often
 * (so the "valid stored theme" branch is exercised), plus look-alikes such as
 * different casing and surrounding whitespace which must NOT be treated as
 * valid.
 */
const arbitraryStoredArb: fc.Arbitrary<string> = fc.oneof(
  fc.string(),
  fc.constantFrom("light", "dark", "Light", "DARK", " light", "dark ", "", "system"),
);

// ---------------------------------------------------------------------------
// Property 25: Theme persistence round trip and default resolution
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 25: Theme persistence round trip and default resolution", () => {
  // **Validates: Requirements 12.1, 12.3, 12.6**

  it("Feature: devatlas, Property 25: Theme persistence round trip and default resolution — storing a valid theme then resolving returns the same theme", () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        // A persist/restore round trip stores the theme string verbatim, so
        // resolving the stored value must return exactly that theme (Req 12.6).
        const stored: string = theme;
        expect(resolveTheme(stored)).toBe(theme);
      }),
    );
  });

  it("Feature: devatlas, Property 25: Theme persistence round trip and default resolution — resolves to light when nothing is stored", () => {
    // Nothing stored (null) → light default (Req 12.1, 12.3).
    expect(resolveTheme(null)).toBe("light");
  });

  it("Feature: devatlas, Property 25: Theme persistence round trip and default resolution — arbitrary strings resolve to the stored theme iff exactly valid, else light", () => {
    fc.assert(
      fc.property(arbitraryStoredArb, (stored) => {
        const resolved = resolveTheme(stored);
        if (isTheme(stored)) {
          // Exactly a valid theme string → that theme.
          expect(resolved).toBe(stored);
          expect(VALID_THEMES).toContain(resolved);
        } else {
          // Anything that is not exactly a valid theme → light default.
          expect(resolved).toBe("light");
        }
        // Resolution is total: it always yields one of the valid themes.
        expect(VALID_THEMES).toContain(resolved);
      }),
    );
  });
});
