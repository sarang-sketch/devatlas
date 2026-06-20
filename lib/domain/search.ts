/**
 * DevAtlas search domain logic (Req 3).
 *
 * Pure, framework-independent functions that build a flat search index over all
 * content and answer queries against it:
 *
 * 1. {@link buildSearchIndex} flattens a {@link ContentBundle} into exactly one
 *    {@link SearchableItem} per source item, tagging each with the correct
 *    {@link ContentType} and a navigation `href` (Req 3.1, 3.5).
 * 2. {@link search} returns the case-insensitive name/tag substring matches for
 *    queries of length 2..100, grouped by content type, and an empty result for
 *    queries outside that range (Req 3.2, 3.3, 3.6).
 *
 * Both functions are pure: they read their inputs and return new values without
 * mutating anything or touching the DOM, network, or storage.
 */

import type {
  CareerPath,
  ContentType,
  GroupedResults,
  LearningResource,
  Project,
  Roadmap,
  SearchIndex,
  SearchableItem,
  SearchResult,
  Tool,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// ContentBundle
// ---------------------------------------------------------------------------

/**
 * The collection of loaded content the search index is built from. Each field
 * is the validated domain output of the matching content loader.
 */
export interface ContentBundle {
  careerPaths: CareerPath[];
  roadmaps: Roadmap[];
  tools: Tool[];
  projects: Project[];
  resources: LearningResource[];
}

/** Lower-bound (inclusive) of the searchable query length (Req 3.2, 3.6). */
export const MIN_QUERY_LENGTH = 2;
/** Upper-bound (inclusive) of the searchable query length (Req 3.2, 3.6). */
export const MAX_QUERY_LENGTH = 100;

// ---------------------------------------------------------------------------
// Tool -> ContentType mapping
// ---------------------------------------------------------------------------

/**
 * Map a tool to the search content type that best reflects its category, so the
 * specialized groups (database, api, hosting, ai-service) are represented in
 * addition to the generic `tool` group (Req 3.1). Any tool whose category does
 * not map to a specialized group is indexed as a plain `tool`.
 */
function toolContentType(tool: Tool): ContentType {
  switch (tool.category) {
    case "Databases":
      return "database";
    case "APIs":
      return "api";
    case "Hosting":
      return "hosting";
    case "AI":
      return "ai-service";
    default:
      return "tool";
  }
}

// ---------------------------------------------------------------------------
// buildSearchIndex
// ---------------------------------------------------------------------------

/**
 * Build a flat search index over every item in `content`, producing exactly one
 * {@link SearchableItem} per source item (Req 3.1).
 *
 * Mapping of source item -> content type and navigation target:
 * - career path  -> `roadmap`     -> `/roadmaps/{id}`
 * - roadmap node -> `node`        -> `/roadmaps/{slug}`
 * - tool         -> `tool` | `database` | `api` | `hosting` | `ai-service`
 *                                 -> `/tools/{id}`
 * - project      -> `technology`  -> `/projects/{id}`
 * - resource     -> `resource`    -> external url (or `/resources`)
 *
 * Together these cover all nine {@link ContentType} values.
 */
export function buildSearchIndex(content: ContentBundle): SearchIndex {
  const items: SearchableItem[] = [];

  // Career paths are searchable as their roadmap (Req 3.1).
  for (const path of content.careerPaths) {
    items.push({
      id: path.id,
      name: path.name,
      type: "roadmap",
      tags: path.tags,
      href: `/roadmaps/${path.id}`,
    });
  }

  // Each roadmap node is its own searchable item, navigating to its roadmap.
  for (const roadmap of content.roadmaps) {
    const slug = roadmap.careerPathId;
    for (const node of roadmap.nodes) {
      items.push({
        id: node.id,
        name: node.title,
        type: "node",
        tags: node.tags,
        href: `/roadmaps/${slug}`,
      });
    }
  }

  // Tools map to their specialized content type by category (Req 3.1).
  for (const tool of content.tools) {
    items.push({
      id: tool.id,
      name: tool.name,
      type: toolContentType(tool),
      tags: tool.tags,
      href: `/tools/${tool.id}`,
    });
  }

  // Projects are surfaced as buildable technologies.
  for (const project of content.projects) {
    items.push({
      id: project.id,
      name: project.name,
      type: "technology",
      tags: project.tags,
      href: `/projects/${project.id}`,
    });
  }

  // Learning resources link out to their external site when available.
  for (const resource of content.resources) {
    items.push({
      id: resource.id,
      name: resource.name,
      type: "resource",
      tags: resource.tags,
      href: resource.url || "/resources",
    });
  }

  return { items };
}

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

/** True when `haystack` contains `needle` as a case-insensitive substring. */
function containsInsensitive(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

/** True when an indexed item's name or any of its tags matches the query. */
function matchesQuery(item: SearchableItem, loweredQuery: string): boolean {
  if (containsInsensitive(item.name, loweredQuery)) {
    return true;
  }
  return item.tags.some((tag) => containsInsensitive(tag, loweredQuery));
}

/**
 * Return the items matching `query`, grouped by content type (Req 3.2, 3.3).
 *
 * - When the query length is in [2, 100], a result is included iff the query is
 *   a case-insensitive substring of the item's name or one of its tags.
 * - When the query length is below 2 or above 100, the result is empty so no
 *   results are shown (Req 3.6).
 *
 * Each matching item is emitted into the group keyed by its own content type,
 * so a group never holds a result of a foreign type (Req 3.3).
 */
export function search(index: SearchIndex, query: string): GroupedResults {
  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return {};
  }

  const loweredQuery = query.toLowerCase();
  const grouped: GroupedResults = {};

  for (const item of index.items) {
    if (!matchesQuery(item, loweredQuery)) {
      continue;
    }

    const result: SearchResult = {
      id: item.id,
      name: item.name,
      type: item.type,
      href: item.href,
    };

    const group = grouped[item.type] ?? [];
    group.push(result);
    grouped[item.type] = group;
  }

  return grouped;
}
