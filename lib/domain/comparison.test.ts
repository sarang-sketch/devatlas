import { describe, it, expect } from "vitest";
import {
  buildComparison,
  canAddTool,
  canRemoveTool,
  MIN_COMPARISON_TOOLS,
  MAX_COMPARISON_TOOLS,
} from "./comparison";
import type { Tool } from "./types";

/**
 * Example (unit) tests for the tool-comparison domain logic.
 *
 * These cover concrete examples and edge cases for `buildComparison` (Req 9.1,
 * 9.2, 9.3) and the selection bounds `canAddTool` / `canRemoveTool` (Req 9.5,
 * 9.6). The exhaustive across-all-inputs guarantees live in the property tests
 * (tasks 9.2, 9.3, 9.4).
 */

/** A tool with every comparison attribute populated. */
function fullTool(id: string): Tool {
  return {
    id,
    name: `Tool ${id}`,
    description: `Description for ${id}`,
    category: "Databases",
    freeTier: `free-tier-${id}`,
    website: `https://example.com/${id}`,
    tags: [`tag-${id}`],
    comparison: {
      databaseSupport: `db-${id}`,
      authSupport: `auth-${id}`,
      storageSupport: `storage-${id}`,
      realtimeSupport: `realtime-${id}`,
      pricing: `pricing-${id}`,
      learningCurve: `curve-${id}`,
    },
  };
}

/** A tool with no `comparison` object at all (every attribute absent). */
function bareTool(id: string): Tool {
  return {
    id,
    name: `Tool ${id}`,
    description: `Description for ${id}`,
    category: "Hosting",
    freeTier: `free-tier-${id}`,
    website: `https://example.com/${id}`,
    tags: [],
  };
}

const FIXED_ROW_LABELS = [
  "Free Tier",
  "Database",
  "Authentication",
  "Storage",
  "Realtime",
  "Pricing",
  "Learning Curve",
];

describe("buildComparison (Req 9.1, 9.2)", () => {
  it("builds one column per selected tool in selection order", () => {
    const a = fullTool("a");
    const b = fullTool("b");
    const c = fullTool("c");
    const table = buildComparison([a, b, c]);

    expect(table.tools).toEqual([a, b, c]);
    // Every row has exactly one value per tool, positionally aligned.
    for (const row of table.rows) {
      expect(row.values).toHaveLength(3);
    }
  });

  it("produces exactly the seven fixed rows in order", () => {
    const table = buildComparison([fullTool("a"), fullTool("b")]);
    expect(table.rows.map((row) => row.label)).toEqual(FIXED_ROW_LABELS);
  });

  it("reads each row from the matching tool attribute", () => {
    const table = buildComparison([fullTool("a"), fullTool("b")]);
    const byLabel = Object.fromEntries(
      table.rows.map((row) => [row.label, row.values]),
    );

    expect(byLabel["Free Tier"]).toEqual(["free-tier-a", "free-tier-b"]);
    expect(byLabel["Database"]).toEqual(["db-a", "db-b"]);
    expect(byLabel["Authentication"]).toEqual(["auth-a", "auth-b"]);
    expect(byLabel["Storage"]).toEqual(["storage-a", "storage-b"]);
    expect(byLabel["Realtime"]).toEqual(["realtime-a", "realtime-b"]);
    expect(byLabel["Pricing"]).toEqual(["pricing-a", "pricing-b"]);
    expect(byLabel["Learning Curve"]).toEqual(["curve-a", "curve-b"]);
  });

  it("supports the maximum of four tools", () => {
    const tools = [fullTool("a"), fullTool("b"), fullTool("c"), fullTool("d")];
    const table = buildComparison(tools);
    expect(table.tools).toHaveLength(4);
    table.rows.forEach((row) => expect(row.values).toHaveLength(4));
  });

  it("does not mutate the input selection array", () => {
    const tools = [fullTool("a"), fullTool("b")];
    const snapshot = [...tools];
    buildComparison(tools);
    expect(tools).toEqual(snapshot);
  });
});

describe("buildComparison missing-value placeholders (Req 9.3)", () => {
  it("renders null for every absent comparison attribute", () => {
    const table = buildComparison([bareTool("a"), bareTool("b")]);
    const byLabel = Object.fromEntries(
      table.rows.map((row) => [row.label, row.values]),
    );

    // freeTier is always present.
    expect(byLabel["Free Tier"]).toEqual(["free-tier-a", "free-tier-b"]);
    // The six comparison-backed rows are all null when comparison is absent.
    expect(byLabel["Database"]).toEqual([null, null]);
    expect(byLabel["Authentication"]).toEqual([null, null]);
    expect(byLabel["Storage"]).toEqual([null, null]);
    expect(byLabel["Realtime"]).toEqual([null, null]);
    expect(byLabel["Pricing"]).toEqual([null, null]);
    expect(byLabel["Learning Curve"]).toEqual([null, null]);
  });

  it("mixes present values and null placeholders per tool", () => {
    const partial: Tool = {
      ...bareTool("p"),
      comparison: { databaseSupport: "yes", pricing: "free" },
    };
    const table = buildComparison([fullTool("a"), partial]);
    const byLabel = Object.fromEntries(
      table.rows.map((row) => [row.label, row.values]),
    );

    expect(byLabel["Database"]).toEqual(["db-a", "yes"]);
    expect(byLabel["Pricing"]).toEqual(["pricing-a", "free"]);
    // Attributes absent on the partial tool become null.
    expect(byLabel["Authentication"]).toEqual(["auth-a", null]);
    expect(byLabel["Storage"]).toEqual(["storage-a", null]);
    expect(byLabel["Realtime"]).toEqual(["realtime-a", null]);
    expect(byLabel["Learning Curve"]).toEqual(["curve-a", null]);
  });
});

describe("canAddTool (Req 9.5)", () => {
  it("permits adding while fewer than four are selected", () => {
    expect(canAddTool(2)).toBe(true);
    expect(canAddTool(3)).toBe(true);
  });

  it("withholds adding at the maximum of four", () => {
    expect(canAddTool(MAX_COMPARISON_TOOLS)).toBe(false);
    expect(canAddTool(4)).toBe(false);
  });
});

describe("canRemoveTool (Req 9.6)", () => {
  it("withholds removing at the minimum of two", () => {
    expect(canRemoveTool(MIN_COMPARISON_TOOLS)).toBe(false);
    expect(canRemoveTool(2)).toBe(false);
  });

  it("permits removing while more than two are selected", () => {
    expect(canRemoveTool(3)).toBe(true);
    expect(canRemoveTool(4)).toBe(true);
  });
});
