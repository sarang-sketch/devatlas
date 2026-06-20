/**
 * Property-based tests for the DevAtlas path-generator domain logic.
 *
 * Covers design Correctness Properties 19-21 for the pure functions in
 * `./path-generator`:
 *
 *   - Property 19 — a generated path provides all five components   (task 10.3, Req 10.2)
 *   - Property 20 — generated milestones never fall below the floor (task 10.4, Req 10.3)
 *   - Property 21 — path input validation accepts only well-formed  (task 10.5, Req 10.4-10.6)
 *
 * Each property is checked against fast-check-generated inputs and an
 * independent reference implementation.
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  CAREER_PATH_IDS,
  SKILL_LEVEL_ORDER,
  generatePath,
  skillLevelRank,
  validatePathInput,
  type PathContentBundle,
} from "./path-generator";
import type {
  CareerPath,
  PathGeneratorInput,
  Project,
  RawPathInput,
  ResourceLink,
  Roadmap,
  RoadmapNode,
  SkillLevel,
  Tool,
  ToolCategory,
} from "./types";

// ---------------------------------------------------------------------------
// Shared constants and universes
// ---------------------------------------------------------------------------

/** The four supported skill levels (Req 8.1), ascending. */
const SKILL_LEVELS: readonly SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
];

/** A small tag universe so paths, tools, and projects overlap meaningfully. */
const TAG_UNIVERSE = [
  "frontend",
  "backend",
  "ai",
  "ml",
  "cloud",
  "devops",
  "mobile",
  "security",
  "data",
  "web3",
];

/** The fourteen supported tool categories (Req 6.1). */
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
// Reference: validatePathInput (independent of the implementation)
// ---------------------------------------------------------------------------

const CAREER_PATH_ID_SET = new Set<string>(CAREER_PATH_IDS);
const SKILL_LEVEL_SET = new Set<string>(SKILL_LEVELS);

/**
 * Independent reference for which fields of a raw input are well-formed.
 * Mirrors the acceptance criteria (Req 10.4, 10.5, 10.6) without reusing the
 * implementation's logic.
 */
function referenceOffendingFields(raw: RawPathInput): Set<string> {
  const offending = new Set<string>();

  // Goal (Req 10.4): selected and a supported career path.
  if (raw.goal === null || !CAREER_PATH_ID_SET.has(raw.goal)) {
    offending.add("goal");
  }

  // Skill level (Req 10.5): selected and a supported level.
  if (raw.skillLevel === null || !SKILL_LEVEL_SET.has(raw.skillLevel)) {
    offending.add("skillLevel");
  }

  // Hours per week (Req 10.6): a whole number in 1..80 inclusive.
  const trimmed = raw.hoursPerWeek.trim();
  const isWhole = /^\d+$/.test(trimmed);
  const n = isWhole ? Number(trimmed) : Number.NaN;
  if (!(isWhole && n >= 1 && n <= 80)) {
    offending.add("hoursPerWeek");
  }

  return offending;
}

// ---------------------------------------------------------------------------
// Arbitraries — Property 21 (raw form input)
// ---------------------------------------------------------------------------

/** goal: a valid career-path id, null, or an arbitrary (likely invalid) string. */
const goalArb: fc.Arbitrary<string | null> = fc.oneof(
  fc.constantFrom(...CAREER_PATH_IDS),
  fc.constant(null),
  fc.string({ maxLength: 16 }),
);

/** skillLevel: a valid level or null (the only two real form states). */
const skillLevelOrNullArb: fc.Arbitrary<SkillLevel | null> = fc.oneof(
  fc.constantFrom(...SKILL_LEVELS),
  fc.constant(null),
);

/**
 * hoursPerWeek as a string spanning the relevant equivalence classes:
 * valid whole numbers in range, out-of-range whole numbers, non-integers,
 * non-numeric junk, and empty/whitespace.
 */
