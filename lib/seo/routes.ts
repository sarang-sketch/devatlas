/**
 * DevAtlas public-route registry (Req 14.2, 14.4, 14.5).
 *
 * This module is the single source of truth for which routes exist, which are
 * public (and therefore sitemap-eligible), and any per-route SEO metadata that
 * is known at build time. Dynamic routes (e.g. `/roadmaps/[slug]`) carry an
 * `enumerate` function that expands the pattern into concrete routes using the
 * static content data, so the sitemap (task 15.2) and the metadata resolver
 * (`./metadata`) can operate over every concrete public route.
 *
 * Title/description *base* values are stored here without the brand suffix.
 * `resolveMetadata` (in `./metadata`) is responsible for applying the brand
 * suffix and the defaults so the resolution rules live in exactly one place.
 */

import careerPaths from "@/data/career-paths.json";
import tools from "@/data/tools.json";
import projects from "@/data/projects.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Per-route SEO metadata as authored in the registry (pre-defaulting). */
export interface RouteMetadata {
  /** Base title without the brand suffix. Omit to fall back to the default. */
  title?: string;
  /** Meta description (50..160 chars). Omit to fall back to the default. */
  description?: string;
}

/**
 * A concrete, resolvable route: a real URL path plus any authored metadata.
 * Static routes produce a single ConcreteRoute; dynamic routes produce one per
 * enumerated item.
 */
export interface ConcreteRoute {
  /** The concrete URL path, e.g. `/` or `/roadmaps/frontend`. */
  path: string;
  /** Whether the route is publicly accessible / indexable. */
  isPublic: boolean;
  /** The originating registry pattern, e.g. `/roadmaps/[slug]`. */
  pattern: string;
  /** Authored metadata for this concrete route (may be empty). */
  metadata: RouteMetadata;
}

/** A registry entry describing one route pattern (static or dynamic). */
export interface RouteDefinition {
  /** The route pattern. Dynamic segments use `[param]` syntax. */
  pattern: string;
  /** Whether the route (and its concrete expansions) is public. */
  isPublic: boolean;
  /** True when the pattern contains one or more dynamic `[param]` segments. */
  isDynamic: boolean;
  /** Authored metadata for a static route. */
  metadata?: RouteMetadata;
  /** Expands a dynamic pattern into its concrete public routes. */
  enumerate?: () => ConcreteRoute[];
}

// ---------------------------------------------------------------------------
// Per-item metadata builders for dynamic routes
// ---------------------------------------------------------------------------

function roadmapRoute(id: string, name: string): ConcreteRoute {
  return {
    path: `/roadmaps/${id}`,
    isPublic: true,
    pattern: "/roadmaps/[slug]",
    metadata: {
      title: `${name} Roadmap`,
      description: `Follow the ${name} roadmap on DevAtlas with ordered milestones, free tools, hands-on projects, and curated learning resources.`,
    },
  };
}

function toolRoute(id: string, name: string): ConcreteRoute {
  return {
    path: `/tools/${id}`,
    isPublic: true,
    pattern: "/tools/[id]",
    metadata: {
      title: name,
      description: `Explore ${name} on DevAtlas: a free or free-tier developer tool with its features, free-tier limits, alternatives, and tags.`,
    },
  };
}

function projectRoute(id: string, name: string): ConcreteRoute {
  return {
    path: `/projects/${id}`,
    isPublic: true,
    pattern: "/projects/[id]",
    metadata: {
      title: name,
      description: `Build ${name} on DevAtlas: a hands-on practice project with required skills, recommended tech stack, time estimate, and outcomes.`,
    },
  };
}

// ---------------------------------------------------------------------------
// Route registry
// ---------------------------------------------------------------------------

/**
 * The complete route registry. Every route listed here is public; non-public
 * routes can be added with `isPublic: false` so the sitemap and tests can
 * distinguish them.
 */
