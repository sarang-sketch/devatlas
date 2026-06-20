/**
 * Property-based tests for the DevAtlas account / persistence domain logic.
 *
 * Covers design Correctness Properties 22-24:
 *
 *   - Property 22 — roadmap progress is a clamped percentage   (task 12.3, Req 11.4)
 *   - Property 23 — account state persist/restore round trip   (task 12.4, Req 11.2, 11.3, 11.6)
 *   - Property 24 — add-then-remove returns to the prior state (task 12.5, Req 11.7)
 *
 * Property 22 exercises the pure `roadmapProgress`. Property 23 exercises a real
 * persist/restore round trip through the `LocalStore` wrapper backed by jsdom's
 * `localStorage`. Property 24 exercises the immutable add/remove helpers across
 * all three item kinds (completed node, saved tool, bookmarked resource).
 */

import { describe, it, expect, beforeEach } from "vitest";
import fc from "fast-check";

import {
  emptyAccountState,
  roadmapProgress,
  markNodeCompleted,
  unmarkNodeCompleted,
  saveTool,
  removeSavedTool,
  bookmarkResource,
  removeBookmark,
} from "./account";
import { read, write, STORAGE_KEYS } from "./local-store";
import type { AccountState, Roadmap, RoadmapNode } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A roadmap node carrying only the fields the progress logic reads. */
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

const roadmapIdArb: fc.Arbitrary<string> = fc.string({
  minLength: 1,
  maxLength: 12,
});

/**
 * A roadmap with N (0..20) uniquely-id'd nodes. Node ids are unique so the
 * "distinct completed nodes" count is unambiguous.
 */
const roadmapArb: fc.Arbitrary<Roadmap> = fc
  .record({
    id: roadmapIdArb,
    nodeIds: fc.uniqueArray(fc.string({ minLength: 1, maxLength: 8 }), {
      maxLength: 20,
    }),
  })
  .map(({ id, nodeIds }) => ({
    id,
    careerPathId: "frontend" as const,
    nodes: nodeIds.map((nid, i) => makeNode(nid, i)),
    edges: [],
  }));

/** A deduplicated subset of the given values. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subsetArb<T>(values: readonly T[]): fc.Arbitrary<T[]> {
  if (values.length === 0) return fc.constant([] as T[]);
  return fc
    .subarray([...values])
    .map((s) => [...s]);
}

/** An arbitrary, internally-consistent AccountState. */
const accountStateArb: fc.Arbitrary<AccountState> = fc
  .record({
    completedNodes: fc.dictionary(
      fc.string({ minLength: 1, maxLength: 8 }),
      fc.uniqueArray(fc.string({ minLength: 1, maxLength: 8 }), {
        maxLength: 8,
      }),
      { maxKeys: 6 },
    ),
    savedToolIds: fc.uniqueArray(fc.string({ minLength: 1, maxLength: 8 }), {
      maxLength: 12,
    }),
    bookmarkedResourceIds: fc.uniqueArray(
      fc.string({ minLength: 1, maxLength: 8 }),
      { maxLength: 12 },
    ),
    schemaVersion: fc.integer({ min: 0, max: 5 }),
  })
  .map((s) => ({
    completedNodes: s.completedNodes,
    savedToolIds: [...s.savedToolIds],
    bookmarkedResourceIds: [...s.bookmarkedResourceIds],
    schemaVersion: s.schemaVersion,
  }));

// ---------------------------------------------------------------------------
// Property 22 (task 12.3, Req 11.4)
// ---------------------------------------------------------------------------