const hoursStringArb: fc.Arbitrary<string> = fc.oneof(
  // In-range whole numbers (possibly padded with whitespace).
  fc.integer({ min: 1, max: 80 }).map((n) => String(n)),
  fc.integer({ min: 1, max: 80 }).map((n) => `  ${n}  `),
  // Out-of-range whole numbers (incl. 0 and negatives).
  fc.integer({ min: -50, max: 0 }).map((n) => String(n)),
  fc.integer({ min: 81, max: 500 }).map((n) => String(n)),
  // Non-integer numerics.
  fc
    .float({ min: 0, max: 100, noNaN: true })
    .map((n) => String(n))
    .filter((s) => !/^\d+$/.test(s.trim())),
  // Non-numeric junk and empty/whitespace.
  fc.constantFrom("", "   ", "abc", "1.5", "1e2", "ten", "12px", "+3"),
  fc.string({ maxLength: 8 }),
);

const rawPathInputArb: fc.Arbitrary<RawPathInput> = fc.record({
  goal: goalArb,
  hoursPerWeek: hoursStringArb,
  skillLevel: skillLevelOrNullArb,
});

// ---------------------------------------------------------------------------
// Arbitraries — Properties 19 & 20 (content bundle + valid input)
// ---------------------------------------------------------------------------

const tagsArb: fc.Arbitrary<string[]> = fc
  .uniqueArray(fc.constantFrom(...TAG_UNIVERSE), {
    maxLength: TAG_UNIVERSE.length,
  })
  .map((t) => [...t]);

const resourceLinkArb: fc.Arbitrary<ResourceLink> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  url: fc.webUrl(),
  resourceType: fc.constantFrom(
    "course",
    "documentation",
    "video",
    "article",
    "challenge",
    "platform",
    "deployment",
    "career",
  ),
  tags: tagsArb,
});

/** A roadmap node carrying populated learn/deploy sections (the rest empty). */
function nodeArb(order: number): fc.Arbitrary<RoadmapNode> {
  return fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 20 }),
    order: fc.constant(order),
    tags: tagsArb,
    sections: fc.record({
      learn: fc.array(resourceLinkArb, { maxLength: 3 }),
      practice: fc.constant([]),
      build: fc.constant([]),
      use: fc.constant([]),
      deploy: fc.array(resourceLinkArb, { maxLength: 3 }),
      career: fc.constant([]),
    }),
  });
}

/** A roadmap with N (1..8) order-sequenced nodes and forward-only edges. */
const roadmapArb: fc.Arbitrary<Roadmap> = fc
  .integer({ min: 1, max: 8 })
  .chain((count) =>
    fc
      .tuple(...Array.from({ length: count }, (_, i) => nodeArb(i)))
      .map((nodes) => {
        const edges = nodes
          .slice(0, -1)
          .map((node, i) => ({ from: node.id, to: nodes[i + 1].id }));
        return {
          id: "roadmap-" + nodes[0].id,
          careerPathId: "frontend",
          nodes: [...nodes],
          edges,
        } satisfies Roadmap;
      }),
  );

const careerPathArb: fc.Arbitrary<CareerPath> = fc.record({
  id: fc.constantFrom(...CAREER_PATH_IDS),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 200 }),
  tags: tagsArb,
  roadmapId: fc.string({ minLength: 1, maxLength: 20 }),
});

const toolArb: fc.Arbitrary<Tool> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 50 }),
  category: fc.constantFrom(...SUPPORTED_CATEGORIES),
  freeTier: fc.string({ maxLength: 30 }),
  website: fc.webUrl(),
  tags: tagsArb,
});

const projectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  skillLevel: fc.constantFrom(...SKILL_LEVELS),
  description: fc.string({ maxLength: 50 }),
  requiredSkills: fc.array(fc.string({ maxLength: 10 }), { maxLength: 4 }),
  estimatedTime: fc.string({ maxLength: 10 }),
  techStack: fc.array(fc.string({ maxLength: 10 }), { maxLength: 4 }),
  learningOutcomes: fc.array(fc.string({ maxLength: 10 }), { maxLength: 4 }),
  tags: tagsArb,
});

