/**
 * Property-based tests for the DevAtlas tools domain logic.
 *
 * Covers design Correctness Properties 8-12 for the pure functions in
 * `./tools`:
 *
 *   - Property 8  — every tool belongs to a supported category   (task 7.4, Req 6.1)
 *   - Property 9  — tool-card required/optional field projection  (task 7.5, Req 6.2)
 *   - Property 10 — category + conjunctive-tag filtering          (task 7.6, Req 6.6)
 *   - Property 11 — no/cleared filters yield the full set         (task 7.7, Req 6.3, 6.8)
 *   - Property 12 — recommendations are the tag-matching tools    (task 7.8, Req 7.1-7.3, 7.5)
 *
 * Each property is checked against fast-check-generated inputs and an
 * independent reference implementation. Property 8 is additionally asserted
 * over the real loaded tool set.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  filterTools,
  recommendTools,
  projectToolCardFields,
} from "./tools";
import type { CareerPath, Tool, ToolCategory } from "./types";
import { loadTools } from "@/lib/content/loaders";

// ---------------------------------------------------------------------------
// Shared constants and reference data
// ---------------------------------------------------------------------------

/** The fourteen supported tool categories (Req 6.1). */
const SUPPORTED_CATEGORIES: readonly ToolCategory[] = [
  "AI",
  "Hosting",
  "Databases",
  "Analytics",
  "Auth",
  "Storage",
  "Monitoring",
  "CI/CD",
  "APIs",
  "Design",
  "Productivity",
  "Testing",
  "Security",
  "Open Source",
  "Domains",
];

const SUPPORTED_CATEGORY_SET = new Set<string>(SUPPORTED_CATEGORIES);

/** A small tag universe so generated tools and filters overlap meaningfully. */
const TAG_UNIVERSE = [
  "frontend",
  "backend",
  "ai",
  "ml",
  "cloud",
  "devops",
  "mobile",
  "security",
  "data",
  "web3",
];

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const categoryArb: fc.Arbitrary<ToolCategory> = fc.constantFrom(
  ...SUPPORTED_CATEGORIES,
);

const tagArb: fc.Arbitrary<string> = fc.constantFrom(...TAG_UNIVERSE);

/** A set (deduplicated) of tags drawn from the shared universe. */
const tagsArb: fc.Arbitrary<string[]> = fc
  .uniqueArray(tagArb, { maxLength: TAG_UNIVERSE.length })
  .map((tags) => [...tags]);

/**
 * A Tool with a random supported category, random tags, and optionally present
 * `alternatives` / `comparison` fields. `id` is unique per tool so that result
 * membership can be compared by identity.
 */
const toolArb: fc.Arbitrary<Tool> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 50 }),
  category: categoryArb,
  freeTier: fc.string({ maxLength: 30 }),
  website: fc.webUrl(),
  alternatives: fc.option(
    fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 4 }),
    { nil: undefined },
  ),
  tags: tagsArb,
  comparison: fc.option(
    fc.record({
      databaseSupport: fc.option(fc.string(), { nil: undefined }),
      authSupport: fc.option(fc.string(), { nil: undefined }),
      storageSupport: fc.option(fc.string(), { nil: undefined }),
      realtimeSupport: fc.option(fc.string(), { nil: undefined }),
      pricing: fc.option(fc.string(), { nil: undefined }),
      learningCurve: fc.option(fc.string(), { nil: undefined }),
    }),
    { nil: undefined },
  ),
});

const toolsArb: fc.Arbitrary<Tool[]> = fc.array(toolArb, { maxLength: 25 });

/** A ToolFilter drawing categories and tags from the same finite universes. */
const filterArb: fc.Arbitrary<{ categories: ToolCategory[]; tags: string[] }> =
  fc.record({
    categories: fc
      .uniqueArray(categoryArb, { maxLength: SUPPORTED_CATEGORIES.length })
      .map((c) => [...c]),
    tags: fc
      .uniqueArray(tagArb, { maxLength: TAG_UNIVERSE.length })
      .map((t) => [...t]),
  });

/** A CareerPath whose only field the recommender uses is `tags`. */
const careerPathArb: fc.Arbitrary<CareerPath> = fc.record({
  id: fc.constantFrom(
    "frontend",
    "backend",
    "fullstack",
    "mobile",
    "ai-engineer",
    "ml-engineer",
    "data-scientist",
    "devops",
    "cloud",
    "cybersecurity",
    "game-dev",
    "blockchain",
  ),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 200 }),
  tags: tagsArb,
  roadmapId: fc.string({ minLength: 1, maxLength: 20 }),
});

// ---------------------------------------------------------------------------
// Property 8 (task 7.4, Req 6.1)
// ---------------------------------------------------------------------------