describe("Property 22: Roadmap progress is a clamped percentage of completed nodes", () => {
  // **Validates: Requirements 11.4**
  it("equals round(completed/total*100), within 0..100, 0 when none and 100 when all", () => {
    fc.assert(
      fc.property(
        roadmapArb,
        // ghost ids: completed ids that are NOT real nodes of the roadmap.
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 8 }), {
          maxLength: 10,
        }),
        fc.integer({ min: 0, max: 100 }),
        (roadmap, ghostIds, pick) => {
          const total = roadmap.nodes.length;
          const allNodeIds = roadmap.nodes.map((n) => n.id);
          const nodeIdSet = new Set(allNodeIds);

          // Choose a subset (sized by `pick`%) of real nodes to mark completed.
          const takeCount = Math.round((pick / 100) * total);
          const realCompleted = allNodeIds.slice(0, takeCount);

          // Include ghost ids that are guaranteed not to be real nodes.
          const realGhosts = ghostIds.filter((g) => !nodeIdSet.has(g));
          const completedForRoadmap = [...realCompleted, ...realGhosts];

          const state: AccountState = {
            ...emptyAccountState(),
            completedNodes: { [roadmap.id]: completedForRoadmap },
          };

          const progress = roadmapProgress(state, roadmap);

          // Reference: distinct REAL completed nodes over total.
          const distinctReal = new Set(
            completedForRoadmap.filter((id) => nodeIdSet.has(id)),
          ).size;
          const expected =
            total === 0 ? 0 : Math.round((distinctReal / total) * 100);

          expect(progress).toBe(expected);

          // Always within the inclusive 0..100 range — ghost ids never push it over.
          expect(progress).toBeGreaterThanOrEqual(0);
          expect(progress).toBeLessThanOrEqual(100);
        },
      ),
    );
  });

  // **Validates: Requirements 11.4**
  it("is 0 when no nodes completed and 100 when all completed (non-empty roadmaps)", () => {
    fc.assert(
      fc.property(
        roadmapArb.filter((r) => r.nodes.length > 0),
        (roadmap) => {
          // None completed -> 0 (also covers the no-entry case).
          const noneState = emptyAccountState();
          expect(roadmapProgress(noneState, roadmap)).toBe(0);

          // All completed -> 100.
          const allState: AccountState = {
            ...emptyAccountState(),
            completedNodes: { [roadmap.id]: roadmap.nodes.map((n) => n.id) },
          };
          expect(roadmapProgress(allState, roadmap)).toBe(100);
        },
      ),
    );
  });

  // **Validates: Requirements 11.4**
  it("is 0 for an empty roadmap regardless of completed ids", () => {
    fc.assert(
      fc.property(
        roadmapIdArb,
        fc.array(fc.string({ minLength: 1, maxLength: 8 }), { maxLength: 8 }),
        (id, ghostIds) => {
          const roadmap: Roadmap = {
            id,
            careerPathId: "frontend",
            nodes: [],
            edges: [],
          };
          const state: AccountState = {
            ...emptyAccountState(),
            completedNodes: { [id]: ghostIds },
          };
          expect(roadmapProgress(state, roadmap)).toBe(0);
        },
      ),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 23 (task 12.4, Req 11.2, 11.3, 11.6)
// ---------------------------------------------------------------------------

describe("Property 23: Account state survives a persist/restore round trip", () => {
  beforeEach(() => {
    // Start each generated case from a clean storage so the round trip is the
    // only thing under test.
    window.localStorage.clear();
  });

  // **Validates: Requirements 11.2, 11.3, 11.6**
  it("write then read yields a state deep-equal to the original", () => {
    fc.assert(
      fc.property(accountStateArb, (state) => {
        window.localStorage.clear();

        const wrote = write(STORAGE_KEYS.account, state);
        expect(wrote).toBe(true);

        const restored = read<AccountState>(
          STORAGE_KEYS.account,
          emptyAccountState(),
        );

        expect(restored).toEqual(state);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 24 (task 12.5, Req 11.7)
// ---------------------------------------------------------------------------

describe("Property 24: Add-then-remove returns to the prior state", () => {
  /**
   * Prototype-safe accessor for a roadmapId's completed-node list within an
   * AccountState. Avoids the pitfall of `state.completedNodes[key]` resolving
   * an inherited Object.prototype member (e.g. "valueOf") instead of undefined.
   */
  function ownNodeList(state: AccountState, roadmapId: string): string[] {
    if (!Object.prototype.hasOwnProperty.call(state.completedNodes, roadmapId)) {
      return [];
    }
    const val = state.completedNodes[roadmapId];
    return Array.isArray(val) ? val : [];
  }

  /**
   * The three item kinds, each with an add/remove pair and an extractor that
   * returns the list the item lives in (for the "present item" assertions).
   */
  const completedNodeKind = {
    name: "completed node",
    add: (s: AccountState, roadmapId: string, id: string) =>
      markNodeCompleted(s, roadmapId, id),
    remove: (s: AccountState, roadmapId: string, id: string) =>
      unmarkNodeCompleted(s, roadmapId, id),
  };

  // **Validates: Requirements 11.7**
  it("completed node: add-then-remove restores the original, and removing a present node deletes exactly it", () => {
    fc.assert(
      fc.property(
        accountStateArb,
        fc.string({ minLength: 1, maxLength: 8 }),
        fc.string({ minLength: 1, maxLength: 8 }),
        (state, roadmapId, nodeId) => {
          const before = structuredClone(state);

          // Add-then-remove on an item NOT already present restores the original.
          // Use a prototype-safe own-property check so an arbitrary roadmapId
          // such as "valueOf" does not resolve an inherited Object member.
          const ownList = Object.prototype.hasOwnProperty.call(
            state.completedNodes,
            roadmapId,
          )
            ? state.completedNodes[roadmapId]
            : [];
          const isAlreadyPresent =
            Array.isArray(ownList) && ownList.includes(nodeId);

          if (!isAlreadyPresent) {
            const added = completedNodeKind.add(state, roadmapId, nodeId);
            const removed = completedNodeKind.remove(added, roadmapId, nodeId);
            // The domain treats an empty completedNodes array equivalently to a
            // missing key (both mean "no completed nodes for this roadmap"), so
            // normalize the comparison by stripping empty-array entries.
            const normalizedBefore = {
              ...before,
              completedNodes: Object.fromEntries(
                Object.entries(before.completedNodes).filter(
                  ([, ids]) => ids.length > 0,
                ),
              ),
            };
            const normalizedRemoved = {
              ...removed,
              completedNodes: Object.fromEntries(
                Object.entries(removed.completedNodes).filter(
                  ([, ids]) => ids.length > 0,
                ),
              ),
            };
            expect(normalizedRemoved).toEqual(normalizedBefore);
          }

          // Removing a PRESENT node deletes exactly that node, leaving others.
          const added = completedNodeKind.add(state, roadmapId, nodeId);
          expect(ownNodeList(added, roadmapId).includes(nodeId)).toBe(
            true,
          );
          const removed = completedNodeKind.remove(added, roadmapId, nodeId);

          // Exactly that node is gone; every other completed node is unchanged.
          expect(
            ownNodeList(removed, roadmapId).includes(nodeId),
          ).toBe(false);

          // All other roadmaps' completed lists are untouched.
          for (const key of Object.keys(added.completedNodes)) {
            if (key === roadmapId) continue;
            expect(ownNodeList(removed, key)).toEqual(
              ownNodeList(added, key),
            );
          }
          // The target roadmap loses only nodeId.
          const addedList = ownNodeList(added, roadmapId);
          const removedList = ownNodeList(removed, roadmapId);
          expect(removedList).toEqual(addedList.filter((id) => id !== nodeId));

          // Unrelated lists unchanged.
          expect(removed.savedToolIds).toEqual(state.savedToolIds);
          expect(removed.bookmarkedResourceIds).toEqual(
            state.bookmarkedResourceIds,
          );
        },
      ),
    );
  });

  // **Validates: Requirements 11.7**
  it("saved tool: add-then-remove restores the original, and removing a present tool deletes exactly it", () => {
    fc.assert(
      fc.property(
        accountStateArb,
        fc.string({ minLength: 1, maxLength: 8 }),
        (state, toolId) => {
          const before = structuredClone(state);
          const isPresent = state.savedToolIds.includes(toolId);

          if (!isPresent) {
            const added = saveTool(state, toolId);
            const removed = removeSavedTool(added, toolId);
            expect(removed).toEqual(before);
          }

          const added = saveTool(state, toolId);
          expect(added.savedToolIds.includes(toolId)).toBe(true);
          const removed = removeSavedTool(added, toolId);

          // Exactly toolId removed; all other saved tools preserved in order.
          expect(removed.savedToolIds).toEqual(
            added.savedToolIds.filter((id) => id !== toolId),
          );
          expect(removed.savedToolIds.includes(toolId)).toBe(false);

          // Unrelated lists unchanged.
          expect(removed.completedNodes).toEqual(state.completedNodes);
          expect(removed.bookmarkedResourceIds).toEqual(
            state.bookmarkedResourceIds,
          );
        },
      ),
    );
  });

  // **Validates: Requirements 11.7**
  it("bookmarked resource: add-then-remove restores the original, and removing a present bookmark deletes exactly it", () => {
    fc.assert(
      fc.property(
        accountStateArb,
        fc.string({ minLength: 1, maxLength: 8 }),
        (state, resourceId) => {
          const before = structuredClone(state);
          const isPresent = state.bookmarkedResourceIds.includes(resourceId);

          if (!isPresent) {
            const added = bookmarkResource(state, resourceId);
            const removed = removeBookmark(added, resourceId);
            expect(removed).toEqual(before);
          }

          const added = bookmarkResource(state, resourceId);
          expect(added.bookmarkedResourceIds.includes(resourceId)).toBe(true);
          const removed = removeBookmark(added, resourceId);

          // Exactly resourceId removed; all other bookmarks preserved in order.
          expect(removed.bookmarkedResourceIds).toEqual(
            added.bookmarkedResourceIds.filter((id) => id !== resourceId),
          );
          expect(removed.bookmarkedResourceIds.includes(resourceId)).toBe(false);

          // Unrelated lists unchanged.
          expect(removed.completedNodes).toEqual(state.completedNodes);
          expect(removed.savedToolIds).toEqual(state.savedToolIds);
        },
      ),
    );
  });
});
