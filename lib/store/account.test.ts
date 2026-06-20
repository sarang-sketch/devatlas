import { describe, it, expect } from "vitest";

import {
  emptyAccountState,
  roadmapProgress,
  markNodeCompleted,
  unmarkNodeCompleted,
  saveTool,
  removeSavedTool,
  bookmarkResource,
  removeBookmark,
} from "@/lib/store/account";
import type { AccountState, Roadmap, RoadmapNode } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** Build a minimal node carrying only the fields the progress helper reads. */
function node(id: string): RoadmapNode {
  return {
    id,
    title: `Node ${id}`,
    order: 0,
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

function roadmap(id: string, nodeIds: string[]): Roadmap {
  return {
    id,
    careerPathId: "frontend",
    nodes: nodeIds.map(node),
    edges: [],
  };
}

// ---------------------------------------------------------------------------
// emptyAccountState
// ---------------------------------------------------------------------------

describe("emptyAccountState", () => {
  it("returns a clean, empty account state", () => {
    expect(emptyAccountState()).toEqual({
      completedNodes: {},
      savedToolIds: [],
      bookmarkedResourceIds: [],
      schemaVersion: 1,
    });
  });

  it("returns a fresh object each call (no shared references)", () => {
    const a = emptyAccountState();
    const b = emptyAccountState();
    a.savedToolIds.push("x");
    expect(b.savedToolIds).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// roadmapProgress (Req 11.4)
// ---------------------------------------------------------------------------

describe("roadmapProgress", () => {
  const rm = roadmap("r1", ["a", "b", "c", "d"]);

  it("is 0 when no nodes are completed", () => {
    expect(roadmapProgress(emptyAccountState(), rm)).toBe(0);
  });

  it("is 0 when the roadmap has no nodes", () => {
    expect(roadmapProgress(emptyAccountState(), roadmap("empty", []))).toBe(0);
  });

  it("is a rounded percentage for partial completion", () => {
    // 1 of 4 completed -> 25, 3 of 4 -> 75.
    const oneOfFour: AccountState = {
      ...emptyAccountState(),
      completedNodes: { r1: ["a"] },
    };
    const threeOfFour: AccountState = {
      ...emptyAccountState(),
      completedNodes: { r1: ["a", "b", "c"] },
    };
    expect(roadmapProgress(oneOfFour, rm)).toBe(25);
    expect(roadmapProgress(threeOfFour, rm)).toBe(75);
  });

  it("rounds to the nearest whole percent", () => {
    // 1 of 3 -> 33.33.. -> 33; 2 of 3 -> 66.66.. -> 67.
    const rm3 = roadmap("r3", ["a", "b", "c"]);
    expect(
      roadmapProgress({ ...emptyAccountState(), completedNodes: { r3: ["a"] } }, rm3),
    ).toBe(33);
    expect(
      roadmapProgress(
        { ...emptyAccountState(), completedNodes: { r3: ["a", "b"] } },
        rm3,
      ),
    ).toBe(67);
  });

  it("is 100 when all nodes are completed", () => {
    const all: AccountState = {
      ...emptyAccountState(),
      completedNodes: { r1: ["a", "b", "c", "d"] },
    };
    expect(roadmapProgress(all, rm)).toBe(100);
  });

  it("clamps to 100 and ignores ids not in the roadmap", () => {
    // Extra/duplicate ids must never push the percentage above 100.
    const noisy: AccountState = {
      ...emptyAccountState(),
      completedNodes: { r1: ["a", "a", "b", "c", "d", "ghost", "phantom"] },
    };
    expect(roadmapProgress(noisy, rm)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Add-then-remove inverse + idempotency (Req 11.2, 11.3, 11.7)
// ---------------------------------------------------------------------------

describe("completed-node helpers", () => {
  it("add-then-remove returns to the original state", () => {
    const start = emptyAccountState();
    const added = markNodeCompleted(start, "r1", "a");
    const removed = unmarkNodeCompleted(added, "r1", "a");
    expect(removed).toEqual(start);
  });

  it("marking an already-completed node is idempotent", () => {
    const once = markNodeCompleted(emptyAccountState(), "r1", "a");
    const twice = markNodeCompleted(once, "r1", "a");
    expect(twice).toEqual(once);
  });

  it("unmarking an absent node is a no-op", () => {
    const start = markNodeCompleted(emptyAccountState(), "r1", "a");
    expect(unmarkNodeCompleted(start, "r1", "missing")).toEqual(start);
  });

  it("removing the last node deletes the roadmap entry", () => {
    const state = markNodeCompleted(emptyAccountState(), "r1", "a");
    const after = unmarkNodeCompleted(state, "r1", "a");
    expect(after.completedNodes).toEqual({});
  });

  it("does not mutate the input state", () => {
    const start = emptyAccountState();
    markNodeCompleted(start, "r1", "a");
    expect(start.completedNodes).toEqual({});
  });
});

describe("saved-tool helpers", () => {
  it("add-then-remove returns to the original state", () => {
    const start = emptyAccountState();
    const added = saveTool(start, "tool-1");
    const removed = removeSavedTool(added, "tool-1");
    expect(removed).toEqual(start);
  });

  it("saving an already-saved tool is idempotent", () => {
    const once = saveTool(emptyAccountState(), "tool-1");
    expect(saveTool(once, "tool-1")).toEqual(once);
  });

  it("removing an absent tool is a no-op", () => {
    const start = saveTool(emptyAccountState(), "tool-1");
    expect(removeSavedTool(start, "missing")).toEqual(start);
  });

  it("removing a present tool deletes exactly that tool", () => {
    const state = saveTool(saveTool(emptyAccountState(), "a"), "b");
    expect(removeSavedTool(state, "a").savedToolIds).toEqual(["b"]);
  });
});

describe("bookmark helpers", () => {
  it("add-then-remove returns to the original state", () => {
    const start = emptyAccountState();
    const added = bookmarkResource(start, "res-1");
    const removed = removeBookmark(added, "res-1");
    expect(removed).toEqual(start);
  });

  it("bookmarking an already-bookmarked resource is idempotent", () => {
    const once = bookmarkResource(emptyAccountState(), "res-1");
    expect(bookmarkResource(once, "res-1")).toEqual(once);
  });

  it("removing an absent bookmark is a no-op", () => {
    const start = bookmarkResource(emptyAccountState(), "res-1");
    expect(removeBookmark(start, "missing")).toEqual(start);
  });
});
