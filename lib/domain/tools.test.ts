import { describe, it, expect } from "vitest";
import { filterTools, recommendTools, projectToolCardFields } from "./tools";
import type { CareerPath, Tool } from "./types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makeTool(overrides: Partial<Tool> & Pick<Tool, "id">): Tool {
  return {
    name: `Tool ${overrides.id}`,
    description: "A developer tool.",
    category: "Hosting",
    freeTier: "Generous free tier.",
    website: "https://example.com",
    tags: [],
    ...overrides,
  };
}

const vercel = makeTool({
  id: "vercel",
  name: "Vercel",
  category: "Hosting",
  tags: ["frontend", "hosting", "react"],
});
const supabase = makeTool({
  id: "supabase",
  name: "Supabase",
  category: "Databases",
  tags: ["backend", "database", "auth"],
});
const figma = makeTool({
  id: "figma",
  name: "Figma",
  category: "Design",
  tags: ["frontend", "design"],
});
const allTools = [vercel, supabase, figma];

// ---------------------------------------------------------------------------
// filterTools (Req 6.3, 6.6, 6.8)
// ---------------------------------------------------------------------------

describe("filterTools", () => {
  it("returns the full list for an empty filter (Req 6.3)", () => {
    expect(filterTools(allTools, { categories: [], tags: [] })).toEqual(allTools);
  });

  it("keeps tools whose category is among the selected categories (Req 6.6)", () => {
    const result = filterTools(allTools, {
      categories: ["Hosting", "Design"],
      tags: [],
    });
    expect(result).toEqual([vercel, figma]);
  });

  it("requires a tool to carry EVERY selected tag (conjunctive) (Req 6.6)", () => {
    const result = filterTools(allTools, {
      categories: [],
      tags: ["frontend", "react"],
    });
    // Only Vercel carries both "frontend" and "react".
    expect(result).toEqual([vercel]);
  });

  it("applies category membership AND conjunctive tags together (Req 6.6)", () => {
    const result = filterTools(allTools, {
      categories: ["Hosting", "Design"],
      tags: ["frontend"],
    });
    expect(result).toEqual([vercel, figma]);
  });

  it("returns an empty list when the combination matches nothing (Req 6.7)", () => {
    const result = filterTools(allTools, {
      categories: ["Databases"],
      tags: ["frontend"],
    });
    expect(result).toEqual([]);
  });

  it("returns the same full list when filters are cleared from any state (Req 6.8)", () => {
    const filtered = filterTools(allTools, { categories: ["Hosting"], tags: ["frontend"] });
    expect(filtered).not.toEqual(allTools);
    const cleared = filterTools(allTools, { categories: [], tags: [] });
    expect(cleared).toEqual(allTools);
  });

  it("does not mutate the input array", () => {
    const snapshot = [...allTools];
    filterTools(allTools, { categories: ["Hosting"], tags: [] });
    expect(allTools).toEqual(snapshot);
  });
});

// ---------------------------------------------------------------------------
// recommendTools (Req 7.1, 7.2, 7.3, 7.5)
// ---------------------------------------------------------------------------

describe("recommendTools", () => {
  const frontendPath: CareerPath = {
    id: "frontend",
    name: "Frontend",
    description: "Build user interfaces.",
    tags: ["frontend", "design"],
    roadmapId: "frontend",
  };

  it("returns exactly the tools sharing at least one tag with the path (Req 7.1)", () => {
    const result = recommendTools(frontendPath, allTools);
    // Vercel (frontend) and Figma (frontend, design) match; Supabase does not.
    expect(result).toEqual([vercel, figma]);
  });

  it("includes every tool tagged for the path (Req 7.2)", () => {
    const result = recommendTools(frontendPath, allTools);
    expect(result).toContain(vercel);
    expect(result).toContain(figma);
    expect(result).not.toContain(supabase);
  });

  it("returns an empty list when no tool shares a tag (Req 7.5)", () => {
    const blockchainPath: CareerPath = {
      id: "blockchain",
      name: "Blockchain",
      description: "Build decentralized apps.",
      tags: ["solidity", "web3"],
      roadmapId: "blockchain",
    };
    expect(recommendTools(blockchainPath, allTools)).toEqual([]);
  });

  it("returns an empty list when the path has no tags", () => {
    const taglessPath: CareerPath = {
      id: "cloud",
      name: "Cloud",
      description: "Operate cloud infrastructure.",
      tags: [],
      roadmapId: "cloud",
    };
    expect(recommendTools(taglessPath, allTools)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// projectToolCardFields (Req 6.2)
// ---------------------------------------------------------------------------

describe("projectToolCardFields", () => {
  it("always projects the required fields (Req 6.2)", () => {
    const fields = projectToolCardFields(supabase);
    expect(fields.name).toBe("Supabase");
    expect(fields.description).toBe(supabase.description);
    expect(fields.freeTier).toBe(supabase.freeTier);
    expect(fields.category).toBe("Databases");
    expect(fields.website).toBe(supabase.website);
  });

  it("includes alternatives and tags when defined and non-empty (Req 6.2)", () => {
    const tool = makeTool({
      id: "netlify",
      alternatives: ["Vercel", "Render"],
      tags: ["hosting"],
    });
    const fields = projectToolCardFields(tool);
    expect(fields.alternatives).toEqual(["Vercel", "Render"]);
    expect(fields.tags).toEqual(["hosting"]);
  });

  it("omits alternatives when undefined", () => {
    const tool = makeTool({ id: "no-alts", tags: ["x"] });
    const fields = projectToolCardFields(tool);
    expect("alternatives" in fields).toBe(false);
  });

  it("omits alternatives when defined but empty", () => {
    const tool = makeTool({ id: "empty-alts", alternatives: [], tags: ["x"] });
    const fields = projectToolCardFields(tool);
    expect("alternatives" in fields).toBe(false);
  });

  it("omits tags when empty", () => {
    const tool = makeTool({ id: "no-tags", tags: [] });
    const fields = projectToolCardFields(tool);
    expect("tags" in fields).toBe(false);
  });
});
