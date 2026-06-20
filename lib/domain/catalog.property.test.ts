/**
 * Property-based tests for the DevAtlas career-path catalog and roadmap
 * ordering helpers (`lib/domain/catalog.ts`).
 *
 * Covers two correctness properties from design.md:
 *
 * - Property 4: Career path catalog integrity (Req 4.1, 4.2)
 * - Property 5: Roadmap nodes are forward-ordered by their connectors (Req 5.1)
 *
 * Property 4 is anchored on the fixed bundled catalog (the real Req 4.1/4.2
 * data), and additionally exercises the integrity predicate across generated
 * catalogs. Property 5 generates arbitrary well-formed roadmaps (random node
 * count, strictly increasing orders, forward-only edges) and asserts
 * `isForwardOrdered` is true, then injects a backward/self/dangling edge or a
 * duplicate order and asserts it is false.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  getCareerPaths,
  isForwardOrdered,
} from "@/lib/domain/catalog";
import { loadRoadmap } from "@/lib/content/loaders";
import type {
  CareerPath,
  CareerPathId,
  Roadmap,
  RoadmapEdge,
  RoadmapNode,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Shared fixtures and helpers
// ---------------------------------------------------------------------------

/** The exactly eighteen supported career-path ids (Req 4.1). */
const SUPPORTED_IDS: CareerPathId[] = [
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
  "computer-science",
  "data-analyst",
  "qa-engineer",
  "embedded-systems",
  "ui-ux-designer",
  "digital-marketer",
];

const MAX_DESCRIPTION = 200;

/**
 * Pure integrity predicate over a catalog's id set: true iff the set of ids is
 * exactly the eighteen supported ids with no others and no duplicates.
 */
function hasExactSupportedIds(paths: Pick<CareerPath, "id">[]): boolean {
  const ids = paths.map((p) => p.id);
  const idSet = new Set(ids);
  return (
    ids.length === SUPPORTED_IDS.length &&
    idSet.size === SUPPORTED_IDS.length &&
    SUPPORTED_IDS.every((id) => idSet.has(id))
  );
}

/** Pure predicate: every description is at most 200 characters (Req 4.2). */
function descriptionsWithinLimit(
  paths: Pick<CareerPath, "description">[],
): boolean {
  return paths.every((p) => p.description.length <= MAX_DESCRIPTION);
}

