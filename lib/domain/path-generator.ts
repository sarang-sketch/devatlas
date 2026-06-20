/**
 * DevAtlas path-generator domain logic (pure functions).
 *
 * This module holds the framework-independent logic for the Learning Path
 * Generator:
 *
 *   - `skillLevelRank`     — the Beginner < Intermediate < Advanced <
 *                            Production-grade ordering (shared helper).
 *   - `validatePathInput`  — validates the raw goal/time/level form input,
 *                            returning the parsed input or the offending
 *                            field(s) (Req 10.4, 10.5, 10.6 — Property 21).
 *   - `generatePath`       — produces a personalized path (milestones,
 *                            projects, resources, tools, deployment) from a
 *                            valid input and a loaded content bundle, excluding
 *                            milestones below the chosen skill level
 *                            (Req 10.2, 10.3 — Properties 19 & 20).
 *
 * The core functions are pure and deterministic so they can be exercised in
 * isolation by both example and property-based tests. A thin, loader-backed
 * wrapper (`buildPath`) is provided for the presentation layer; it loads the
 * bundled content and delegates to the pure `generatePath`.
 *
 * Milestone skill-level assignment
 * --------------------------------
 * A roadmap node does not itself carry a skill level, so `generatePath` derives
 * one for each milestone by distributing the order-sorted nodes evenly across
 * the four skill levels. For `total` nodes, the node at (0-based) `index` is
 * assigned rank `min(3, floor(index * 4 / total))` under the ordering
 * Beginner(0) < Intermediate(1) < Advanced(2) < Production-grade(3). This places
 * earlier nodes at lower levels and later nodes at higher levels, matching the
 * first -> last learning sequence, and guarantees the skill-level floor (Req
 * 10.3) can be applied by a simple rank comparison.
 */

import {
  loadProjects,
  loadRoadmap,
  loadTools,
} from "@/lib/content/loaders";
import type { Result } from "@/lib/content/loaders";
import { getCareerPath } from "./catalog";
import { recommendTools } from "./tools";
import type {
  CareerPath,
  CareerPathId,
  GeneratedPath,
  Milestone,
  PathGeneratorInput,
  Project,
  RawPathInput,
  Roadmap,
  RoadmapNode,
  ResourceLink,
  SkillLevel,
  Tool,
} from "./types";

// ---------------------------------------------------------------------------
// Skill-level ordering
// ---------------------------------------------------------------------------

/**
 * The supported skill levels in ascending order:
 * Beginner < Intermediate < Advanced < Production-grade.
 */
export const SKILL_LEVEL_ORDER: readonly SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
] as const;

/**
 * Rank a skill level on the ordering Beginner(0) < Intermediate(1) <
 * Advanced(2) < Production-grade(3). Returns `-1` for an unrecognized value.
 */
export function skillLevelRank(level: SkillLevel): number {
  return SKILL_LEVEL_ORDER.indexOf(level);
}

/** The exactly eighteen supported career-path ids (Req 4.1). */
export const CAREER_PATH_IDS: readonly CareerPathId[] = [
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
] as const;

function isCareerPathId(value: string): value is CareerPathId {
  return (CAREER_PATH_IDS as readonly string[]).includes(value);
}

