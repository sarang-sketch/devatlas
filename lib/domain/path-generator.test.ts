import { describe, it, expect } from "vitest";
import {
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
  Roadmap,
  RoadmapNode,
  SkillLevel,
} from "./types";

/**
 * Example (unit) tests for the path-generator domain logic.
 *
 * These cover concrete examples and edge cases for `validatePathInput` (Req
 * 10.4, 10.5, 10.6) and `generatePath` (Req 10.2, 10.3). The exhaustive
 * across-all-inputs guarantees live in the property tests (tasks 10.3-10.5).
 */

// ---------------------------------------------------------------------------
// validatePathInput (Req 10.4, 10.5, 10.6)
// ---------------------------------------------------------------------------

describe("validatePathInput (Req 10.4, 10.5, 10.6)", () => {
  const validRaw: RawPathInput = {
    goal: "frontend",
    hoursPerWeek: "10",
    skillLevel: "Beginner",
  };

  it("accepts well-formed input and returns the parsed value", () => {
    const result = validatePathInput(validRaw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual<PathGeneratorInput>({
        goal: "frontend",
        hoursPerWeek: 10,
        skillLevel: "Beginner",
      });
    }
  });

  it("accepts the boundary hours 1 and 80", () => {
    expect(validatePathInput({ ...validRaw, hoursPerWeek: "1" }).ok).toBe(true);
    expect(validatePathInput({ ...validRaw, hoursPerWeek: "80" }).ok).toBe(true);
  });

  it("identifies a missing goal (Req 10.4)", () => {
    const result = validatePathInput({ ...validRaw, goal: null });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field)).toEqual(["goal"]);
    }
  });

  it("identifies an unsupported goal (Req 10.4)", () => {
    const result = validatePathInput({ ...validRaw, goal: "not-a-path" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field)).toEqual(["goal"]);
    }
  });

  it("identifies a missing skill level (Req 10.5)", () => {
    const result = validatePathInput({ ...validRaw, skillLevel: null });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field)).toEqual(["skillLevel"]);
    }
  });

  it("rejects hours below the range (Req 10.6)", () => {
    const result = validatePathInput({ ...validRaw, hoursPerWeek: "0" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field)).toEqual(["hoursPerWeek"]);
    }
  });

  it("rejects hours above the range (Req 10.6)", () => {
    const result = validatePathInput({ ...validRaw, hoursPerWeek: "81" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field)).toEqual(["hoursPerWeek"]);
    }
  });

  it("rejects non-integer hours (Req 10.6)", () => {
    expect(validatePathInput({ ...validRaw, hoursPerWeek: "12.5" }).ok).toBe(
      false,
    );
    expect(validatePathInput({ ...validRaw, hoursPerWeek: "abc" }).ok).toBe(
      false,
    );
    expect(validatePathInput({ ...validRaw, hoursPerWeek: "" }).ok).toBe(false);
  });

  it("reports every offending field when several are invalid", () => {
    const result = validatePathInput({
      goal: null,
      hoursPerWeek: "200",
      skillLevel: null,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((e) => e.field).sort()).toEqual(
        ["goal", "hoursPerWeek", "skillLevel"].sort(),
      );
      // every error carries a non-empty message
      expect(result.errors.every((e) => e.message.length > 0)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// generatePath (Req 10.2, 10.3)
// ---------------------------------------------------------------------------

function makeNode(id: string, order: number): RoadmapNode {
  return {
    id,
    title: `Node ${id}`,
    order,
    tags: [],
    sections: {
      learn: [
        {
          id: `learn-${id}`,
          name: `Learn ${id}`,
          url: `https://example.com/learn/${id}`,
          resourceType: "course",
          tags: [],
        },
      ],
      practice: [],
      build: [],
      use: [],
      deploy: [
        {
          id: `deploy-${id}`,
          name: `Deploy ${id}`,
          url: `https://example.com/deploy/${id}`,
          resourceType: "deployment",
          tags: [],
        },
      ],
      career: [],
    },
  };
}

const careerPath: CareerPath = {
  id: "frontend",
  name: "Frontend",
  description: "Frontend development path.",
  tags: ["frontend", "web"],
  roadmapId: "frontend",
};

// Eight nodes => two per skill level under the even distribution.
const roadmap: Roadmap = {
  id: "frontend",
  careerPathId: "frontend",
  nodes: [
    makeNode("n1", 1),
    makeNode("n2", 2),
    makeNode("n3", 3),
    makeNode("n4", 4),
    makeNode("n5", 5),
    makeNode("n6", 6),
    makeNode("n7", 7),
    makeNode("n8", 8),
  ],
  edges: [],
};

function makeProject(id: string, skillLevel: SkillLevel, tags: string[]): Project {
  return {
    id,
    name: `Project ${id}`,
    skillLevel,
    description: `Description ${id}`,
    requiredSkills: [],
    estimatedTime: "4 hours",
    techStack: [],
    learningOutcomes: [],
    tags,
  };
}

const tools = [
  {
    id: "t1",
    name: "Tool One",
    description: "A frontend tool.",
    category: "Hosting" as const,
    freeTier: "Free tier.",
    website: "https://example.com/tool",
    tags: ["frontend"],
  },
  {
    id: "t2",
    name: "Tool Two",
    description: "An unrelated tool.",
    category: "Databases" as const,
    freeTier: "Free tier.",
    website: "https://example.com/tool2",
    tags: ["backend"],
  },
];

const projects = [
  makeProject("p1", "Beginner", ["frontend"]),
  makeProject("p2", "Advanced", ["web"]),
  makeProject("p3", "Advanced", ["backend"]),
];

const content: PathContentBundle = {
  careerPath,
  roadmap,
  tools,
  projects,
};

describe("generatePath (Req 10.2, 10.3)", () => {
  it("provides all five required components (Req 10.2)", () => {
    const input: PathGeneratorInput = {
      goal: "frontend",
      hoursPerWeek: 10,
      skillLevel: "Beginner",
    };
    const path = generatePath(input, content);

    expect(path.goal).toBe("frontend");
    expect(Array.isArray(path.milestones)).toBe(true);
    expect(Array.isArray(path.projects)).toBe(true);
    expect(Array.isArray(path.resources)).toBe(true);
    expect(Array.isArray(path.tools)).toBe(true);
    expect(Array.isArray(path.deployment)).toBe(true);

    // With a Beginner floor, all eight milestones are present and populated.
    expect(path.milestones).toHaveLength(8);
    expect(path.resources.length).toBeGreaterThan(0);
    expect(path.deployment.length).toBeGreaterThan(0);
    // Only the tag-matching tool is recommended.
    expect(path.tools.map((t) => t.id)).toEqual(["t1"]);
  });

  it("never includes milestones below the chosen skill level (Req 10.3)", () => {
    const input: PathGeneratorInput = {
      goal: "frontend",
      hoursPerWeek: 10,
      skillLevel: "Advanced",
    };
    const path = generatePath(input, content);

    const floor = skillLevelRank("Advanced");
    expect(path.milestones.length).toBeGreaterThan(0);
    expect(
      path.milestones.every((m) => skillLevelRank(m.skillLevel) >= floor),
    ).toBe(true);
    // Even distribution of 8 nodes => Advanced + Production-grade = 4 milestones.
    expect(path.milestones).toHaveLength(4);
  });

  it("excludes projects below the chosen level and off-goal projects", () => {
    const input: PathGeneratorInput = {
      goal: "frontend",
      hoursPerWeek: 10,
      skillLevel: "Advanced",
    };
    const path = generatePath(input, content);

    // p1 is below Advanced; p3 does not share a tag with the path => only p2.
    expect(path.projects.map((p) => p.id)).toEqual(["p2"]);
  });

  it("does not mutate the input roadmap node order", () => {
    const before = roadmap.nodes.map((n) => n.id);
    generatePath(
      { goal: "frontend", hoursPerWeek: 5, skillLevel: "Beginner" },
      content,
    );
    expect(roadmap.nodes.map((n) => n.id)).toEqual(before);
  });
});
