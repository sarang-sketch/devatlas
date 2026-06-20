/**
 * DevAtlas tools domain logic (pure functions).
 *
 * This module holds the framework-independent logic for the Tools Library and
 * the context-aware recommendation engine:
 *
 *   - `filterTools`            — category-membership + conjunctive-tag filtering (Req 6.3, 6.6, 6.8)
 *   - `recommendTools`         — tag-overlap recommendations for a career path (Req 7.1, 7.2, 7.3, 7.5)
 *   - `projectToolCardFields`  — pure projection of a tool's display fields (Req 6.2)
 *
 * Everything here is pure and deterministic so it can be exercised in isolation
 * by both example and property-based tests (design Correctness Properties 9-12).
 */

import type { CareerPath, Tool, ToolCategory } from "./types";

// ---------------------------------------------------------------------------
// filterTools (Req 6.3, 6.6, 6.8 — Properties 10 & 11)
// ---------------------------------------------------------------------------

/**
 * Filter a list of tools by selected categories and tags.
 *
 * A tool is kept if and only if BOTH conditions hold:
 *   1. Category membership — no categories are selected, OR the tool's category
 *      is among the selected categories.
 *   2. Conjunctive tag matching — the tool carries EVERY selected tag.
 *
 * An empty filter (`{ categories: [], tags: [] }`) therefore returns the full
 * list unchanged, which also means clearing all filters from any state yields
 * the complete tool set (Req 6.3, 6.8).
 *
 * The input array is never mutated; a new array (preserving order) is returned.
 */
export function filterTools(
  tools: Tool[],
  filter: { categories: ToolCategory[]; tags: string[] },
): Tool[] {
  const { categories, tags } = filter;

  return tools.filter((tool) => {
    const categoryMatches =
      categories.length === 0 || categories.includes(tool.category);

    const carriesEveryTag = tags.every((tag) => tool.tags.includes(tag));

    return categoryMatches && carriesEveryTag;
  });
}

// ---------------------------------------------------------------------------
// recommendTools (Req 7.1, 7.2, 7.3, 7.5 — Property 12)
// ---------------------------------------------------------------------------

/**
 * Recommend the tools relevant to a career path.
 *
 * Returns exactly the tools that share at least one tag with the career path's
 * tag set; when no tool shares a tag the result is the empty array (and the
 * recommendations section is omitted by the presentation layer, Req 7.5).
 *
 * Order and identity of the surviving tools are preserved from the input list.
 */
export function recommendTools(careerPath: CareerPath, tools: Tool[]): Tool[] {
  const pathTags = new Set(careerPath.tags);

  return tools.filter((tool) => tool.tags.some((tag) => pathTags.has(tag)));
}

// ---------------------------------------------------------------------------
// projectToolCardFields (Req 6.2 — Property 9)
// ---------------------------------------------------------------------------

/**
 * The display fields projected for a Tool_Card.
 *
 * The required fields (name, description, freeTier, category, website) are
 * always present. The optional fields (alternatives, tags) appear only when the
 * tool defines them with at least one entry.
 */
export interface ToolCardFields {
  name: string;
  description: string;
  freeTier: string;
  category: ToolCategory;
  website: string;
  alternatives?: string[];
  tags?: string[];
}

/**
 * Pure projection of a tool's display fields for a Tool_Card (Req 6.2).
 *
 * Required fields are always projected. `alternatives` and `tags` are included
 * exactly when the tool defines them with at least one entry, and omitted
 * otherwise so the card never renders empty optional sections.
 */
export function projectToolCardFields(tool: Tool): ToolCardFields {
  const fields: ToolCardFields = {
    name: tool.name,
    description: tool.description,
    freeTier: tool.freeTier,
    category: tool.category,
    website: tool.website,
  };

  if (tool.alternatives !== undefined && tool.alternatives.length > 0) {
    fields.alternatives = tool.alternatives;
  }

  if (tool.tags !== undefined && tool.tags.length > 0) {
    fields.tags = tool.tags;
  }

  return fields;
}
