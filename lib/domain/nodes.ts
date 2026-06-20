/**
 * Node-section domain logic.
 *
 * Pure, framework-independent helpers that report which sections a roadmap
 * node exposes and whether each section is empty. These drive the
 * placeholder-vs-items rendering decision in the presentation layer
 * (Req 5.2, Req 5.9) and are the target of correctness properties 6 and 7.
 *
 * This module contains no React and no side effects.
 */

import type { NodeSectionKey, RoadmapNode } from "./types";

/**
 * The six section keys every roadmap node exposes, in display order
 * (Req 5.2). The presentation layer renders sections in this order:
 * Learn, Practice, Build, Use, Deploy, Career.
 */
export const NODE_SECTION_KEYS: readonly NodeSectionKey[] = [
  "learn",
  "practice",
  "build",
  "use",
  "deploy",
  "career",
] as const;

/**
 * Returns exactly the six section keys present on a node, in display order.
 *
 * The result always equals the set {learn, practice, build, use, deploy,
 * career} (Property 6 / Req 5.2). A fresh array is returned so callers may
 * sort or mutate it without affecting the shared constant.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getSectionKeys(_node: RoadmapNode): NodeSectionKey[] {
  return [...NODE_SECTION_KEYS];
}

/**
 * Reports whether the given section of a node contains no items.
 *
 * `true` when the section's array has length 0 (render the no-content
 * placeholder), `false` when it has at least one item (render the items)
 * (Property 7 / Req 5.9).
 */
export function isSectionEmpty(node: RoadmapNode, key: NodeSectionKey): boolean {
  return node.sections[key].length === 0;
}

/**
 * Returns the section keys whose sections are empty (placeholder targets),
 * in display order.
 */
export function getEmptySectionKeys(node: RoadmapNode): NodeSectionKey[] {
  return NODE_SECTION_KEYS.filter((key) => isSectionEmpty(node, key));
}

/**
 * Returns the section keys whose sections contain at least one item
 * (items-rendering targets), in display order.
 */
export function getNonEmptySectionKeys(node: RoadmapNode): NodeSectionKey[] {
  return NODE_SECTION_KEYS.filter((key) => !isSectionEmpty(node, key));
}
