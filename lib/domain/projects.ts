/**
 * DevAtlas projects domain logic (pure functions).
 *
 * This module holds the framework-independent logic for the Project Hub:
 *
 *   - `filterProjects`        — skill-level filtering for the Project Hub (Req 8.3, 8.4)
 *   - `projectDetailFields`   — pure projection of a project's detail fields (Req 8.2)
 *
 * Everything here is pure and deterministic so it can be exercised in isolation
 * by both example and property-based tests (design Correctness Properties 14-15).
 *
 * This module contains no React and no side effects.
 */

import type { Project, SkillLevel } from "./types";

// ---------------------------------------------------------------------------
// filterProjects (Req 8.3, 8.4 — Property 15)
// ---------------------------------------------------------------------------

/**
 * Filter a list of projects by a single selected skill level.
 *
 * When `level` is `null` no filter is active, so the full list is returned
 * (Req 8.4). Otherwise the result is exactly the projects classified at the
 * chosen level, excluding every project at any other level (Req 8.3).
 *
 * The input array is never mutated; a new array (preserving order) is returned.
 */
export function filterProjects(
  projects: Project[],
  level: SkillLevel | null,
): Project[] {
  if (level === null) {
    return [...projects];
  }

  return projects.filter((project) => project.skillLevel === level);
}

// ---------------------------------------------------------------------------
// projectDetailFields (Req 8.2 — Property 14)
// ---------------------------------------------------------------------------

/**
 * The detail fields projected for a Project's detail view (Req 8.2).
 *
 * All five fields are always present: description, required skills, estimated
 * completion time, recommended technology stack, and learning outcomes.
 */
export interface ProjectDetailFields {
  description: string;
  requiredSkills: string[];
  estimatedTime: string;
  techStack: string[];
  learningOutcomes: string[];
}

/**
 * Pure projection of a project's detail fields (Req 8.2).
 *
 * Returns exactly the five required detail fields so the presentation layer can
 * render a project's detail view without reaching into the full domain object.
 */
export function projectDetailFields(project: Project): ProjectDetailFields {
  return {
    description: project.description,
    requiredSkills: project.requiredSkills,
    estimatedTime: project.estimatedTime,
    techStack: project.techStack,
    learningOutcomes: project.learningOutcomes,
  };
}
