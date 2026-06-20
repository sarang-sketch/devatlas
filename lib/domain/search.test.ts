import { describe, it, expect } from "vitest";

import { buildSearchIndex, search, type ContentBundle } from "./search";
import type {
  CareerPath,
  LearningResource,
  Project,
  Roadmap,
  Tool,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const careerPaths: CareerPath[] = [
  {
    id: "frontend",
    name: "Frontend",
    description: "Build user interfaces.",
    tags: ["frontend", "web"],
    roadmapId: "frontend",
  },
];

const roadmaps: Roadmap[] = [
  {
    id: "frontend",
    careerPathId: "frontend",
    nodes: [
      {
        id: "html-css",
        title: "HTML & CSS",
        order: 1,
        tags: ["html", "css"],
        sections: { learn: [], practice: [], build: [], use: [], deploy: [], career: [] },
      },
      {
        id: "react",
        title: "React",
        order: 2,
        tags: ["react", "javascript"],
        sections: { learn: [], practice: [], build: [], use: [], deploy: [], career: [] },
      },
    ],
    edges: [{ from: "html-css", to: "react" }],
  },
];

const tools: Tool[] = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Postgres backend.",
    category: "Databases",
    freeTier: "Free tier.",
    website: "https://supabase.com",
    tags: ["database", "backend"],
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Frontend hosting.",
    category: "Hosting",
    freeTier: "Free tier.",
    website: "https://vercel.com",
    tags: ["hosting", "frontend"],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "ML model hub.",
    category: "AI",
    freeTier: "Free tier.",
    website: "https://huggingface.co",
    tags: ["ai", "ml"],
  },
  {
    id: "stripe-api",
    name: "Stripe API",
    description: "Payments API.",
    category: "APIs",
    freeTier: "Free tier.",
    website: "https://stripe.com",
    tags: ["api", "payments"],
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design tool.",
    category: "Design",
    freeTier: "Free tier.",
    website: "https://figma.com",
    tags: ["design"],
  },
];

const projects: Project[] = [
  {
    id: "todo-app",
    name: "Todo App",
    skillLevel: "Beginner",
    description: "A simple todo application.",
    requiredSkills: ["html", "css"],
    estimatedTime: "1 week",
    techStack: ["react"],
    learningOutcomes: ["state management"],
    tags: ["frontend", "starter"],
  },
];

const resources: LearningResource[] = [
  {
    id: "mdn",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    resourceType: "documentation",
    tags: ["web", "frontend"],
  },
];

const bundle: ContentBundle = { careerPaths, roadmaps, tools, projects, resources };

// ---------------------------------------------------------------------------
// buildSearchIndex
// ---------------------------------------------------------------------------

describe("buildSearchIndex (Req 3.1)", () => {
  it("produces exactly one searchable item per source item", () => {
    const index = buildSearchIndex(bundle);
    const nodeCount = roadmaps.reduce((sum, r) => sum + r.nodes.length, 0);
    const expected =
      careerPaths.length + nodeCount + tools.length + projects.length + resources.length;

    expect(index.items).toHaveLength(expected);
  });

  it("maps career paths to the roadmap type with a /roadmaps/{id} href", () => {
    const index = buildSearchIndex(bundle);
    const item = index.items.find((i) => i.id === "frontend" && i.type === "roadmap");

    expect(item).toBeDefined();
    expect(item?.href).toBe("/roadmaps/frontend");
  });

  it("maps roadmap nodes to the node type pointing at the roadmap slug", () => {
    const index = buildSearchIndex(bundle);
    const node = index.items.find((i) => i.id === "react" && i.type === "node");

    expect(node).toBeDefined();
    expect(node?.href).toBe("/roadmaps/frontend");
  });

  it("maps tools to specialized content types by category", () => {
    const index = buildSearchIndex(bundle);
    const typeOf = (id: string) => index.items.find((i) => i.id === id)?.type;

    expect(typeOf("supabase")).toBe("database");
    expect(typeOf("vercel")).toBe("hosting");
    expect(typeOf("huggingface")).toBe("ai-service");
    expect(typeOf("stripe-api")).toBe("api");
    expect(typeOf("figma")).toBe("tool");
  });

  it("maps projects to the technology type and resources to the resource type", () => {
    const index = buildSearchIndex(bundle);
    const project = index.items.find((i) => i.id === "todo-app");
    const resource = index.items.find((i) => i.id === "mdn");

    expect(project?.type).toBe("technology");
    expect(project?.href).toBe("/projects/todo-app");
    expect(resource?.type).toBe("resource");
    expect(resource?.href).toBe("https://developer.mozilla.org/");
  });

  it("can represent all nine content types from the seed bundle", () => {
    const index = buildSearchIndex(bundle);
    const types = new Set(index.items.map((i) => i.type));

    for (const t of [
      "roadmap",
      "node",
      "technology",
      "tool",
      "database",
      "api",
      "hosting",
      "ai-service",
      "resource",
    ] as const) {
      expect(types.has(t)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

describe("search (Req 3.2, 3.3, 3.6)", () => {
  const index = buildSearchIndex(bundle);

  it("matches names case-insensitively", () => {
    const results = search(index, "react");
    const upper = search(index, "REACT");

    expect(results.node?.map((r) => r.id)).toContain("react");
    expect(upper.node?.map((r) => r.id)).toContain("react");
  });

  it("matches on tags as well as names", () => {
    // "payments" is only a tag of the Stripe API tool, not its name.
    const results = search(index, "payments");

    expect(results.api?.map((r) => r.id)).toContain("stripe-api");
  });

  it("matches substrings, not just whole words", () => {
    const results = search(index, "fig");

    expect(results.tool?.map((r) => r.id)).toContain("figma");
  });

  it("groups every result under its own content type only", () => {
    const results = search(index, "frontend");

    for (const [type, group] of Object.entries(results)) {
      for (const result of group ?? []) {
        expect(result.type).toBe(type);
      }
    }
  });

  it("returns an empty object for a query shorter than two characters", () => {
    expect(search(index, "")).toEqual({});
    expect(search(index, "a")).toEqual({});
  });

  it("returns an empty object for a query longer than 100 characters", () => {
    expect(search(index, "x".repeat(101))).toEqual({});
  });

  it("accepts the boundary lengths of 2 and 100 characters", () => {
    // A 2-char query is evaluated (matches the "ml" tag on Hugging Face).
    expect(search(index, "ml")["ai-service"]?.map((r) => r.id)).toContain("huggingface");
    // A 100-char non-matching query returns an empty (but evaluated) object.
    expect(search(index, "z".repeat(100))).toEqual({});
  });

  it("returns an empty object when nothing matches an in-range query", () => {
    expect(search(index, "zzzznomatch")).toEqual({});
  });
});