/** Build a minimal well-formed roadmap node with the given id and order. */
function makeNode(id: string, order: number): RoadmapNode {
  return {
    id,
    title: id,
    order,
    tags: [],
    sections: {
      learn: [],
      practice: [],
      build: [],
      use: [],
      deploy: [],
      career: [],
    },
  };
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/**
 * Generate an array of nodes whose `order` values are strictly increasing.
 * Node `i` (id `n{i}`) sits at sequence position `i`, so an edge from a lower
 * index to a higher index is always a forward edge.
 */
const orderedNodesArb: fc.Arbitrary<RoadmapNode[]> = fc
  .integer({ min: 1, max: 8 })
  .chain((count) =>
    fc
      .tuple(
        fc.integer({ min: -100, max: 100 }),
        fc.array(fc.integer({ min: 1, max: 25 }), {
          minLength: count - 1,
          maxLength: count - 1,
        }),
      )
      .map(([start, increments]) => {
        const orders: number[] = [start];
        let current = start;
        for (const inc of increments) {
          current += inc;
          orders.push(current);
        }
        return orders.map((order, i) => makeNode(`n${i}`, order));
      }),
  );

/** Generate forward-only edges (from lower order to higher order) for nodes. */
function forwardEdgesArb(
  nodes: RoadmapNode[],
): fc.Arbitrary<RoadmapEdge[]> {
  if (nodes.length < 2) {
    return fc.constant([]);
  }
  const pairArb = fc
    .integer({ min: 0, max: nodes.length - 2 })
    .chain((from) =>
      fc
        .integer({ min: from + 1, max: nodes.length - 1 })
        .map((to) => ({ from: nodes[from].id, to: nodes[to].id })),
    );
  return fc.array(pairArb, { maxLength: 12 });
}

/** A well-formed roadmap: strictly increasing nodes + forward-only edges. */
const wellFormedRoadmapArb: fc.Arbitrary<Roadmap> = orderedNodesArb.chain(
  (orderedNodes) =>
    fc
      .tuple(forwardEdgesArb(orderedNodes), fc.shuffledSubarray(orderedNodes, {
        minLength: orderedNodes.length,
        maxLength: orderedNodes.length,
      }))
      .map(([edges, shuffledNodes]) => ({
        id: "rm",
        careerPathId: "frontend" as CareerPathId,
        // Store nodes shuffled to exercise the sort inside isForwardOrdered.
        nodes: shuffledNodes,
        edges,
      })),
);

/**
 * A roadmap with at least two nodes and a single deliberately-introduced
 * defect, so it must NOT be forward-ordered. The defect is one of:
 * backward edge, self edge, dangling edge, or a duplicate order.
 */
const defectiveRoadmapArb: fc.Arbitrary<Roadmap> = orderedNodesArb
  .filter((nodes) => nodes.length >= 2)
  .chain((orderedNodes) =>
    fc
      .tuple(
        forwardEdgesArb(orderedNodes),
        fc.constantFrom("backward", "self", "dangling", "duplicate-order"),
        fc.integer({ min: 0, max: orderedNodes.length - 2 }),
      )
      .map(([forwardEdges, defect, lowIndex]) => {
        const nodes = orderedNodes.map((n) => makeNode(n.id, n.order));
        const edges: RoadmapEdge[] = [...forwardEdges];
        const lo = nodes[lowIndex];
        const hi = nodes[lowIndex + 1];

        switch (defect) {
          case "backward":
            // hi has a strictly greater order than lo -> this edge is backward.
            edges.push({ from: hi.id, to: lo.id });
            break;
          case "self":
            edges.push({ from: lo.id, to: lo.id });
            break;
          case "dangling":
            edges.push({ from: lo.id, to: "__missing_node__" });
            break;
          case "duplicate-order":
            // Force two distinct nodes to share the same order.
            hi.order = lo.order;
            break;
        }

        return {
          id: "rm",
          careerPathId: "frontend" as CareerPathId,
          nodes,
          edges,
        };
      }),
  );

// ---------------------------------------------------------------------------
// Property 4: Career path catalog integrity
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 4: Career path catalog integrity", () => {
  // **Validates: Requirements 4.1, 4.2**

  it("Feature: devatlas, Property 4: Career path catalog integrity — bundled catalog has exactly the 18 ids, loadable roadmaps, and <=200-char descriptions", () => {
    const result = getCareerPaths();

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const paths = result.data;

    // Exactly the eighteen supported ids, no others, no duplicates (Req 4.1).
    expect(hasExactSupportedIds(paths)).toBe(true);
    expect(new Set(paths.map((p) => p.id))).toEqual(new Set(SUPPORTED_IDS));

    // Every path references a loadable roadmap (Req 4.1).
    for (const path of paths) {
      const roadmap = loadRoadmap(path.roadmapId);
      expect(roadmap.ok).toBe(true);
    }

    // Every description is at most 200 characters (Req 4.2).
    expect(descriptionsWithinLimit(paths)).toBe(true);
    for (const path of paths) {
      expect(path.description.length).toBeLessThanOrEqual(MAX_DESCRIPTION);
    }
  });

  it("Feature: devatlas, Property 4: Career path catalog integrity — integrity predicate accepts the exact supported id set and rejects any deviation", () => {
    const idArb = fc.constantFrom(...SUPPORTED_IDS);

    fc.assert(
      fc.property(
        fc.array(idArb, { maxLength: 16 }),
        fc.boolean(),
        (ids, dropOrDuplicate) => {
          const paths = ids.map((id) => ({ id }));
          const isExactPermutation =
            ids.length === SUPPORTED_IDS.length &&
            new Set(ids).size === SUPPORTED_IDS.length;
          // The predicate is true iff the ids are exactly the 18 supported ids.
          expect(hasExactSupportedIds(paths)).toBe(isExactPermutation);

          // Any catalog missing an id or carrying an extra/duplicate is rejected.
          if (dropOrDuplicate && ids.length > 0) {
            const mutated = [...paths, { id: ids[0] }];
            expect(hasExactSupportedIds(mutated)).toBe(false);
          }
        },
      ),
    );
  });

  it("Feature: devatlas, Property 4: Career path catalog integrity — description predicate holds iff every description is <=200 chars", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 260 }), { minLength: 1, maxLength: 18 }),
        (descriptions) => {
          const paths = descriptions.map((description) => ({ description }));
          const expected = descriptions.every(
            (d) => d.length <= MAX_DESCRIPTION,
          );
          expect(descriptionsWithinLimit(paths)).toBe(expected);
        },
      ),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Roadmap nodes are forward-ordered by their connectors
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 5: Roadmap nodes are forward-ordered by their connectors", () => {
  // **Validates: Requirements 5.1**

  it("Feature: devatlas, Property 5: Roadmap nodes are forward-ordered by their connectors — well-formed roadmaps (strictly increasing orders, forward-only edges) are forward-ordered", () => {
    fc.assert(
      fc.property(wellFormedRoadmapArb, (roadmap) => {
        expect(isForwardOrdered(roadmap)).toBe(true);
      }),
    );
  });

  it("Feature: devatlas, Property 5: Roadmap nodes are forward-ordered by their connectors — a backward/self/dangling edge or duplicate order makes a roadmap not forward-ordered", () => {
    fc.assert(
      fc.property(defectiveRoadmapArb, (roadmap) => {
        expect(isForwardOrdered(roadmap)).toBe(false);
      }),
    );
  });
});
