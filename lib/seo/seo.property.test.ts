/**
 * Property-based tests for the DevAtlas SEO metadata + sitemap logic
 * (`lib/seo/metadata.ts`, `lib/seo/routes.ts`, `app/sitemap.ts`).
 *
 * Covers two correctness properties from design.md:
 *
 * - Property 27: Every route exposes valid, unique SEO metadata
 *   (Req 14.2, 14.5) — titles are 1..60 chars, descriptions are 50..160 chars
 *   (defaults applied when a route authors neither), and titles are unique
 *   across the public routes.
 * - Property 28: Sitemap lists exactly the public routes (Req 14.4) — the
 *   sitemap contains every public route and no non-public route.
 *
 * Property 27 is anchored on the real public-route registry (the actual Req
 * 14.2 data) and additionally exercises the default-application rule over
 * generated routes that author no metadata. Property 28 generates route lists
 * with mixed `isPublic` flags and asserts `buildSitemap` selects exactly the
 * public ones, and also checks the registry-backed sitemap.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
  listPublicRouteMetadata,
  resolveMetadata,
  type MetadataInput,
} from "@/lib/seo/metadata";
import { listPublicRoutes, type ConcreteRoute } from "@/lib/seo/routes";
import { buildSitemap } from "@/app/sitemap";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Mirrors the (internal) absolute-URL construction in `app/sitemap.ts` so the
 * sitemap test can predict the exact `url` each public route should produce.
 */
function toAbsoluteUrl(baseUrl: string, path: string): string {
  const origin = baseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return suffix === "/" ? origin : `${origin}${suffix}`;
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Generates a route that authors NO metadata (so defaults must apply). */
const noMetadataRouteArb: fc.Arbitrary<MetadataInput> = fc.oneof(
  fc.constant<MetadataInput>({}),
  fc.constant<MetadataInput>({ metadata: undefined }),
  fc.constant<MetadataInput>({ metadata: {} }),
);

/** Generates an arbitrary concrete route with an explicit public flag. */
function concreteRouteArb(isPublic: boolean): fc.Arbitrary<ConcreteRoute> {
  return fc
    .webSegment()
    .map((seg) => `/${seg}`)
    .map((path) => ({
      path,
      isPublic,
      pattern: path,
      metadata: {},
    }));
}

/** Generates a mixed list of public and non-public concrete routes. */
const mixedRoutesArb: fc.Arbitrary<ConcreteRoute[]> = fc.array(
  fc.boolean().chain((isPublic) => concreteRouteArb(isPublic)),
  { maxLength: 20 },
);

// ---------------------------------------------------------------------------
// Property 27: Every route exposes valid, unique SEO metadata
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 27: Every route exposes valid, unique SEO metadata", () => {
  // **Validates: Requirements 14.2, 14.5**

  it("Feature: devatlas, Property 27: Every route exposes valid, unique SEO metadata — every public route has a 1..60 title, a 50..160 description, and titles are unique", () => {
    const routes = listPublicRouteMetadata();
    expect(routes.length).toBeGreaterThan(0);

    // Exercise the fixed public-route set under the property harness.
    const routeArb = fc.constantFrom(...routes);
    fc.assert(
      fc.property(routeArb, (route) => {
        const { title, description } = route.resolved;
        expect(
          title.length,
          `title "${title}" for ${route.path} out of [${TITLE_MIN}, ${TITLE_MAX}]`,
        ).toBeGreaterThanOrEqual(TITLE_MIN);
        expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
        expect(
          description.length,
          `description for ${route.path} (len ${description.length}) out of [${DESCRIPTION_MIN}, ${DESCRIPTION_MAX}]`,
        ).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      }),
    );

    // Titles are unique across all public routes (Req 14.2).
    const titles = routes.map((r) => r.resolved.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("Feature: devatlas, Property 27: Every route exposes valid, unique SEO metadata — routes that author no metadata get defaults within the title/description bounds", () => {
    fc.assert(
      fc.property(noMetadataRouteArb, (route) => {
        const { title, description } = resolveMetadata(route);
        // Defaults applied (Req 14.5) must themselves be valid (Req 14.2).
        expect(title.length).toBeGreaterThanOrEqual(TITLE_MIN);
        expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
        expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 28: Sitemap lists exactly the public routes
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 28: Sitemap lists exactly the public routes", () => {
  // **Validates: Requirements 14.4**

  it("Feature: devatlas, Property 28: Sitemap lists exactly the public routes — buildSitemap includes every public route and excludes every non-public route", () => {
    const baseUrl = "https://devatlas.example";
    const lastModified = new Date("2024-01-01T00:00:00.000Z");

    fc.assert(
      fc.property(mixedRoutesArb, (routes) => {
        const sitemap = buildSitemap(routes, baseUrl, lastModified);

        const expectedUrls = routes
          .filter((r) => r.isPublic)
          .map((r) => toAbsoluteUrl(baseUrl, r.path));
        const actualUrls = sitemap.map((entry) => entry.url);

        // Exactly the public routes: same entries, in order, and no others.
        expect(actualUrls).toEqual(expectedUrls);

        // No non-public route leaks into the sitemap.
        const nonPublicUrls = new Set(
          routes
            .filter((r) => !r.isPublic)
            .map((r) => toAbsoluteUrl(baseUrl, r.path)),
        );
        for (const url of actualUrls) {
          // A public route may coincidentally share a URL with a non-public
          // one only if some public route also produced it; guard against a
          // non-public-only URL appearing.
          const fromPublic = expectedUrls.includes(url);
          expect(fromPublic).toBe(true);
          void nonPublicUrls;
        }

        // Every entry carries the supplied lastModified timestamp.
        for (const entry of sitemap) {
          expect(entry.lastModified).toBe(lastModified);
        }
      }),
    );
  });

  it("Feature: devatlas, Property 28: Sitemap lists exactly the public routes — the registry-backed sitemap maps exactly the public routes", () => {
    const baseUrl = "https://devatlas.example";
    const publicRoutes = listPublicRoutes();
    const sitemap = buildSitemap(publicRoutes, baseUrl, new Date());

    expect(sitemap.length).toBe(publicRoutes.length);
    const expectedUrls = publicRoutes.map((r) => toAbsoluteUrl(baseUrl, r.path));
    expect(sitemap.map((e) => e.url)).toEqual(expectedUrls);
  });
});
