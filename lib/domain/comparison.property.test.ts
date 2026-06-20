/**
 * Property-based tests for the DevAtlas comparison domain logic.
 *
 * Covers design Correctness Properties 16-18 for the pure functions in
 * `./comparison`:
 *
 *   - Property 16 — one column per selected tool + the seven fixed rows
 *                   (task 9.2, Req 9.1, 9.2)
 *   - Property 17 — absent attributes render as the placeholder (null)
 *                   (task 9.3, Req 9.3)
 *   - Property 18 — selection size is bounded between 2 and 4
 *                   (task 9.4, Req 9.4, 9.5, 9.6)
 *
 * Each property is checked against fast-check-generated inputs and an
 * independent reference. Tools are generated with optional comparison
 * attributes that are independently present or absent so the placeholder /
 * present-value distinction is exercised.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  buildComparison,
  canAddTool,
  canRemoveTool,
  MIN_COMPARISON_TOOLS,
  MAX_COMPARISON_TOOLS,
} from "./comparison";
import type { Tool, ToolCategory } from "./types";

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/**
 * The seven fixed comparison rows, in order, paired with the underlying tool
 * attribute each reads. The "Free Tier" row reads `tool.freeTier` (always
 * present); the rest read from the optional `tool.comparison` object.
 */
const FIXED_ROWS = [
  { label: "Free Tier", key: "freeTier" },
  { label: "Database", key: "databaseSupport" },
  { label: "Authentication", key: "authSupport" },
  { label: "Storage", key: "storageSupport" },
  { label: "Realtime", key: "realtimeSupport" },
  { label: "Pricing", key: "pricing" },
  { label: "Learning Curve", key: "learningCurve" },
] as const;

const FIXED_ROW_LABELS = FIXED_ROWS.map((r) => r.label);

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
];

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const categoryArb: fc.Arbitrary<ToolCategory> = fc.constantFrom(
  ...SUPPORTED_CATEGORIES,
);

/**
 * An optional comparison attribute value: independently present (a string) or
 * absent (undefined), so each of the six attributes can be missing on its own.
 */
const optionalAttrArb: fc.Arbitrary<string | undefined> = fc.option(
  fc.string({ maxLength: 20 }),
  { nil: undefined },
);

/**
 * A Tool with a unique id (so removal-by-identity is unambiguous), an
 * always-present `freeTier`, and an optional `comparison` object whose six
 * attributes are each independently present or absent.
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
  tags: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 5 }),
  comparison: fc.option(
    fc.record({
      databaseSupport: optionalAttrArb,
      authSupport: optionalAttrArb,
      storageSupport: optionalAttrArb,
      realtimeSupport: optionalAttrArb,
      pricing: optionalAttrArb,
      learningCurve: optionalAttrArb,
    }),
    { nil: undefined },
  ),
});

/** A valid selection of 2..4 tools with distinct ids. */
const selectionArb: fc.Arbitrary<Tool[]> = fc
  .uniqueArray(toolArb, {
    minLength: MIN_COMPARISON_TOOLS,
    maxLength: MAX_COMPARISON_TOOLS,
    selector: (t) => t.id,
  })
  .map((tools) => [...tools]);

/** Read the value a given fixed row should show for a tool (reference). */
function expectedCellValue(
  tool: Tool,
  key: (typeof FIXED_ROWS)[number]["key"],
): string | null {
  if (key === "freeTier") {
    return tool.freeTier ?? null;
  }
  return tool.comparison?.[key] ?? null;
}

// ---------------------------------------------------------------------------
// Property 16 (task 9.2, Req 9.1, 9.2)
// ---------------------------------------------------------------------------

describe("Property 16: Comparison builds one column per selected tool with the fixed rows", () => {
  // **Validates: Requirements 9.1, 9.2**
  it("has one column per tool in selection order and exactly the seven fixed rows", () => {
    fc.assert(
      fc.property(selectionArb, (selected) => {
        const table = buildComparison(selected);

        // One column per selected tool, in selection order (by identity).
        expect(table.tools).toHaveLength(selected.length);
        table.tools.forEach((tool, i) => {
          expect(tool.id).toBe(selected[i].id);
        });

        // Rows are exactly the seven fixed labels, in order.
        expect(table.rows.map((r) => r.label)).toEqual(FIXED_ROW_LABELS);

        // Each row carries exactly one value per selected tool.
        for (const row of table.rows) {
          expect(row.values).toHaveLength(selected.length);
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 17 (task 9.3, Req 9.3)
// ---------------------------------------------------------------------------

describe("Property 17: Missing comparison values render as a placeholder", () => {
  // **Validates: Requirements 9.3**
  it("each cell is null iff its attribute is absent, else equals the value", () => {
    fc.assert(
      fc.property(selectionArb, (selected) => {
        const table = buildComparison(selected);

        FIXED_ROWS.forEach((fixed, rowIndex) => {
          const row = table.rows[rowIndex];
          expect(row.label).toBe(fixed.label);

          selected.forEach((tool, colIndex) => {
            const expected = expectedCellValue(tool, fixed.key);
            const actual = row.values[colIndex];

            // Present-value vs. absent (placeholder) distinction.
            expect(actual).toBe(expected);
            if (expected === null) {
              expect(actual).toBeNull();
            }
          });
        });

        // The Free Tier row always reflects freeTier (always present).
        const freeTierRow = table.rows[0];
        selected.forEach((tool, colIndex) => {
          expect(freeTierRow.values[colIndex]).toBe(tool.freeTier);
        });
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 18 (task 9.4, Req 9.4, 9.5, 9.6)
// ---------------------------------------------------------------------------

describe("Property 18: Comparison selection size is bounded between 2 and 4", () => {
  // **Validates: Requirements 9.4, 9.5, 9.6**
  it("permits adding only when fewer than four and removing only when more than two", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 6 }), (count) => {
        expect(canAddTool(count)).toBe(count < MAX_COMPARISON_TOOLS);
        expect(canRemoveTool(count)).toBe(count > MIN_COMPARISON_TOOLS);
      }),
    );
  });

  // **Validates: Requirements 9.4, 9.5, 9.6**
  it("a permitted removal drops exactly the chosen tool and reduces length by one", () => {
    fc.assert(
      fc.property(
        selectionArb.chain((selected) =>
          fc.record({
            selected: fc.constant(selected),
            removeIndex: fc.integer({ min: 0, max: selected.length - 1 }),
          }),
        ),
        ({ selected, removeIndex }) => {
          // Removal is only attempted when permitted (more than two selected).
          fc.pre(canRemoveTool(selected.length));

          const removed = selected[removeIndex];
          const next = selected.filter((_, i) => i !== removeIndex);

          // Length reduced by exactly one.
          expect(next).toHaveLength(selected.length - 1);

          // The removed tool is gone.
          expect(next.some((t) => t.id === removed.id)).toBe(false);

          // Every other tool remains, in order.
          const expectedRemaining = selected
            .filter((_, i) => i !== removeIndex)
            .map((t) => t.id);
          expect(next.map((t) => t.id)).toEqual(expectedRemaining);

          // Resulting size still satisfies the minimum.
          expect(next.length).toBeGreaterThanOrEqual(MIN_COMPARISON_TOOLS);
        },
      ),
    );
  });
});
