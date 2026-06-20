/**
 * Property-based tests for the DevAtlas search domain logic (Req 3).
 *
 * These cover three correctness properties from the design:
 *  - Property 1: the search index covers every content item (Req 3.1)
 *  - Property 2: search returns exactly the case-insensitive substring matches
 *    within the 2..100 char query bounds, empty otherwise (Req 3.2, 3.6)
 *  - Property 3: results are grouped by their own content type (Req 3.3)
 *
 * The tests build fast-check arbitraries for a {@link ContentBundle} and exercise
 * {@link buildSearchIndex} and {@link search} directly. The global fast-check
 * config (numRuns = 100) is applied in `vitest.setup.ts`.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  buildSearchIndex,
  search,
  type ContentBundle,
} from "@/lib/domain/search";
import type {
  CareerPath,
  CareerPathId,
  ContentType,
  GroupedResults,
  LearningResource,
  Project,
  Roadmap,
  RoadmapNode,
  SearchableItem,
  SkillLevel,
  Tool,
  ToolCategory,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Constant pools mirroring the domain enumerations.
// ---------------------------------------------------------------------------

const CAREER_PATH_IDS: CareerPathId[] = [
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
];

const TOOL_CATEGORIES: ToolCategory[] = [
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
];

const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
];

const RESOURCE_TYPES: LearningResource["resourceType"][] = [
  "course",
  "documentation",
  "video",
  "article",
  "challenge",
  "platform",
  "deployment",
  "career",
];

/**
 * The expected search content type for a tool, mirroring the design's
 * category -> type mapping (Req 3.1). Used only to derive expected counts in
 * the index-coverage property.
 */
function expectedToolType(category: ToolCategory): ContentType {
  switch (category) {
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
// Generators
// ---------------------------------------------------------------------------

/**
 * A short word drawn from a deliberately small, mixed-case alphabet so that
 * randomly generated queries have a meaningful probability of matching item
 * names/tags as substrings, and so the case-insensitive behavior is exercised.
 */
const wordArb = fc
  .array(fc.constantFrom(..."abcABC".split("")), { minLength: 1, maxLength: 6 })
  .map((chars) => chars.join(""));

const tagsArb = fc.array(wordArb, { maxLength: 3 });

const emptySections: RoadmapNode["sections"] = {
  learn: [],
  practice: [],
  build: [],
  use: [],
  deploy: [],
  career: [],
};

const nodeArb: fc.Arbitrary<RoadmapNode> = fc.record({
  id: fc.constant("placeholder"),
  title: wordArb,
  order: fc.nat({ max: 50 }),
  tags: tagsArb,
  sections: fc.constant(emptySections),
});

const careerPathArb: fc.Arbitrary<CareerPath> = fc.record({
  id: fc.constantFrom(...CAREER_PATH_IDS),
  name: wordArb,
  description: wordArb,
  tags: tagsArb,
  roadmapId: wordArb,
});

const roadmapArb: fc.Arbitrary<Roadmap> = fc.record({
  id: wordArb,
  careerPathId: fc.constantFrom(...CAREER_PATH_IDS),
  nodes: fc.array(nodeArb, { maxLength: 4 }),
  edges: fc.constant([]),
});

const toolArb: fc.Arbitrary<Tool> = fc.record({
  id: fc.constant("placeholder"),
  name: wordArb,
  description: wordArb,
  category: fc.constantFrom(...TOOL_CATEGORIES),
  freeTier: wordArb,
  website: wordArb,
  tags: tagsArb,
});

const projectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.constant("placeholder"),
  name: wordArb,
  skillLevel: fc.constantFrom(...SKILL_LEVELS),
  description: wordArb,
  requiredSkills: tagsArb,
  estimatedTime: wordArb,
  techStack: tagsArb,
  learningOutcomes: tagsArb,
  tags: tagsArb,
});

const resourceArb: fc.Arbitrary<LearningResource> = fc.record({
  id: fc.constant("placeholder"),
  name: wordArb,
  url: wordArb,
  resourceType: fc.constantFrom(...RESOURCE_TYPES),
  tags: tagsArb,
});

/**
 * A ContentBundle whose source items all carry globally unique ids. Career
 * paths keep their (already unique) path-id; every other source item is
 * reassigned a category-prefixed sequential id during normalization so that no
 * two source items in the whole bundle share an id. This lets the matching
 * property compare result sets by id alone.
 */
