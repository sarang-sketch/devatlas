/**
 * Lightweight id → display-name lookups for the roadmap node panels.
 *
 * The `use` (tools) and `build` (projects) sections of a roadmap node store
 * only ids. These maps let the UI render human-readable names and decide
 * whether an id corresponds to a real catalog entry (so it can link to a
 * detail page) or is a free-form suggestion (rendered as plain text).
 */

import toolsData from "@/data/tools.json";
import projectsData from "@/data/projects.json";

interface NamedEntry {
  id: string;
  name: string;
}

/** Map of tool id → tool display name. */
export const TOOL_NAMES: Record<string, string> = Object.fromEntries(
  (toolsData as NamedEntry[]).map((t) => [t.id, t.name]),
);

/** Map of project id → project display name. */
export const PROJECT_NAMES: Record<string, string> = Object.fromEntries(
  (projectsData as NamedEntry[]).map((p) => [p.id, p.name]),
);

/**
 * Turn a kebab/snake-case id into a readable Title Case label, preserving a
 * few common acronyms. Used as a fallback when an id has no catalog entry.
 */
export function humanizeId(id: string): string {
  const ACRONYMS = new Set([
    "api",
    "ai",
    "ml",
    "ui",
    "ux",
    "css",
    "html",
    "sql",
    "cli",
    "os",
    "db",
    "ci",
    "cd",
    "seo",
    "qa",
    "id",
  ]);
  return id
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) =>
      ACRONYMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/** True when the id matches a real tool in the catalog. */
export function isKnownTool(id: string): boolean {
  return id in TOOL_NAMES;
}

/** True when the id matches a real project in the catalog. */
export function isKnownProject(id: string): boolean {
  return id in PROJECT_NAMES;
}
