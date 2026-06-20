/**
 * DevAtlas robots.txt.
 *
 * Next.js App Router emits `/robots.txt` from a default export here at build
 * time. The whole site is public static content, so we allow all crawlers and
 * point them at the sitemap (kept consistent with `app/sitemap.ts` via the
 * shared `SITE_URL`).
 */

import type { MetadataRoute } from "next";
import { SITE_URL } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
