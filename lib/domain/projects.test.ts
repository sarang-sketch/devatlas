import { describe, it, expect } from "vitest";
import {
  filterProjects,
  projectDetailFields,
  type ProjectDetailFields,
} from "./projects";
import type { Project, SkillLevel } from "./types";

/**
 * Example (unit) tests for the projects domain logic.
 *
 * These cover concrete examples and edge cases for `filterProjects` (Req 8.3,
 * 8.4) and `projectDetailFields` (Req 8.2). The exhaustive across-all-inputs
 * guarantees live in the property tests (tasks 8.4 and 8.5).
 */

function makeProject(id: string, skillLevel: SkillLevel): Project {
  return {
    id,
    name: `Project ${id}`,
    skillLevel,
    description: `Description for ${id}`,
    requiredSkills: [`skill-${id}`],
    estimatedTime: "4 hours",
    techStack: [`tech-${id}`],
    learningOutcomes: [`outcome-${id}`],
    tags: [`tag-${id}`],
  };
}

const beginner = makeProject("b1", "Beginner");
const beginner2 = makeProject("b2", "Beginner");
const intermediate = makeProject("i1", "Intermediate");
const advanced = makeProject("a1", "Advanced");
const production = makeProject("p1", "Production-grade");

const allProjects: Project[] = [
  beginner,
  intermediate,
  beginner2,
  advanced,
  production,
];

describe("filterProjects (Req 8.3, 8.4)", () => {
  it("returns all projects when no level is selected (null)", () => {
    expect(filterProjects(allProjects, null)).toEqual(allProjects);
  });

  it("returns exactly the Beginner projects when Beginner is selected", () => {
    expect(filterProjects(allProjects, "Beginner")).toEqual([
      beginner,
      beginner2,
    ]);
  });

  it("returns exactly the Intermediate projects when Intermediate is selected", () => {
    expect(filterProjects(allProjects, "Intermediate")).toEqual([intermediate]);
  });

  it("returns exactly the Advanced projects when Advanced is selected", () => {
    expect(filterProjects(allProjects, "Advanced")).toEqual([advanced]);
  });

  it("returns exactly the Production-grade projects when Production-grade is selected", () => {
    expect(filterProjects(allProjects, "Production-grade")).toEqual([
      production,
    ]);
  });

  it("excludes all projects of other levels", () => {
    const result = filterProjects(allProjects, "Beginner");
    expect(result.every((p) => p.skillLevel === "Beginner")).toBe(true);
  });

  it("returns an empty list when no project matches the selected level", () => {
    expect(filterProjects([beginner, intermediate], "Advanced")).toEqual([]);
  });

  it("returns an empty list for an empty input regardless of level", () => {
    expect(filterProjects([], null)).toEqual([]);
    expect(filterProjects([], "Beginner")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [...allProjects];
    filterProjects(input, "Beginner");
    expect(input).toEqual(allProjects);
  });
});

describe("projectDetailFields (Req 8.2)", () => {
  it("projects all five required detail fields", () => {
    const fields: ProjectDetailFields = projectDetailFields(intermediate);
    expect(fields).toEqual({
      description: "Description for i1",
      requiredSkills: ["skill-i1"],
      estimatedTime: "4 hours",
      techStack: ["tech-i1"],
      learningOutcomes: ["outcome-i1"],
    });
  });

  it("includes exactly the five detail keys and nothing else", () => {
    const fields = projectDetailFields(intermediate);
    expect(Object.keys(fields).sort()).toEqual(
      [
        "description",
        "estimatedTime",
        "learningOutcomes",
        "requiredSkills",
        "techStack",
      ].sort(),
    );
  });
});
