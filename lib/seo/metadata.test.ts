import { describe, it, expect } from "vitest";
import {
  resolveMetadata,
  buildMetadata,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  TITLE_SUFFIX,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
} from "./metadata";
import { listPublicRoutes } from "./routes";

describe("SEO metadata resolution (Req 14.2, 14.5)", () => {
  const publicRoutes = listPublicRoutes();

  it("enumerates a non-trivial set of public routes", () => {
    // 9 static + 12 roadmaps + 57 tools + 20 projects exercised by the data.
    expect(publicRoutes.length).toBeGreaterThan(12);
    expect(publicRoutes.every((r) => r.isPublic)).toBe(true);
  });

  it("resolves every public route to a title within 1..60 chars", () => {
    for (const route of publicRoutes) {
      const { title } = resolveMetadata(route);
      expect(title.length).toBeGreaterThanOrEqual(TITLE_MIN);
      expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    }
  });

  it("resolves every public route to a description within 50..160 chars", () => {
    for (const route of publicRoutes) {
      const { description } = resolveMetadata(route);
      expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it("resolves unique titles across all public routes", () => {
    const titles = publicRoutes.map((r) => resolveMetadata(r).title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  it("applies the brand suffix consistently to every title", () => {
    for (const route of publicRoutes) {
      expect(resolveMetadata(route).title.endsWith(TITLE_SUFFIX)).toBe(true);
    }
  });

  it("applies both defaults when a route defines neither title nor description", () => {
    const resolved = resolveMetadata({ metadata: {} });
    expect(resolved.title).toBe(`${DEFAULT_TITLE}${TITLE_SUFFIX}`);
    expect(resolved.description).toBe(DEFAULT_DESCRIPTION);
  });

  it("applies defaults for a route with entirely absent metadata", () => {
    const resolved = resolveMetadata({});
    expect(resolved.title).toBe(`${DEFAULT_TITLE}${TITLE_SUFFIX}`);
    expect(resolved.description).toBe(DEFAULT_DESCRIPTION);
  });

  it("keeps an authored title/description but still brands the title", () => {
    const resolved = resolveMetadata({
      metadata: {
        title: "Compare Developer Tools",
        description:
          "Compare two to four free developer tools side by side on DevAtlas across free tier, database, auth, and storage.",
      },
    });
    expect(resolved.title).toBe(`Compare Developer Tools${TITLE_SUFFIX}`);
    expect(resolved.description).toContain("Compare two to four free developer tools");
  });

  it("does not double-apply the brand suffix", () => {
    const branded = `Already Branded${TITLE_SUFFIX}`;
    const resolved = resolveMetadata({ metadata: { title: branded } });
    expect(resolved.title).toBe(branded);
  });

  it("the default constants themselves satisfy the length bounds", () => {
    expect(DEFAULT_TITLE.length).toBeGreaterThanOrEqual(TITLE_MIN);
    expect(DEFAULT_TITLE.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(`${DEFAULT_TITLE}${TITLE_SUFFIX}`.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(DEFAULT_DESCRIPTION.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  it("buildMetadata returns a Next.js Metadata object", () => {
    const meta = buildMetadata({ metadata: { title: "Free Developer Tools" } });
    expect(meta).toEqual({
      title: `Free Developer Tools${TITLE_SUFFIX}`,
      description: DEFAULT_DESCRIPTION,
    });
  });
});
