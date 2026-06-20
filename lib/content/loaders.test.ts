import { describe, it, expect } from "vitest";
import { z } from "zod";

import {
  parseContent,
  loadCareerPaths,
  loadRoadmap,
  loadTools,
  loadProjects,
  loadResources,
  type Result,
} from "@/lib/content/loaders";
import {
  careerPathSchema,
  toolSchema,
} from "@/lib/content/schemas";

// A tiny schema standing in for real content schemas in the parseContent tests.
const itemSchema = z.object({
  id: z.string(),
  value: z.number(),
});

describe("parseContent", () => {
  it("keeps every conforming entry unchanged", () => {
    const raw = [
      { id: "a", value: 1 },
      { id: "b", value: 2 },
      { id: "c", value: 3 },
    ];

    const { valid, skipped } = parseContent(itemSchema, raw);

    expect(valid).toEqual(raw);
    expect(skipped).toBe(0);
  });

  it("skips non-conforming entries and counts them", () => {
    const raw = [
      { id: "a", value: 1 }, // valid
      { id: "b", value: "nope" }, // wrong value type
      { id: 5, value: 2 }, // wrong id type
      { value: 3 }, // missing id
      { id: "e", value: 4 }, // valid
    ];

    const { valid, skipped } = parseContent(itemSchema, raw);

    expect(valid).toEqual([
      { id: "a", value: 1 },
      { id: "e", value: 4 },
    ]);
    expect(skipped).toBe(3);
  });

  it("returns no entries and a zero skip count for an empty input", () => {
    const { valid, skipped } = parseContent(itemSchema, []);

    expect(valid).toEqual([]);
    expect(skipped).toBe(0);
  });

  it("surfaces a newly added conforming entry in its output (Req 15.5)", () => {
    const base = [{ id: "a", value: 1 }];
    const added = { id: "new", value: 99 };

    const { valid } = parseContent(itemSchema, [...base, added]);

    expect(valid).toContainEqual(added);
  });

  it("skips every entry when none conform", () => {
    const raw = [{ nope: true }, "string", 42, null];

    const { valid, skipped } = parseContent(itemSchema, raw);

    expect(valid).toEqual([]);
    expect(skipped).toBe(raw.length);
  });
});

// Helper: narrow a Result to its successful data or fail the test.
function expectOk<T>(result: Result<T>): T {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`expected ok result, got error: ${result.error}`);
  }
  return result.data;
}

describe("array loaders read bundled JSON into validated domain objects", () => {
  it("loadCareerPaths returns ok with the eighteen career paths (Req 4.1, 15.1)", () => {
    const paths = expectOk(loadCareerPaths());
    expect(paths).toHaveLength(18);
    for (const path of paths) {
      expect(path.description.length).toBeLessThanOrEqual(200);
    }
  });

  it("loadTools returns ok with a non-empty validated tool list (Req 6.1)", () => {
    const tools = expectOk(loadTools());
    expect(tools.length).toBeGreaterThan(0);
  });

  it("loadProjects returns ok with a non-empty validated project list (Req 8.1)", () => {
    const projects = expectOk(loadProjects());
    expect(projects.length).toBeGreaterThan(0);
  });

  it("loadResources returns ok with a validated resource list (Req 3.1)", () => {
    const resources = expectOk(loadResources());
    expect(Array.isArray(resources)).toBe(true);
  });
});

describe("loadRoadmap resolves roadmaps by slug", () => {
  it("returns ok for a known slug and validates the whole roadmap", () => {
    const roadmap = expectOk(loadRoadmap("frontend"));
    expect(roadmap.careerPathId).toBe("frontend");
    expect(roadmap.nodes.length).toBeGreaterThan(0);
  });

  it("returns an ok result for every supported career-path slug", () => {
    const slugs = [
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
    ];

    for (const slug of slugs) {
      expect(loadRoadmap(slug).ok).toBe(true);
    }
  });

  it("returns an error result identifying an unknown slug (Req 15.3)", () => {
    const result = loadRoadmap("does-not-exist");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("does-not-exist");
    }
  });
});

describe("loaders report per-file retrieve/parse failures", () => {
  // The array loaders are exercised through parseContent + the Array.isArray
  // guard via the public schemas, mirroring how a malformed top-level file
  // (not an array) and schema-invalid entries are handled.

  it("skips schema-invalid career-path entries while keeping conforming ones (Req 15.4)", () => {
    const raw = [
      {
        id: "frontend",
        name: "Frontend",
        description: "Build accessible, performant user interfaces for the web.",
        tags: ["frontend"],
        roadmapId: "frontend",
      },
      // invalid: unsupported id
      {
        id: "robotics",
        name: "Robotics",
        description: "Not a supported path.",
        tags: [],
        roadmapId: "robotics",
      },
    ];

    const { valid, skipped } = parseContent(careerPathSchema, raw);
    expect(valid).toHaveLength(1);
    expect(valid[0].id).toBe("frontend");
    expect(skipped).toBe(1);
  });

  it("skips a tool with an unsupported category (Req 15.4)", () => {
    const raw = [
      {
        id: "vercel",
        name: "Vercel",
        description: "Frontend hosting platform.",
        category: "Hosting",
        freeTier: "Generous hobby tier.",
        website: "https://vercel.com",
        tags: ["hosting"],
      },
      {
        id: "bad-tool",
        name: "Bad Tool",
        description: "Unsupported category.",
        category: "NotACategory",
        freeTier: "n/a",
        website: "https://example.com",
        tags: [],
      },
    ];

    const { valid, skipped } = parseContent(toolSchema, raw);
    expect(valid).toHaveLength(1);
    expect(skipped).toBe(1);
  });
});
