/**
 * Property-based tests for the node-section domain logic (lib/domain/nodes.ts).
 *
 * Covers correctness properties 6 and 7 from the DevAtlas design:
 *  - Property 6: every node exposes exactly the six section keys.
 *  - Property 7: empty sections resolve to the placeholder, non-empty
 *    sections resolve to their items.
 *
 * Tests target the pure domain helpers with no React or side effects, using
 * fast-check arbitraries that randomly make each of the six sections empty or
 * populated. The shared setup (vitest.setup.ts) runs >= 100 cases per property.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  NODE_SECTION_KEYS,
  getSectionKeys,
  isSectionEmpty,
  getEmptySectionKeys,
  getNonEmptySectionKeys,
} from "./nodes";
import type {
  NodeSectionKey,
  ProjectRef,
  ResourceLink,
  RoadmapNode,
  ToolRef,
} from "./types";

// The expected six section keys, used to validate Property 6 independently of
// the module's own constant.
const EXPECTED_SECTION_KEYS: NodeSectionKey[] = [
  "learn",
  "practice",
  "build",
  "use",
  "deploy",
  "career",
];

// --- Item arbitraries -------------------------------------------------------

const resourceLinkArb: fc.Arbitrary<ResourceLink> = fc.record({
  id: fc.string(),
  name: fc.string(),
  url: fc.webUrl(),
  resourceType: fc.constantFrom(
    "course",
    "documentation",
    "video",
    "article",
    "challenge",
    "platform",
    "deployment",
    "career",
  ),
  tags: fc.array(fc.string()),
});

const projectRefArb: fc.Arbitrary<ProjectRef> = fc.record({
  projectId: fc.string(),
});

const toolRefArb: fc.Arbitrary<ToolRef> = fc.record({
  toolId: fc.string(),
});

/**
 * Build a section array that is randomly empty or populated.
 * Using minLength 0 means fast-check naturally explores the empty case and
 * many populated sizes, exercising both placeholder and items branches.
 */
function maybeEmptyArray<T>(item: fc.Arbitrary<T>): fc.Arbitrary<T[]> {
  return fc.array(item, { minLength: 0, maxLength: 5 });
}

// --- Node arbitrary ---------------------------------------------------------

const roadmapNodeArb: fc.Arbitrary<RoadmapNode> = fc.record({
  id: fc.string(),
  title: fc.string(),
  order: fc.integer(),
  tags: fc.array(fc.string()),
  sections: fc.record({
    learn: maybeEmptyArray(resourceLinkArb),
    practice: maybeEmptyArray(resourceLinkArb),
    build: maybeEmptyArray(projectRefArb),
    use: maybeEmptyArray(toolRefArb),
    deploy: maybeEmptyArray(resourceLinkArb),
    career: maybeEmptyArray(resourceLinkArb),
  }),
});

// --- Property 6 -------------------------------------------------------------

describe("nodes — Property 6: every node exposes exactly the six sections", () => {
  // Feature: devatlas, Property 6: Every node exposes exactly the six sections
  // — the rendered section key set equals {learn, practice, build, use, deploy, career}.
  // Validates: Requirements 5.2
  it("getSectionKeys returns exactly the six section keys as a set", () => {
    fc.assert(
      fc.property(roadmapNodeArb, (node) => {
        const keys = getSectionKeys(node);

        // Exactly six keys, no duplicates.
        expect(keys).toHaveLength(6);
        expect(new Set(keys).size).toBe(6);

        // The key set equals exactly {learn, practice, build, use, deploy, career}.
        expect(new Set(keys)).toEqual(new Set(EXPECTED_SECTION_KEYS));
      }),
    );
  });
});

// --- Property 7 -------------------------------------------------------------

describe("nodes — Property 7: empty sections show a placeholder, non-empty sections show items", () => {
  // Feature: devatlas, Property 7: Empty sections show a placeholder, non-empty
  // sections show items — empty sections resolve to the placeholder, non-empty
  // sections resolve to their items.
  // Validates: Requirements 5.9
  it("isSectionEmpty is true iff the section array is empty, and empty/non-empty keys partition the six keys", () => {
    fc.assert(
      fc.property(roadmapNodeArb, (node) => {
        const emptyKeys = getEmptySectionKeys(node);
        const nonEmptyKeys = getNonEmptySectionKeys(node);

        for (const key of NODE_SECTION_KEYS) {
          const sectionIsEmpty = node.sections[key].length === 0;

          // isSectionEmpty agrees with the underlying array length.
          expect(isSectionEmpty(node, key)).toBe(sectionIsEmpty);

          // A key is classified empty (placeholder) iff its section is empty,
          // and non-empty (items) iff its section has items.
          expect(emptyKeys.includes(key)).toBe(sectionIsEmpty);
          expect(nonEmptyKeys.includes(key)).toBe(!sectionIsEmpty);
        }

        // Empty and non-empty keys partition the six keys: disjoint and
        // together covering exactly the full set with no duplicates.
        expect(emptyKeys.length + nonEmptyKeys.length).toBe(6);
        expect(new Set([...emptyKeys, ...nonEmptyKeys])).toEqual(
          new Set(EXPECTED_SECTION_KEYS),
        );
        for (const key of emptyKeys) {
          expect(nonEmptyKeys).not.toContain(key);
        }
      }),
    );
  });
});
