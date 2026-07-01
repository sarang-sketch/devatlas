/**
 * DevAtlas sitemap (Req 14.4).
 *
 * Next.js App Router picks up a default export from `app/sitemap.ts` and emits
 * `/sitemap.xml` at build time. The sitemap is generated directly from the
 * public-route registry (`lib/seo/routes.ts`) so that it lists *every* public
 * route and *excludes* every non-public route by construction: `listPublicRoutes`
 * already filters to `isPublic === true`, and the route definitions are the
 * single source of truth for both the app routes and the sitemap.
 *
 * The build is kept deterministic and pure: `buildSitemap` is a side-effect-free
 * helper that maps the registry's public routes to absolute URLs given a base
 * URL and a "last modified" timestamp. The default export simply calls it with
 * the configured site URL and a single build-time date so that every entry
 * shares one stable `lastModified` value per build.
 */

import type { MetadataRoute } from "next";
import { listPublicRoutes, type ConcreteRoute } from "@/lib/seo/routes";

// Required for `output: "export"` static builds.
export const dynamic = "force-static";

/**
 * The canonical site origin used to build absolute sitemap URLs. Configurable
 * via `NEXT_PUBLIC_SITE_URL` so deployments can point at their real domain;
 * falls back to a stable placeholder origin for local builds and tests.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-atlas.app";

/** Joins the site origin with a route path, avoiding duplicate slashes. */
function toAbsoluteUrl(baseUrl: string, path: string): string {
  const origin = baseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  // The site root ("/") should map to the bare origin, not "origin/".
  return suffix === "/" ? origin : `${origin}${suffix}`;
}

/**
 * Assigns a crawl priority and change frequency based on route depth. The
 * homepage is the most important (1.0), top-level hubs rank high (0.8), and
 * deeper detail pages slightly lower (0.6). These are advisory signals that
 * help crawlers budget their attention across the site.
 */
function crawlHints(path: string): {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
} {
  if (path === "/") {
    return { priority: 1.0, changeFrequency: "daily" };
  }
  const depth = path.split("/").filter(Boolean).length;
  if (depth <= 1) {
    return { priority: 0.8, changeFrequency: "weekly" };
  }
  return { priority: 0.6, changeFrequency: "monthly" };
}

/**
 * Pure, testable sitemap builder. Maps a list of concrete routes to sitemap
 * entries, including only public routes (Req 14.4). Each entry is an absolute
 * URL under `baseUrl` with the supplied `lastModified` timestamp plus advisory
 * `priority`/`changeFrequency` crawl hints derived from the route depth.
 *
 * @param routes        The concrete routes to consider (public and non-public).
 * @param baseUrl       The site origin used to build absolute URLs.
 * @param lastModified  The build-time date applied to every entry.
 */
export function buildSitemap(
  routes: ConcreteRoute[],
  baseUrl: string,
  lastModified: Date,
): MetadataRoute.Sitemap {
  return routes
    .filter((route) => route.isPublic)
    .map((route) => {
      const { priority, changeFrequency } = crawlHints(route.path);
      return {
        url: toAbsoluteUrl(baseUrl, route.path),
        lastModified,
        changeFrequency,
        priority,
      };
    });
}

/**
 * Next.js sitemap entry point. Generates the sitemap from the public-route
 * registry at build time. `listPublicRoutes` guarantees non-public routes are
 * excluded; `buildSitemap` re-applies the public filter defensively so the
 * helper is correct in isolation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return buildSitemap(listPublicRoutes(), SITE_URL, lastModified);
}