export const ROUTE_REGISTRY: RouteDefinition[] = [
  {
    pattern: "/",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Master Any Developer Path",
      description:
        "DevAtlas maps free roadmaps, tools, and projects so you can master any developer career path without paying for a thing.",
    },
  },
  {
    pattern: "/roadmaps",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Developer Career Roadmaps",
      description:
        "Browse eighteen developer career roadmaps on DevAtlas, from frontend to blockchain, each with ordered milestones and free resources.",
    },
  },
  {
    pattern: "/roadmaps/[slug]",
    isPublic: true,
    isDynamic: true,
    enumerate: () => careerPaths.map((cp) => roadmapRoute(cp.id, cp.name)),
  },
  {
    pattern: "/tools",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Free Developer Tools",
      description:
        "Discover a curated library of free and free-tier developer tools on DevAtlas, filterable by category and tags to fit your stack.",
    },
  },
  {
    pattern: "/tools/[id]",
    isPublic: true,
    isDynamic: true,
    enumerate: () => tools.map((t) => toolRoute(t.id, t.name)),
  },
  {
    pattern: "/projects",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Practice Project Hub",
      description:
        "Find hands-on practice projects on DevAtlas across beginner to production-grade skill levels, each with goals and a tech stack.",
    },
  },
  {
    pattern: "/projects/[id]",
    isPublic: true,
    isDynamic: true,
    enumerate: () => projects.map((p) => projectRoute(p.id, p.name)),
  },
  {
    pattern: "/learning-paths",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Personalized Learning Paths",
      description:
        "Generate a personalized developer learning path on DevAtlas from your goal, available time, and current skill level in seconds.",
    },
  },
  {
    pattern: "/companies",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Company Hiring & Interview Prep Roadmaps",
      description:
        "See which top companies are hiring — Google, Microsoft, Amazon, TCS, Infosys, and more — with roles, salaries, and free learning roadmaps.",
    },
  },
  {
    pattern: "/certificates",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Free Certificates from Google, AWS & Microsoft",
      description:
        "Discover 100+ verified free certificates from Google, AWS, Microsoft, IBM, Meta, and Cisco across cloud, AI, cybersecurity, and data engineering.",
    },
  },
  {
    pattern: "/compare",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Compare Developer Tools",
      description:
        "Compare two to four free developer tools side by side on DevAtlas across free tier, database, auth, storage, pricing, and more.",
    },
  },
  {
    pattern: "/resources",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Developer Learning Resources",
      description:
        "Explore a curated index of free developer learning resources on DevAtlas, including guides, courses, docs, and reference material.",
    },
  },
  {
    pattern: "/about",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "About DevAtlas",
      description:
        "Learn about DevAtlas — a free platform for students, developers, and job seekers to acquire skills, build projects, and land their dream tech job.",
    },
  },
  {
    pattern: "/dashboard",
    isPublic: true,
    isDynamic: false,
    metadata: {
      title: "Your Learning Dashboard",
      description:
        "Track your DevAtlas progress in one place: completed roadmap nodes, saved free tools, bookmarked resources, and per-roadmap progress.",
    },
  },
];

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

/** Expands a single route definition into its concrete route(s). */
export function expandRoute(def: RouteDefinition): ConcreteRoute[] {
  if (def.isDynamic) {
    return def.enumerate ? def.enumerate() : [];
  }
  return [
    {
      path: def.pattern,
      isPublic: def.isPublic,
      pattern: def.pattern,
      metadata: def.metadata ?? {},
    },
  ];
}

/** Returns every concrete route in the registry, public and non-public. */
export function listAllRoutes(): ConcreteRoute[] {
  return ROUTE_REGISTRY.flatMap(expandRoute);
}

/**
 * Returns every concrete public route, expanding dynamic patterns. Used by the
 * sitemap (task 15.2) and the SEO metadata tests to enumerate public routes.
 */
export function listPublicRoutes(): ConcreteRoute[] {
  return listAllRoutes().filter((route) => route.isPublic);
}
