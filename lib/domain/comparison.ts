/**
 * DevAtlas tool-comparison domain logic (pure functions).
 *
 * This module holds the framework-independent logic for the Comparison View:
 *
 *   - `buildComparison` — build the side-by-side comparison table for a
 *     selection of tools (Req 9.1, 9.2, 9.3)
 *   - `canAddTool`      — whether another tool may be added (Req 9.5)
 *   - `canRemoveTool`   — whether a tool may be removed (Req 9.6)
 *
 * Everything here is pure and deterministic so it can be exercised in isolation
 * by both example and property-based tests (design Correctness Properties 16-18).
 *
 * This module contains no React and no side effects.
 */

import type { ComparisonRow, ComparisonTable, Tool } from "./types";

// ---------------------------------------------------------------------------
// Comparison selection bounds (Req 9.4, 9.5, 9.6)
// ---------------------------------------------------------------------------

/** A comparison requires at least this many tools (Req 9.6). */
export const MIN_COMPARISON_TOOLS = 2;

/** A comparison permits at most this many tools (Req 9.5). */
export const MAX_COMPARISON_TOOLS = 4;

// ---------------------------------------------------------------------------
// buildComparison (Req 9.1, 9.2, 9.3 — Properties 16, 17)
// ---------------------------------------------------------------------------

/**
 * Build the comparison table for a selection of tools.
 *
 * The table carries one column per selected tool in selection order (Req 9.1)
 * and exactly the seven fixed rows, in this order (Req 9.2):
 *
 *   1. Free Tier        (from `tool.freeTier`)
 *   2. Database         (`comparison.databaseSupport`)
 *   3. Authentication   (`comparison.authSupport`)
 *   4. Storage          (`comparison.storageSupport`)
 *   5. Realtime         (`comparison.realtimeSupport`)
 *   6. Pricing          (`comparison.pricing`)
 *   7. Learning Curve   (`comparison.learningCurve`)
 *
 * Each row's `values` array has exactly one entry per tool, positionally
 * aligned with `tools`. When a tool does not define an attribute the entry is
 * `null` so the presentation layer can render the unavailable-value
 * placeholder (Req 9.3).
 *
 * The "Free Tier" row reads `tool.freeTier`, which is always present on a Tool.
 * The remaining six rows read from the optional `tool.comparison` object; any
 * absent attribute (or an absent `comparison` object entirely) yields `null`.
 *
 * Assumes a valid selection of 2..4 tools (callers enforce the bounds via
 * `canAddTool` / `canRemoveTool`). The input array is never mutated.
 */
export function buildComparison(selected: Tool[]): ComparisonTable {
  const rows: ComparisonRow[] = [
    {
      label: "Free Tier",
      values: selected.map((tool) => tool.freeTier ?? null),
    },
    {
      label: "Database",
      values: selected.map((tool) => tool.comparison?.databaseSupport ?? null),
    },
    {
      label: "Authentication",
      values: selected.map((tool) => tool.comparison?.authSupport ?? null),
    },
    {
      label: "Storage",
      values: selected.map((tool) => tool.comparison?.storageSupport ?? null),
    },
    {
      label: "Realtime",
      values: selected.map((tool) => tool.comparison?.realtimeSupport ?? null),
    },
    {
      label: "Pricing",
      values: selected.map((tool) => tool.comparison?.pricing ?? null),
    },
    {
      label: "Learning Curve",
      values: selected.map((tool) => tool.comparison?.learningCurve ?? null),
    },
  ];

  return {
    tools: [...selected],
    rows,
  };
}

// ---------------------------------------------------------------------------
// canAddTool (Req 9.5 — Property 18)
// ---------------------------------------------------------------------------

/**
 * Whether another tool may be added to the comparison selection.
 *
 * Adding is permitted only while fewer than the maximum of four tools are
 * selected; once four are selected the addition must be withheld (Req 9.5).
 */
export function canAddTool(selectedCount: number): boolean {
  return selectedCount < MAX_COMPARISON_TOOLS;
}

// ---------------------------------------------------------------------------
// canRemoveTool (Req 9.6 — Property 18)
// ---------------------------------------------------------------------------

/**
 * Whether a tool may be removed from the comparison selection.
 *
 * Removing is permitted only while more than the minimum of two tools are
 * selected; removing when only two remain would leave fewer than two and must
 * be prevented (Req 9.6).
 */
export function canRemoveTool(selectedCount: number): boolean {
  return selectedCount > MIN_COMPARISON_TOOLS;
}
