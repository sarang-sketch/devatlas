import { describe, it, expect } from "vitest";

import {
  getCareerPaths,
  getCareerPath,
  sortNodesByOrder,
  orderedNodeSequence,
  isForwardOrdered,
} from "@/lib/domain/catalog";
import { loadRoadmap } from "@/lib/content/loaders";
import type { CareerPathId, Roadmap, RoadmapNode } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** Build a minimal node carrying only the fields the ordering helpers read. */
function node(id: string, order: number): RoadmapNode {
  return {
    id,
    title: `Node ${id}`,
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

/** A small, well-formed, forward-ordered roadmap. */
const sampleRoadmap: Roadmap = {
  id: "sample",
  careerPathId: "frontend",
  nodes: [
    // Intentionally out of order to exercise the sort.
    node("c", 3),
    node("a", 1),
    node("b", 2),
  ],
  edges: [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    // A forward "skip" edge is still lower -> higher order.
    { from: "a", to: "c" },
  ],
};

// The eighteen supported career-path slugs.
const ALL_SLUGS: CareerPathId[] = [
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

// ---------------------------------------------------------------------------
// Ordering helpers
// ---------------------------------------------------------------------------

describe("sortNodesByOrder", () => {
  it("returns nodes sorted ascending by order", () => {
    const sorted = sortNodesByOrder(sampleRoadmap);
    expect(sorted.map((n) => n.id)).toEqual(["a", "b", "c"]);
    expect(sorted.map((n) => n.order)).toEqual([1, 2, 3]);
  });

  it("does not mutate the input roadmap's node array", () => {
    const before = sampleRoadmap.nodes.map((n) => n.id);
    sortNodesByOrder(sampleRoadmap);
    expect(sampleRoadmap.nodes.map((n) => n.id)).toEqual(before);
  });
});

describe("orderedNodeSequence", () => {
  it("returns the first -> last node sequence used by the renderer", () => {
    expect(orderedNodeSequence(sampleRoadmap).map((n) => n.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });
});

describe("isForwardOrdered", () => {
  it("accepts a roadmap with increasing orders and forward edges", () => {
    expect(isForwardOrdered(sampleRoadmap)).toBe(true);
  });

  it("treats an empty roadmap as vacuously forward-ordered", () => {
    expect(isForwardOrdered({ ...sampleRoadmap, nodes: [], edges: [] })).toBe(
      true,
    );
  });

  it("rejects duplicate node orders", () => {
    const roadmap: Roadmap = {
      ...sampleRoadmap,
      nodes: [node("a", 1), node("b", 1)],
      edges: [{ from: "a", to: "b" }],
    };
    expect(isForwardOrdered(roadmap)).toBe(false);
  });

  it("rejects a backward edge", () => {
    const roadmap: Roadmap = {
      ...sampleRoadmap,
      edges: [{ from: "c", to: "a" }],
    };
    expect(isForwardOrdered(roadmap)).toBe(false);
  });

  it("rejects a self edge", () => {
    const roadmap: Roadmap = {
      ...sampleRoadmap,
      edges: [{ from: "a", to: "a" }],
    };
    expect(isForwardOrdered(roadmap)).toBe(false);
  });

  it("rejects a dangling edge endpoint", () => {
    const roadmap: Roadmap = {
      ...sampleRoadmap,
      edges: [{ from: "a", to: "missing" }],
    };
    expect(isForwardOrdered(roadmap)).toBe(false);
  });

  it("holds for the bundled frontend roadmap", () => {
    const result = loadRoadmap("frontend");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(isForwardOrdered(result.data)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Catalog access
// ---------------------------------------------------------------------------

describe("getCareerPaths", () => {
  it("returns the eighteen validated career paths", () => {
    const result = getCareerPaths();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(18);
    }
  });

  it("each path has a loadable roadmap and a <=200-char description", () => {
    const result = getCareerPaths();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    for (const path of result.data) {
      expect(path.description.length).toBeLessThanOrEqual(200);
      expect(loadRoadmap(path.roadmapId).ok).toBe(true);
    }
  });

  it("exposes exactly the eighteen supported path ids", () => {
    const result = getCareerPaths();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(new Set(result.data.map((p) => p.id))).toEqual(new Set(ALL_SLUGS));
  });
});

describe("getCareerPath", () => {
  it("looks up an existing path by id", () => {
    const path = getCareerPath("frontend");
    expect(path?.id).toBe("frontend");
  });

  it("returns undefined for an id not in the catalog", () => {
    // Cast through unknown to exercise the not-found branch with a bad id.
    const path = getCareerPath("not-a-path" as unknown as CareerPathId);
    expect(path).toBeUndefined();
  });
});