function isSkillLevel(value: SkillLevel | null): value is SkillLevel {
  return value !== null && (SKILL_LEVEL_ORDER as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// validatePathInput (Req 10.4, 10.5, 10.6 — Property 21)
// ---------------------------------------------------------------------------

/** A field that a validation failure can be attributed to. */
export type PathInputField = "goal" | "skillLevel" | "hoursPerWeek";

/** A single field-scoped validation error. */
export interface PathInputError {
  field: PathInputField;
  message: string;
}

/**
 * The result of validating raw form input: either the parsed, trusted value or
 * the list of offending fields with human-readable messages.
 */
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: PathInputError[] };

/**
 * Validate the raw goal/time/level form input (Req 10.4, 10.5, 10.6).
 *
 * Validation succeeds if and only if:
 *   - a goal is selected and is one of the supported career paths (Req 10.4),
 *   - a current skill level is selected (Req 10.5), and
 *   - the available time parses to a whole number of hours per week in the
 *     inclusive range 1..80 (Req 10.6).
 *
 * When it fails, every offending field is reported with a message; the result
 * never contains a partially-parsed value.
 */
export function validatePathInput(
  raw: RawPathInput,
): ValidationResult<PathGeneratorInput> {
  const errors: PathInputError[] = [];

  // Goal (Req 10.4): must be selected and a supported career path.
  const goalSelected = raw.goal !== null && isCareerPathId(raw.goal);
  if (!goalSelected) {
    errors.push({
      field: "goal",
      message: "Select a learning goal from the supported career paths.",
    });
  }

  // Skill level (Req 10.5): must be selected (and a supported level).
  const skillLevelSelected = isSkillLevel(raw.skillLevel);
  if (!skillLevelSelected) {
    errors.push({
      field: "skillLevel",
      message: "Select your current skill level.",
    });
  }

  // Hours per week (Req 10.6): a whole number in 1..80 inclusive.
  const trimmedHours = raw.hoursPerWeek.trim();
  const isWholeNumber = /^\d+$/.test(trimmedHours);
  const hours = isWholeNumber ? Number(trimmedHours) : Number.NaN;
  const hoursValid = isWholeNumber && hours >= 1 && hours <= 80;
  if (!hoursValid) {
    errors.push({
      field: "hoursPerWeek",
      message:
        "Enter your available time as a whole number of hours per week between 1 and 80.",
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      // Safe casts: the guards above proved these are well-formed.
      goal: raw.goal as CareerPathId,
      hoursPerWeek: hours,
      skillLevel: raw.skillLevel as SkillLevel,
    },
  };
}

// ---------------------------------------------------------------------------
// generatePath (Req 10.2, 10.3 — Properties 19 & 20)
// ---------------------------------------------------------------------------

/**
 * The loaded content `generatePath` needs to assemble a personalized path. It
 * is passed in (rather than loaded internally) so the core stays pure and
 * testable; `buildPath` provides the loader-backed wrapper.
 */
export interface PathContentBundle {
  /** The career path matching the input goal (drives tool recommendation). */
  careerPath: CareerPath;
  /** The roadmap for the goal; its nodes become the milestones. */
  roadmap: Roadmap;
  /** The full tools library, filtered to the goal's recommendations. */
  tools: Tool[];
  /** The full project list, filtered to the goal and skill-level floor. */
  projects: Project[];
}

/**
 * Derive the skill level for the order-sorted node at `index` of `total` nodes
 * by distributing nodes evenly across the four levels (see module doc).
 */
function milestoneLevelForIndex(index: number, total: number): SkillLevel {
  if (total <= 0) {
    return "Beginner";
  }
  const rank = Math.min(3, Math.floor((index * SKILL_LEVEL_ORDER.length) / total));
  return SKILL_LEVEL_ORDER[rank];
}

/**
 * Select the projects recommended for the goal at or above the chosen level.
 *
 * A project is recommended when it is classified at or above the input skill
 * level (consistent with the milestone floor, Req 10.3) and shares at least one
 * tag with the career path's tag set (tying it to the goal, Req 10.2). Order is
 * preserved from the input list.
 */
function recommendProjects(
  projects: Project[],
  careerPath: CareerPath,
  level: SkillLevel,
): Project[] {
  const inputRank = skillLevelRank(level);
  const pathTags = new Set(careerPath.tags);

  return projects.filter(
    (project) =>
      skillLevelRank(project.skillLevel) >= inputRank &&
      project.tags.some((tag) => pathTags.has(tag)),
  );
}

/**
 * Generate a personalized learning path from a valid input and a loaded content
 * bundle (Req 10.2, 10.3).
 *
 * The generated path always provides all five components — milestones,
 * recommended projects, learning resources, recommended tools, and deployment
 * recommendations (Req 10.2). Milestones are derived from the goal's roadmap
 * nodes (order-sorted, each assigned a skill level), and every milestone whose
 * derived level falls below the input skill level is excluded (Req 10.3).
 * Learning resources and deployment recommendations are gathered from the
 * Learn and Deploy sections of the included nodes; recommended tools come from
 * `recommendTools` over the goal's career path.
 *
 * Pure: no inputs are mutated and no side effects are performed.
 */
export function generatePath(
  input: PathGeneratorInput,
  content: PathContentBundle,
): GeneratedPath {
  const inputRank = skillLevelRank(input.skillLevel);

  const sortedNodes: RoadmapNode[] = [...content.roadmap.nodes].sort(
    (a, b) => a.order - b.order,
  );
  const total = sortedNodes.length;

  const milestones: Milestone[] = [];
  const includedNodes: RoadmapNode[] = [];

  sortedNodes.forEach((node, index) => {
    const level = milestoneLevelForIndex(index, total);
    // Exclude milestones classified below the chosen skill level (Req 10.3).
    if (skillLevelRank(level) >= inputRank) {
      milestones.push({ nodeId: node.id, title: node.title, skillLevel: level });
      includedNodes.push(node);
    }
  });

  const resources: ResourceLink[] = includedNodes.flatMap(
    (node) => node.sections.learn,
  );
  const deployment: ResourceLink[] = includedNodes.flatMap(
    (node) => node.sections.deploy,
  );
  const tools = recommendTools(content.careerPath, content.tools);
  const projects = recommendProjects(
    content.projects,
    content.careerPath,
    input.skillLevel,
  );

  return {
    goal: input.goal,
    milestones,
    projects,
    resources,
    tools,
    deployment,
  };
}

// ---------------------------------------------------------------------------
// buildPath — thin, loader-backed wrapper
// ---------------------------------------------------------------------------

/**
 * Loader-backed convenience wrapper for the presentation layer.
 *
 * Loads the goal's career path, roadmap, tools, and projects from the bundled
 * static content, then delegates to the pure {@link generatePath}. Returns a
 * discriminated {@link Result} so a content retrieve/parse failure is reported
 * to the caller rather than thrown (Req 15.3). The pure core remains the unit
 * of testing; this wrapper only wires loaded data into it.
 */
export function buildPath(input: PathGeneratorInput): Result<GeneratedPath> {
  const careerPath = getCareerPath(input.goal);
  if (careerPath === undefined) {
    return {
      ok: false,
      error: `Failed to generate path: no career path found for goal "${input.goal}".`,
    };
  }

  const roadmapResult = loadRoadmap(input.goal);
  if (!roadmapResult.ok) {
    return roadmapResult;
  }

  const toolsResult = loadTools();
  if (!toolsResult.ok) {
    return toolsResult;
  }

  const projectsResult = loadProjects();
  if (!projectsResult.ok) {
    return projectsResult;
  }

  return {
    ok: true,
    data: generatePath(input, {
      careerPath,
      roadmap: roadmapResult.data,
      tools: toolsResult.data,
      projects: projectsResult.data,
    }),
  };
}
