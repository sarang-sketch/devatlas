/**
 * Property-based tests for the DevAtlas projects domain logic
 * (`lib/domain/projects.ts`).
 *
 * Covers three correctness properties from design.md:
 *
 *   - Property 13 — every project has exactly one supported skill level (task 8.3, Req 8.1)
 *   - Property 14 — project detail shows all required fields           (task 8.4, Req 8.2)
 *   - Property 15 — project filtering selects exactly the chosen level (task 8.5, Req 8.3, 8.4)
 *
 * Each property is checked against fast-check-generated inputs and an
 * independent reference. Property 13 is additionally asserted over the real
 * loaded project set. The global fast-check config (numRuns = 100) is applied
 * in `vitest.setup.ts`.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import { filterProjects, projectDetailFields } from "./projects";
import type { Project, SkillLevel } from "./types";
import { loadProjects } from "@/lib/content/loaders";

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/** The four supported project skill levels (Req 8.1). */
const SUPPORTED_LEVELS: readonly SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
];

const SUPPORTED_LEVEL_SET = new Set<string>(SUPPORTED_LEVELS);

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const skillLevelArb: fc.Arbitrary<SkillLevel> = fc.constantFrom(
  ...SUPPORTED_LEVELS,
);

const stringListArb: fc.Arbitrary<string[]> = fc.array(
  fc.string({ minLength: 1, maxLength: 12 }),
  { maxLength: 5 },
);

/**
 * A Project with a random supported skill level and random fields. `id` is
 * unique per project so result membership can be compared by identity.
 */
const projectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  skillLevel: skillLevelArb,
  description: fc.string({ maxLength: 200 }),
  requiredSkills: stringListArb,
  estimatedTime: fc.string({ minLength: 1, maxLength: 20 }),
  techStack: stringListArb,
  learningOutcomes: stringListArb,
  tags: stringListArb,
});

const projectsArb: fc.Arbitrary<Project[]> = fc.array(projectArb, {
  maxLength: 25,
});

/** A selected level, or null for "no filter active". */
const levelOrNullArb: fc.Arbitrary<SkillLevel | null> = fc.option(
  skillLevelArb,
  { nil: null },
);

// ---------------------------------------------------------------------------
// Property 13 (task 8.3, Req 8.1)
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 13: Every project has exactly one supported skill level", () => {
  // **Validates: Requirements 8.1**

  it("Feature: devatlas, Property 13: Every project has exactly one supported skill level — each loaded project's level is one of the four (real data)", () => {
    const result = loadProjects();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.length).toBeGreaterThan(0);
    for (const project of result.data) {
      expect(SUPPORTED_LEVEL_SET.has(project.skillLevel)).toBe(true);
    }
  });

  it("Feature: devatlas, Property 13: Every project has exactly one supported skill level — holds for every generated project", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        expect(SUPPORTED_LEVEL_SET.has(project.skillLevel)).toBe(true);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 14 (task 8.4, Req 8.2)
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 14: Project detail shows all required fields", () => {
  // **Validates: Requirements 8.2**

  it("Feature: devatlas, Property 14: Project detail shows all required fields — the projection includes all five required fields equal to source", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const fields = projectDetailFields(project);

        // Exactly the five required detail fields, all present.
        expect(Object.keys(fields).sort()).toEqual(
          [
            "description",
            "estimatedTime",
            "learningOutcomes",
            "requiredSkills",
            "techStack",
          ].sort(),
        );

        // Each field equals its source value.
        expect(fields.description).toBe(project.description);
        expect(fields.requiredSkills).toEqual(project.requiredSkills);
        expect(fields.estimatedTime).toBe(project.estimatedTime);
        expect(fields.techStack).toEqual(project.techStack);
        expect(fields.learningOutcomes).toEqual(project.learningOutcomes);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 15 (task 8.5, Req 8.3, 8.4)
// ---------------------------------------------------------------------------

describe("Feature: devatlas, Property 15: Project filtering selects exactly the chosen level", () => {
  // **Validates: Requirements 8.3, 8.4**

  it("Feature: devatlas, Property 15: Project filtering selects exactly the chosen level — null returns all; a level returns exactly that level and excludes others", () => {
    fc.assert(
      fc.property(projectsArb, levelOrNullArb, (projects, level) => {
        const actual = filterProjects(projects, level);

        if (level === null) {
          // No filter active: the full list is returned (Req 8.4).
          expect(actual).toEqual(projects);
          return;
        }

        // Independent reference: exactly the projects at the chosen level.
        const expected = projects.filter((p) => p.skillLevel === level);
        expect(actual).toEqual(expected);

        // Every result is at the chosen level...
        for (const project of actual) {
          expect(project.skillLevel).toBe(level);
        }

        // ...and no project at another level is included.
        const includedIds = new Set(actual.map((p) => p.id));
        for (const project of projects) {
          if (project.skillLevel !== level) {
            expect(includedIds.has(project.id)).toBe(false);
          }
        }
      }),
    );
  });
});
