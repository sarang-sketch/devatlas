/**
 * DevAtlas content loaders.
 *
 * This module turns the bundled static JSON data files into trusted domain
 * objects. Content ships as part of the bundle (no backend, Req 15.1, 15.2), so
 * the files are pulled in with build-time `import` statements and validated at
 * load time against the Zod schemas in `@/lib/content/schemas`.
 *
 * Two pieces make up the public surface:
 *
 * 1. `parseContent` — validates each raw entry independently with `safeParse`,
 *    collecting the conforming entries and counting the ones skipped (Req 15.4).
 * 2. The per-file loaders (`loadCareerPaths`, `loadRoadmap`, `loadTools`,
 *    `loadProjects`, `loadResources`) — each returns a discriminated
 *    {@link Result} so a single file's retrieve/parse failure is reported to the
 *    calling section without taking down the rest of the page (Req 15.3).
 *
 * Adding a conforming entry to one of the data files surfaces it on next load
 * with no other code changes (Req 15.5).
 */

import { z } from "zod";

import careerPathsData from "@/data/career-paths.json";
import projectsData from "@/data/projects.json";
import resourcesData from "@/data/resources.json";
import toolsData from "@/data/tools.json";

import aiEngineerRoadmap from "@/data/roadmaps/ai-engineer.json";
import backendRoadmap from "@/data/roadmaps/backend.json";
import blockchainRoadmap from "@/data/roadmaps/blockchain.json";
import cloudRoadmap from "@/data/roadmaps/cloud.json";
import computerScienceRoadmap from "@/data/roadmaps/computer-science.json";
import cybersecurityRoadmap from "@/data/roadmaps/cybersecurity.json";
import dataAnalystRoadmap from "@/data/roadmaps/data-analyst.json";
import dataScientistRoadmap from "@/data/roadmaps/data-scientist.json";
import devopsRoadmap from "@/data/roadmaps/devops.json";
import digitalMarketerRoadmap from "@/data/roadmaps/digital-marketer.json";
import embeddedSystemsRoadmap from "@/data/roadmaps/embedded-systems.json";
import frontendRoadmap from "@/data/roadmaps/frontend.json";
import fullstackRoadmap from "@/data/roadmaps/fullstack.json";
import gameDevRoadmap from "@/data/roadmaps/game-dev.json";
import mlEngineerRoadmap from "@/data/roadmaps/ml-engineer.json";
import mobileRoadmap from "@/data/roadmaps/mobile.json";
import qaEngineerRoadmap from "@/data/roadmaps/qa-engineer.json";
import uiUxDesignerRoadmap from "@/data/roadmaps/ui-ux-designer.json";

import {
  careerPathSchema,
  learningResourceSchema,
  projectSchema,
  roadmapSchema,
  toolSchema,
} from "@/lib/content/schemas";
import type {
  CareerPath,
  LearningResource,
  Project,
  Roadmap,
  Tool,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

/**
 * The discriminated result returned by every loader. On success the validated
 * `data` is carried; on failure a human-readable `error` identifies the
 * affected content so the owning section can degrade independently (Req 15.3).
 */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// parseContent
// ---------------------------------------------------------------------------

/**
 * Validate each entry of `raw` independently against `schema`, returning the
 * conforming entries and the count of the ones skipped.
 *
 * A non-conforming entry never aborts the whole batch: it is omitted and added
 * to `skipped`, while the conforming entries are kept (Req 15.4). Adding a new
 * conforming entry to the source therefore surfaces it here unchanged
 * (Req 15.5).
 */
export function parseContent<T>(
  schema: z.ZodType<T>,
  raw: unknown[],
): { valid: T[]; skipped: number } {
  const valid: T[] = [];
  let skipped = 0;

  for (const entry of raw) {
    const result = schema.safeParse(entry);
    if (result.success) {
      valid.push(result.data);
    } else {
      skipped += 1;
    }
  }

  return { valid, skipped };
}

// ---------------------------------------------------------------------------
// Per-file array loader helper
// ---------------------------------------------------------------------------

/**
 * Shared implementation for the array-backed loaders. Guards against a
 * top-level shape that is not an array (a retrieve/parse failure for the file)
 * and otherwise validates every entry, returning the conforming entries
 * (Req 15.3, 15.4).
 */
function loadArray<T>(
  schema: z.ZodType<T>,
  raw: unknown,
  label: string,
): Result<T[]> {
  if (!Array.isArray(raw)) {
    return {
      ok: false,
      error: `Failed to load ${label}: expected the data file to contain an array of entries.`,
    };
  }

  const { valid } = parseContent(schema, raw);
  return { ok: true, data: valid };
}

// ---------------------------------------------------------------------------
// Roadmap slug registry
// ---------------------------------------------------------------------------

/**
 * Maps a career-path slug to its imported (still unvalidated) roadmap JSON.
 * Because the roadmaps live in per-slug files, this registry lets
 * {@link loadRoadmap} resolve a roadmap by slug without dynamic file access.
 */
const roadmapsBySlug: Record<string, unknown> = {
  "ai-engineer": aiEngineerRoadmap,
  backend: backendRoadmap,
  blockchain: blockchainRoadmap,
  cloud: cloudRoadmap,
  "computer-science": computerScienceRoadmap,
  cybersecurity: cybersecurityRoadmap,
  "data-analyst": dataAnalystRoadmap,
  "data-scientist": dataScientistRoadmap,
  devops: devopsRoadmap,
  "digital-marketer": digitalMarketerRoadmap,
  "embedded-systems": embeddedSystemsRoadmap,
  frontend: frontendRoadmap,
  fullstack: fullstackRoadmap,
  "game-dev": gameDevRoadmap,
  "ml-engineer": mlEngineerRoadmap,
  mobile: mobileRoadmap,
  "qa-engineer": qaEngineerRoadmap,
  "ui-ux-designer": uiUxDesignerRoadmap,
};

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

/** Load and validate the twelve career paths (Req 4.1, 15.1). */
export function loadCareerPaths(): Result<CareerPath[]> {
  return loadArray(careerPathSchema, careerPathsData, "career paths");
}

/**
 * Load and validate a single roadmap by its slug. The whole roadmap object is
 * validated against {@link roadmapSchema}; a missing slug or a non-conforming
 * file is reported as a failure identifying the affected roadmap (Req 15.3).
 */
export function loadRoadmap(slug: string): Result<Roadmap> {
  const raw = roadmapsBySlug[slug];
  if (raw === undefined) {
    return {
      ok: false,
      error: `Failed to load roadmap "${slug}": no roadmap data file exists for that slug.`,
    };
  }

  const result = roadmapSchema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      error: `Failed to parse roadmap "${slug}": the data file does not conform to the roadmap schema.`,
    };
  }

  return { ok: true, data: result.data };
}

/** Load and validate the tools library (Req 6.1, 15.1). */
export function loadTools(): Result<Tool[]> {
  return loadArray(toolSchema, toolsData, "tools");
}

/** Load and validate the projects (Req 8.1, 15.1). */
export function loadProjects(): Result<Project[]> {
  return loadArray(projectSchema, projectsData, "projects");
}

/** Load and validate the learning resources (Req 3.1, 15.1). */
export function loadResources(): Result<LearningResource[]> {
  return loadArray(learningResourceSchema, resourcesData, "resources");
}
