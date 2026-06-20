/**
 * DevAtlas account / progress domain logic (pure functions).
 *
 * This module holds the framework-independent logic for the account state that
 * the Dashboard and providers build on. Everything here is pure and immutable —
 * no local-storage access lives here (that is the `LocalStore` wrapper's job).
 *
 *   - `emptyAccountState`     — a clean, empty account-state factory
 *   - `roadmapProgress`       — clamped percentage of completed nodes (Req 11.4)
 *   - mark/unmark/save/remove/bookmark helpers — immutable add/remove (Req 11.2, 11.3, 11.7)
 *
 * The add/remove helpers always return a NEW `AccountState`; adding an item that
 * is already present is idempotent, and removing an item that is absent is a
 * no-op. These guarantees underpin design Correctness Properties 22 & 24.
 */

import type { AccountState, Roadmap } from "@/lib/domain/types";

/** Current persisted account-state schema version. */
export const ACCOUNT_SCHEMA_VERSION = 1;

/**
 * Prototype-safe lookup of a roadmap's completed-node list.
 *
 * `completedNodes` is a plain object, so indexing it with an arbitrary
 * roadmap id that happens to be an inherited `Object.prototype` member name
 * (e.g. "valueOf", "toString", "constructor", "__proto__") would resolve to
 * the inherited value rather than `undefined`. Guarding with `hasOwnProperty`
 * ensures only own entries are returned, and any non-array own value is
 * treated as absent.
 */
function ownCompletedList(
  state: AccountState,
  roadmapId: string,
): string[] | undefined {
  if (!Object.prototype.hasOwnProperty.call(state.completedNodes, roadmapId)) {
    return undefined;
  }
  const value = state.completedNodes[roadmapId];
  return Array.isArray(value) ? value : undefined;
}

// ---------------------------------------------------------------------------
// emptyAccountState
// ---------------------------------------------------------------------------

/**
 * Build a fresh, empty account state.
 *
 * Used as the default for a brand-new visitor and as the clean fallback the
 * `LocalStore` wrapper returns when stored data cannot be read or parsed
 * (Req 11.9).
 */
export function emptyAccountState(): AccountState {
  return {
    completedNodes: {},
    savedToolIds: [],
    bookmarkedResourceIds: [],
    schemaVersion: ACCOUNT_SCHEMA_VERSION,
  };
}

// ---------------------------------------------------------------------------
// roadmapProgress (Req 11.4 — Property 22)
// ---------------------------------------------------------------------------

/**
 * Per-roadmap completion progress as a whole-number percentage.
 *
 * Returns `round(completed / total * 100)` clamped to the inclusive range
 * 0..100, where `total` is the roadmap's node count and `completed` is the
 * number of *distinct* nodes of that roadmap the user has marked completed.
 *
 *   - 0 when the roadmap has no nodes, or when none are completed.
 *   - 100 when every node is completed.
 *
 * Completion ids that do not correspond to a node in the roadmap are ignored so
 * the percentage can never exceed 100.
 */
export function roadmapProgress(state: AccountState, roadmap: Roadmap): number {
  const total = roadmap.nodes.length;
  if (total === 0) return 0;

  const nodeIds = new Set(roadmap.nodes.map((node) => node.id));
  const completedIds = ownCompletedList(state, roadmap.id) ?? [];

  const completed = new Set(
    completedIds.filter((id) => nodeIds.has(id)),
  ).size;

  const percent = Math.round((completed / total) * 100);
  return Math.max(0, Math.min(100, percent));
}

// ---------------------------------------------------------------------------
// Completed-node helpers (Req 11.2, 11.7 — Property 24)
// ---------------------------------------------------------------------------

/**
 * Mark a node within a roadmap as completed.
 *
 * Returns a new state; if the node is already recorded as completed for that
 * roadmap the operation is idempotent (an equal state is returned).
 */
export function markNodeCompleted(
  state: AccountState,
  roadmapId: string,
  nodeId: string,
): AccountState {
  const existing = ownCompletedList(state, roadmapId) ?? [];
  const next = existing.includes(nodeId) ? existing : [...existing, nodeId];

  return {
    ...state,
    completedNodes: { ...state.completedNodes, [roadmapId]: next },
  };
}

/**
 * Unmark a previously completed node.
 *
 * Removing a node that is not present is a no-op. When the last completed node
 * for a roadmap is removed, the roadmap's entry is deleted entirely so the
 * result is equal to the state before the node was ever marked (Property 24).
 */
export function unmarkNodeCompleted(
  state: AccountState,
  roadmapId: string,
  nodeId: string,
): AccountState {
  const existing = ownCompletedList(state, roadmapId);
  if (existing === undefined || !existing.includes(nodeId)) {
    return { ...state, completedNodes: { ...state.completedNodes } };
  }

  const filtered = existing.filter((id) => id !== nodeId);
  const completedNodes = { ...state.completedNodes };

  if (filtered.length === 0) {
    delete completedNodes[roadmapId];
  } else {
    completedNodes[roadmapId] = filtered;
  }

  return { ...state, completedNodes };
}

// ---------------------------------------------------------------------------
// Saved-tool helpers (Req 11.3, 11.7 — Property 24)
// ---------------------------------------------------------------------------

/** Save a tool; idempotent when the tool is already saved. */
export function saveTool(state: AccountState, toolId: string): AccountState {
  if (state.savedToolIds.includes(toolId)) {
    return { ...state, savedToolIds: [...state.savedToolIds] };
  }
  return { ...state, savedToolIds: [...state.savedToolIds, toolId] };
}

/** Remove a saved tool; a no-op when the tool is not saved. */
export function removeSavedTool(
  state: AccountState,
  toolId: string,
): AccountState {
  return {
    ...state,
    savedToolIds: state.savedToolIds.filter((id) => id !== toolId),
  };
}

// ---------------------------------------------------------------------------
// Bookmarked-resource helpers (Req 11.3, 11.7 — Property 24)
// ---------------------------------------------------------------------------

/** Bookmark a resource; idempotent when the resource is already bookmarked. */
export function bookmarkResource(
  state: AccountState,
  resourceId: string,
): AccountState {
  if (state.bookmarkedResourceIds.includes(resourceId)) {
    return { ...state, bookmarkedResourceIds: [...state.bookmarkedResourceIds] };
  }
  return {
    ...state,
    bookmarkedResourceIds: [...state.bookmarkedResourceIds, resourceId],
  };
}

/** Remove a bookmarked resource; a no-op when the resource is not bookmarked. */
export function removeBookmark(
  state: AccountState,
  resourceId: string,
): AccountState {
  return {
    ...state,
    bookmarkedResourceIds: state.bookmarkedResourceIds.filter(
      (id) => id !== resourceId,
    ),
  };
}
