/**
 * DevAtlas career-path catalog and roadmap-ordering helpers.
 *
 * This module exposes validated access to the career-path catalog and a set of
 * pure helpers that reason about roadmap node ordering and edge direction. The
 * catalog accessors delegate to the content loaders (which validate the bundled
 * static JSON against the Zod schemas); the ordering helpers are pure and
 * operate only on the {@link Roadmap} passed in.
 *
 * Covered behavior:
 *
 * - {@link getCareerPaths} / {@link getCareerPath} — validated catalog access
 *   (Req 4.1, 4.2).
 * - {@link sortNodesByOrder} / {@link orderedNodeSequence} — the first -> last
 *   node sequence used by the renderer (Req 5.1).
 * - {@link isForwardOrdered} — confirms nodes strictly increase by `order` and
 *   every directed edge connects a lower-order node to a higher-order node, with
 *   no self/backward edges and no dangling node references (Req 5.1).
 *
 * See design.md Correctness Properties 4 and 5.
 */

import { loadCareerPaths } from "@/lib/content/loaders";
import type { Result } from "@/lib/content/loaders";
import type {
  CareerPath,
  CareerPathId,
  Roadmap,
  RoadmapNode,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Catalog access
// ---------------------------------------------------------------------------

/**
 * Return the validated career-path catalog as a discriminated {@link Result}.
 *
 * This is a thin pass-through over the content loader so consumers can reach the
 * catalog from the domain layer; the loader validates each entry against the
 * career-path schema and reports a per-file failure when the data file cannot be
 * read (Req 4.1, 15.3).
 */
export function getCareerPaths(): Result<CareerPath[]> {
  return loadCareerPaths();
}

/**
 * Look up a single career path by its id from the validated catalog.
 *
 * Returns the matching {@link CareerPath}, or `undefined` when no path has that
 * id or when the catalog itself failed to load.
 */
export function getCareerPath(id: CareerPathId): CareerPath | undefined {
  const result = loadCareerPaths();
  if (!result.ok) {
    return undefined;
  }
  return result.data.find((path) => path.id === id);
}

// ---------------------------------------------------------------------------
// Roadmap ordering helpers (pure)
// ---------------------------------------------------------------------------

/**
 * Return the roadmap's nodes sorted ascending by their `order` field.
 *
 * Pure: the input roadmap is not mutated — a new array is returned.
 */
export function sortNodesByOrder(roadmap: Roadmap): RoadmapNode[] {
  return [...roadmap.nodes].sort((a, b) => a.order - b.order);
}

/**
 * The first -> last node sequence the renderer walks when laying out a roadmap.
 *
 * This is the order-sorted node list (Req 5.1).
 */
export function orderedNodeSequence(roadmap: Roadmap): RoadmapNode[] {
  return sortNodesByOrder(roadmap);
}

/**
 * Report whether a roadmap is forward-ordered by its connectors (Req 5.1).
 *
 * Returns `true` iff:
 *
 * 1. the nodes have strictly increasing `order` once sorted (no duplicate
 *    orders), and
 * 2. every directed edge connects a lower-order node to a higher-order node —
 *    no self edge (`from === to`), no backward edge, and no edge that references
 *    a node id absent from the roadmap (no dangling references).
 *
 * An empty roadmap (no nodes, no edges) is vacuously forward-ordered.
 */
export function isForwardOrdered(roadmap: Roadmap): boolean {
  const sorted = sortNodesByOrder(roadmap);

  // (1) Nodes must strictly increase by order once sorted.
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].order <= sorted[i - 1].order) {
      return false;
    }
  }

  // Build an id -> order lookup so edge endpoints can be resolved.
  const orderById = new Map<string, number>();
  for (const node of roadmap.nodes) {
    orderById.set(node.id, node.order);
  }

  // (2) Every edge must go from a strictly lower order to a strictly higher one.
  for (const edge of roadmap.edges) {
    const fromOrder = orderById.get(edge.from);
    const toOrder = orderById.get(edge.to);

    // Dangling reference: an endpoint that is not a node in this roadmap.
    if (fromOrder === undefined || toOrder === undefined) {
      return false;
    }

    // Self or backward connector.
    if (fromOrder >= toOrder) {
      return false;
    }
  }

  return true;
}
