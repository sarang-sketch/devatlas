/**
 * Example unit tests for the node-section helpers (task 6.1).
 *
 * These cover specific examples and edge cases for the six-key set and
 * empty/non-empty detection. The universal property-based tests for the same
 * behavior live in tasks 6.2 (Property 6) and 6.3 (Property 7).
 */

import { describe, expect, it } from "vitest";

import {
  NODE_SECTION_KEYS,
  getEmptySectionKeys,
  getNonEmptySectionKeys,
  getSectionKeys,
  isSectionEmpty,
} from "./nodes";
import type { NodeSectionKey, RoadmapNode } from "./types";

/** Builds a node whose listed sections are non-empty; the rest are empty. */
function makeNode(nonEmpty: NodeSectionKey[]): RoadmapNode {
  const has = (key: NodeSectionKey) => nonEmpty.includes(key);
  return {
    id: "n1",
    title: "Node",
    order: 0,
    tags: [],
    sections: {
      learn: has("learn") ? [{ id: "l", name: "L", url: "#", resourceType: "course", tags: [] }] : [],
      practice: has("practice")
        ? [{ id: "p", name: "P", url: "#", resourceType: "challenge", tags: [] }]
        : [],
      build: has("build") ? [{ projectId: "proj-1" }] : [],
      use: has("use") ? [{ toolId: "tool-1" }] : [],
      deploy: has("deploy")
        ? [{ id: "d", name: "D", url: "#", resourceType: "deployment", tags: [] }]
        : [],
      career: has("career") ? [{ id: "c", name: "C", url: "#", resourceType: "career", tags: [] }] : [],
    },
  };
}

describe("NODE_SECTION_KEYS", () => {
  it("is exactly the six keys in display order", () => {
    expect(NODE_SECTION_KEYS).toEqual([
      "learn",
      "practice",
      "build",
      "use",
      "deploy",
      "career",
    ]);
  });
});

describe("getSectionKeys", () => {
  it("returns exactly the six section keys for a node", () => {
    const node = makeNode(["learn"]);
    expect(getSectionKeys(node)).toEqual([
      "learn",
      "practice",
      "build",
      "use",
      "deploy",
      "career",
    ]);
  });

  it("returns the same key set regardless of which sections are empty", () => {
    const full = makeNode(["learn", "practice", "build", "use", "deploy", "career"]);
    const empty = makeNode([]);
    expect(new Set(getSectionKeys(full))).toEqual(new Set(getSectionKeys(empty)));
  });

  it("returns a fresh array that does not alias the shared constant", () => {
    const node = makeNode([]);
    const keys = getSectionKeys(node);
    keys.push("learn");
    expect(NODE_SECTION_KEYS).toHaveLength(6);
  });
});

describe("isSectionEmpty", () => {
  it("reports true for a section with no items", () => {
    const node = makeNode(["learn"]);
    expect(isSectionEmpty(node, "practice")).toBe(true);
  });

  it("reports false for a section with at least one item", () => {
    const node = makeNode(["learn"]);
    expect(isSectionEmpty(node, "learn")).toBe(false);
  });

  it("detects non-empty build and use sections (ProjectRef/ToolRef arrays)", () => {
    const node = makeNode(["build", "use"]);
    expect(isSectionEmpty(node, "build")).toBe(false);
    expect(isSectionEmpty(node, "use")).toBe(false);
  });
});

describe("getEmptySectionKeys / getNonEmptySectionKeys", () => {
  it("partitions all six keys with no overlap", () => {
    const node = makeNode(["learn", "use", "career"]);
    const empty = getEmptySectionKeys(node);
    const nonEmpty = getNonEmptySectionKeys(node);

    expect(nonEmpty).toEqual(["learn", "use", "career"]);
    expect(empty).toEqual(["practice", "build", "deploy"]);
    expect([...empty, ...nonEmpty].sort()).toEqual([...NODE_SECTION_KEYS].sort());
    expect(empty.some((k) => nonEmpty.includes(k))).toBe(false);
  });

  it("returns all keys as empty when every section is empty", () => {
    const node = makeNode([]);
    expect(getEmptySectionKeys(node)).toEqual([...NODE_SECTION_KEYS]);
    expect(getNonEmptySectionKeys(node)).toEqual([]);
  });

  it("returns all keys as non-empty when every section has items", () => {
    const node = makeNode(["learn", "practice", "build", "use", "deploy", "career"]);
    expect(getNonEmptySectionKeys(node)).toEqual([...NODE_SECTION_KEYS]);
    expect(getEmptySectionKeys(node)).toEqual([]);
  });
});
