import { describe, it, expect } from "vitest";
import sitemap, { buildSitemap, SITE_URL } from "./sitemap";
import {
  listPublicRoutes,
  type ConcreteRoute,
} from "@/lib/seo/routes";

/**
 * Unit tests for the sitemap (Req 14.4): the sitemap must list every public
 * route and exclude non-public routes. Property-based coverage lives in tasks
 * 15.3/15.4; these are concrete example checks.
 */
describe("sitemap (Req 14.4)", () => {
  const route = (path: string, isPublic: boolean): ConcreteRoute => ({
    path,
    isPublic,
    pattern: path,
    metadata: {},
  });

  it("includes every public route path and no non-public path", () => {
    const lastModified = new Date("2024-01-01T00:00:00.000Z");
    const routes: ConcreteRoute[] = [
      route("/", true),
      route("/tools", true),
      route("/dashboard", false), // non-public — must be excluded
      route("/admin/secret", false), // non-public — must be excluded
    ];

    const result = buildSitemap(routes, "https://example.test", lastModified);
    const urls = result.map((entry) => entry.url);

    // Public routes are present as absolute URLs.
    expect(urls).toContain("https://example.test"); // root maps to bare origin
    expect(urls).toContain("https://example.test/tools");

    // Non-public routes are absent.
    expect(urls).not.toContain("https://example.test/dashboard");
    expect(urls).not.toContain("https://example.test/admin/secret");

    // Exactly the two public routes, each carrying the build-time date.
    expect(result).toHaveLength(2);
    expect(result.every((entry) => entry.lastModified === lastModified)).toBe(
      true,
    );
  });

  it("covers exactly the registry's public routes via the default export", () => {
    const publicPaths = listPublicRoutes().map((r) => r.path);
    const entries = sitemap();

    // One entry per public route, no extras.
    expect(entries).toHaveLength(publicPaths.length);

    const expectedUrls = new Set(
      publicPaths.map((p) =>
        p === "/" ? SITE_URL : `${SITE_URL}${p}`,
      ),
    );
    const actualUrls = new Set(entries.map((e) => e.url));
    expect(actualUrls).toEqual(expectedUrls);
  });

  it("does not include any non-public route from the registry", () => {
    // listPublicRoutes is the only source for the default export, so every
    // emitted URL must correspond to a public route path.
    const publicUrlSet = new Set(
      listPublicRoutes().map((r) =>
        r.path === "/" ? SITE_URL : `${SITE_URL}${r.path}`,
      ),
    );
    for (const entry of sitemap()) {
      expect(publicUrlSet.has(entry.url)).toBe(true);
    }
  });
});
