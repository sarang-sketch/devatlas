/**
 * DevAtlas SEO metadata resolution (Req 14.2, 14.5).
 *
 * Centralizes the rules for turning a route's authored metadata into a final,
 * valid SEO title/description:
 *
 *  - A title is 1..60 characters; a description is 50..160 characters.
 *  - When a route defines neither a title nor a description, the defaults are
 *    applied (Req 14.5). For robustness, a default is also applied to whichever
 *    of the two is individually missing.
 *  - The brand suffix is appended to every title consistently so that distinct
 *    base titles remain distinct (and thus unique across public routes, Req
 *    14.2) while sharing the DevAtlas brand.
 */

import type { Metadata } from "next";
import {
  listPublicRoutes,
  type ConcreteRoute,
  type RouteMetadata,
} from "./routes";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** The brand name appended to every page title. */
export const BRAND = "DevAtlas";

/** The consistent brand suffix appended to base titles (11 characters). */
export const TITLE_SUFFIX = ` | ${BRAND}`;

/** SEO title length bounds (inclusive). */
export const TITLE_MIN = 1;
export const TITLE_MAX = 60;

/** SEO meta description length bounds (inclusive). */
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 160;

/**
 * Default base title applied when a route defines no title (Req 14.5).
 * Length is within 1..60 both as a base value and after the brand suffix.
 */
export const DEFAULT_TITLE = "Developer Roadmaps & Free Tools";

/**
 * Default meta description applied when a route defines no description
 * (Req 14.5). Length is within 50..160.
 */
export const DEFAULT_DESCRIPTION =
  "DevAtlas is a free platform with developer career roadmaps, curated free tools, hands-on projects, and learning resources.";

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/** A route-like value that carries optional authored metadata. */
export interface MetadataInput {
  metadata?: RouteMetadata;
}

/** The fully resolved, valid SEO metadata for a route. */
export interface ResolvedMetadata {
  title: string;
  description: string;
}

/** Appends the brand suffix to a base title unless it is already present. */
function applyBrand(baseTitle: string): string {
  const base = baseTitle.trim().length > 0 ? baseTitle.trim() : DEFAULT_TITLE;
  if (base.endsWith(TITLE_SUFFIX)) {
    return base;
  }
  return `${base}${TITLE_SUFFIX}`;
}

/**
 * Resolves a route's authored metadata into a final title and description,
 * applying the defaults when a value is missing (Req 14.5) and the brand suffix
 * to the title (Req 14.2). The returned title is 1..60 chars and the
 * description is 50..160 chars for all registry routes.
 */
export function resolveMetadata(route: MetadataInput): ResolvedMetadata {
  const baseTitle = route.metadata?.title ?? DEFAULT_TITLE;
  const description = route.metadata?.description ?? DEFAULT_DESCRIPTION;
  return {
    title: applyBrand(baseTitle),
    description,
  };
}

/**
 * Builds a Next.js `Metadata` object for a route, suitable for returning from
 * a route segment's `metadata` export or `generateMetadata`.
 */
export function buildMetadata(route: MetadataInput): Metadata {
  const { title, description } = resolveMetadata(route);
  return { title, description };
}

/**
 * Returns the resolved SEO metadata for every public route, paired with its
 * path. Used by the sitemap (task 15.2) and SEO tests.
 */
export function listPublicRouteMetadata(): Array<
  ConcreteRoute & { resolved: ResolvedMetadata }
> {
  return listPublicRoutes().map((route) => ({
    ...route,
    resolved: resolveMetadata(route),
  }));
}