describe("Property 8: Every tool belongs to a supported category", () => {
  // **Validates: Requirements 6.1**
  it("each loaded tool's category is one of the 14 supported categories (real data)", () => {
    const result = loadTools();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.length).toBeGreaterThan(0);
    for (const tool of result.data) {
      expect(SUPPORTED_CATEGORY_SET.has(tool.category)).toBe(true);
    }
  });

  // **Validates: Requirements 6.1**
  it("holds for every generated tool", () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        return SUPPORTED_CATEGORY_SET.has(tool.category);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9 (task 7.5, Req 6.2)
// ---------------------------------------------------------------------------

describe("Property 9: Tool card shows required fields always and optional fields when present", () => {
  // **Validates: Requirements 6.2**
  it("always projects required fields and projects alternatives/tags exactly when defined", () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const fields = projectToolCardFields(tool);

        // Required fields always present and equal to the source tool.
        expect(fields.name).toBe(tool.name);
        expect(fields.description).toBe(tool.description);
        expect(fields.freeTier).toBe(tool.freeTier);
        expect(fields.category).toBe(tool.category);
        expect(fields.website).toBe(tool.website);

        // Optional fields: present iff the tool defines a non-empty value.
        const expectAlternatives =
          tool.alternatives !== undefined && tool.alternatives.length > 0;
        if (expectAlternatives) {
          expect(fields.alternatives).toEqual(tool.alternatives);
        } else {
          expect("alternatives" in fields).toBe(false);
        }

        const expectTags = tool.tags !== undefined && tool.tags.length > 0;
        if (expectTags) {
          expect(fields.tags).toEqual(tool.tags);
        } else {
          expect("tags" in fields).toBe(false);
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10 (task 7.6, Req 6.6)
// ---------------------------------------------------------------------------

describe("Property 10: Tool filtering applies category membership and conjunctive tag matching", () => {
  // **Validates: Requirements 6.6**
  it("includes a tool iff (category matches or none selected) and it carries every selected tag", () => {
    fc.assert(
      fc.property(toolsArb, filterArb, (tools, filter) => {
        const actual = filterTools(tools, filter);

        // Independent reference: recompute the expected included set.
        const expected = tools.filter((tool) => {
          const categoryMatches =
            filter.categories.length === 0 ||
            filter.categories.includes(tool.category);
          const carriesEveryTag = filter.tags.every((tag) =>
            tool.tags.includes(tag),
          );
          return categoryMatches && carriesEveryTag;
        });

        expect(actual).toEqual(expected);

        // Every excluded tool must fail at least one condition.
        const includedIds = new Set(actual.map((t) => t.id));
        for (const tool of tools) {
          if (includedIds.has(tool.id)) continue;
          const categoryMatches =
            filter.categories.length === 0 ||
            filter.categories.includes(tool.category);
          const carriesEveryTag = filter.tags.every((tag) =>
            tool.tags.includes(tag),
          );
          expect(categoryMatches && carriesEveryTag).toBe(false);
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11 (task 7.7, Req 6.3, 6.8)
// ---------------------------------------------------------------------------

describe("Property 11: No active filters yields the full tool set", () => {
  // **Validates: Requirements 6.3, 6.8**
  it("an empty filter returns the full list unchanged", () => {
    fc.assert(
      fc.property(toolsArb, (tools) => {
        const result = filterTools(tools, { categories: [], tags: [] });
        expect(result).toEqual(tools);
      }),
    );
  });

  // **Validates: Requirements 6.3, 6.8**
  it("clearing filters from any state returns the same full list", () => {
    fc.assert(
      fc.property(toolsArb, filterArb, (tools, filter) => {
        // Apply an arbitrary filter, then clear it.
        filterTools(tools, filter);
        const cleared = filterTools(tools, { categories: [], tags: [] });
        expect(cleared).toEqual(tools);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 12 (task 7.8, Req 7.1, 7.2, 7.3, 7.5)
// ---------------------------------------------------------------------------

describe("Property 12: Recommendations are exactly the tag-matching tools", () => {
  // **Validates: Requirements 7.1, 7.2, 7.3, 7.5**
  it("returns exactly the tools sharing >=1 tag with the path; empty when none", () => {
    fc.assert(
      fc.property(careerPathArb, toolsArb, (careerPath, tools) => {
        const actual = recommendTools(careerPath, tools);

        // Independent reference: tools sharing at least one tag with the path.
        const pathTags = new Set(careerPath.tags);
        const expected = tools.filter((tool) =>
          tool.tags.some((tag) => pathTags.has(tag)),
        );

        expect(actual).toEqual(expected);

        // When no tool shares a tag, the result is empty.
        const anyShared = tools.some((tool) =>
          tool.tags.some((tag) => pathTags.has(tag)),
        );
        if (!anyShared) {
          expect(actual).toEqual([]);
        }
      }),
    );
  });
});