const contentBundleArb: fc.Arbitrary<ContentBundle> = fc
  .record({
    careerPaths: fc.uniqueArray(careerPathArb, {
      selector: (c) => c.id,
      maxLength: 6,
    }),
    roadmaps: fc.uniqueArray(roadmapArb, {
      selector: (r) => r.careerPathId,
      maxLength: 4,
    }),
    tools: fc.array(toolArb, { maxLength: 8 }),
    projects: fc.array(projectArb, { maxLength: 6 }),
    resources: fc.array(resourceArb, { maxLength: 6 }),
  })
  .map((bundle) => ({
    careerPaths: bundle.careerPaths,
    roadmaps: bundle.roadmaps.map((roadmap, ri) => ({
      ...roadmap,
      nodes: roadmap.nodes.map((node, ni) => ({
        ...node,
        id: `node-${ri}-${ni}`,
      })),
    })),
    tools: bundle.tools.map((tool, i) => ({ ...tool, id: `tool-${i}` })),
    projects: bundle.projects.map((p, i) => ({ ...p, id: `proj-${i}` })),
    resources: bundle.resources.map((r, i) => ({ ...r, id: `res-${i}` })),
  }));

/**
 * Queries spanning the interesting space: short mixed-case words (hit the 2..100
 * range and frequently match), arbitrary short strings (length 0/1 edge cases),
 * and over-long strings (above the 100-char ceiling).
 */
const queryArb = fc.oneof(
  fc
    .array(fc.constantFrom(..."abcABC ".split("")), { maxLength: 6 })
    .map((chars) => chars.join("")),
  fc.string({ maxLength: 5 }),
  fc.string({ minLength: 101, maxLength: 110 }),
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function totalSourceItems(bundle: ContentBundle): number {
  const nodeCount = bundle.roadmaps.reduce((sum, r) => sum + r.nodes.length, 0);
  return (
    bundle.careerPaths.length +
    nodeCount +
    bundle.tools.length +
    bundle.projects.length +
    bundle.resources.length
  );
}

function flattenResults(grouped: GroupedResults): { id: string }[] {
  return Object.values(grouped).flatMap((group) => group ?? []);
}

/** Independent reference implementation of the case-insensitive match. */
function expectedMatchIds(items: SearchableItem[], query: string): string[] {
  if (query.length < 2 || query.length > 100) {
    return [];
  }
  const q = query.toLowerCase();
  return items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
    .map((item) => item.id);
}

const sorted = (ids: string[]): string[] => [...ids].sort();

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

describe("search domain properties", () => {
  // Feature: devatlas, Property 1: Search index covers every content item — exactly one searchable item per source item with a matching content type. Validates: Requirements 3.1
  it("Property 1: builds exactly one searchable item per source item with a matching content type", () => {
    fc.assert(
      fc.property(contentBundleArb, (bundle) => {
        const { items } = buildSearchIndex(bundle);

        // Exactly one searchable item per source item.
        expect(items.length).toBe(totalSourceItems(bundle));

        const countByType = (type: ContentType): number =>
          items.filter((item) => item.type === type).length;

        // Each source category maps to its expected content type(s).
        expect(countByType("roadmap")).toBe(bundle.careerPaths.length);
        expect(countByType("node")).toBe(
          bundle.roadmaps.reduce((sum, r) => sum + r.nodes.length, 0),
        );
        expect(countByType("technology")).toBe(bundle.projects.length);
        expect(countByType("resource")).toBe(bundle.resources.length);

        // Tools map to a specialized type by category; the union of those types
        // accounts for exactly the tools.
        for (const type of [
          "tool",
          "database",
          "api",
          "hosting",
          "ai-service",
        ] as const) {
          const expected = bundle.tools.filter(
            (t) => expectedToolType(t.category) === type,
          ).length;
          expect(countByType(type)).toBe(expected);
        }
      }),
    );
  });

  // Feature: devatlas, Property 2: Search returns exactly the case-insensitive substring matches — for queries of length 2..100 results are exactly the case-insensitive name/tag substring matches; outside that range the result is empty. Validates: Requirements 3.2, 3.6
  it("Property 2: returns exactly the case-insensitive substring matches within the 2..100 char bounds", () => {
    fc.assert(
      fc.property(contentBundleArb, queryArb, (bundle, query) => {
        const index = buildSearchIndex(bundle);
        const resultIds = flattenResults(search(index, query)).map((r) => r.id);
        const expected = expectedMatchIds(index.items, query);

        expect(sorted(resultIds)).toEqual(sorted(expected));

        // Out-of-range queries yield no results at all.
        if (query.length < 2 || query.length > 100) {
          expect(resultIds).toHaveLength(0);
        }
      }),
    );
  });

  // Feature: devatlas, Property 3: Search results are grouped by their own content type — every result appears only in its own type group and no group holds a foreign type. Validates: Requirements 3.3
  it("Property 3: groups every result under its own content type and no group holds a foreign type", () => {
    fc.assert(
      fc.property(contentBundleArb, queryArb, (bundle, query) => {
        const index = buildSearchIndex(bundle);
        const grouped = search(index, query);

        for (const [groupType, results] of Object.entries(grouped)) {
          for (const result of results ?? []) {
            expect(result.type).toBe(groupType);
          }
        }
      }),
    );
  });
});