const validInputArb: fc.Arbitrary<PathGeneratorInput> = fc.record({
  goal: fc.constantFrom(...CAREER_PATH_IDS),
  hoursPerWeek: fc.integer({ min: 1, max: 80 }),
  skillLevel: fc.constantFrom(...SKILL_LEVELS),
});

const bundleArb: fc.Arbitrary<PathContentBundle> = fc.record({
  careerPath: careerPathArb,
  roadmap: roadmapArb,
  tools: fc.array(toolArb, { maxLength: 15 }),
  projects: fc.array(projectArb, { maxLength: 15 }),
});

// ---------------------------------------------------------------------------
// Property 19 (task 10.3, Req 10.2)
// ---------------------------------------------------------------------------

describe("Property 19: Generated path contains all required components", () => {
  // **Validates: Requirements 10.2**
  it("provides milestones, projects, resources, tools, and deployment for valid input", () => {
    fc.assert(
      fc.property(validInputArb, bundleArb, (input, content) => {
        const path = generatePath(input, content);

        // All five components are provided as arrays.
        expect(Array.isArray(path.milestones)).toBe(true);
        expect(Array.isArray(path.projects)).toBe(true);
        expect(Array.isArray(path.resources)).toBe(true);
        expect(Array.isArray(path.tools)).toBe(true);
        expect(Array.isArray(path.deployment)).toBe(true);

        // The generated path echoes the requested goal.
        expect(path.goal).toBe(input.goal);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 20 (task 10.4, Req 10.3)
// ---------------------------------------------------------------------------

describe("Property 20: Generated milestones never fall below the chosen skill level", () => {
  // **Validates: Requirements 10.3**
  it("every milestone's skill-level rank is >= the input skill-level rank", () => {
    fc.assert(
      fc.property(validInputArb, bundleArb, (input, content) => {
        const path = generatePath(input, content);
        const floor = skillLevelRank(input.skillLevel);

        for (const milestone of path.milestones) {
          // Each milestone carries a supported skill level...
          expect(SKILL_LEVEL_ORDER).toContain(milestone.skillLevel);
          // ...and never falls below the chosen floor (Beginner < ... < Production-grade).
          expect(skillLevelRank(milestone.skillLevel)).toBeGreaterThanOrEqual(
            floor,
          );
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 21 (task 10.5, Req 10.4, 10.5, 10.6)
// ---------------------------------------------------------------------------

describe("Property 21: Path input validation accepts only well-formed input", () => {
  // **Validates: Requirements 10.4, 10.5, 10.6**
  it("succeeds iff goal + skill level present and time is a whole number in 1..80; failures identify the offending field(s)", () => {
    fc.assert(
      fc.property(rawPathInputArb, (raw) => {
        const result = validatePathInput(raw);
        const expectedOffending = referenceOffendingFields(raw);
        const shouldSucceed = expectedOffending.size === 0;

        expect(result.ok).toBe(shouldSucceed);

        if (result.ok) {
          // On success the parsed value reflects the (now trusted) raw input.
          expect(result.value.goal).toBe(raw.goal);
          expect(result.value.skillLevel).toBe(raw.skillLevel);
          expect(result.value.hoursPerWeek).toBe(Number(raw.hoursPerWeek.trim()));
        } else {
          // On failure the errors identify exactly the offending field(s).
          const reportedFields = new Set(result.errors.map((e) => e.field));
          expect(reportedFields).toEqual(expectedOffending);
          // Every reported error carries a human-readable message.
          for (const error of result.errors) {
            expect(typeof error.message).toBe("string");
            expect(error.message.length).toBeGreaterThan(0);
          }
        }
      }),
    );
  });
});
