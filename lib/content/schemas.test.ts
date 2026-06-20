import { describe, it, expect } from "vitest";

import {
  careerPathSchema,
  learningResourceSchema,
  projectSchema,
  roadmapSchema,
  toolSchema,
} from "@/lib/content/schemas";

describe("content schemas", () => {
  describe("careerPathSchema", () => {
    const validPath = {
      id: "frontend",
      name: "Frontend",
      description: "Build accessible, performant user interfaces for the web.",
      tags: ["frontend", "react"],
      roadmapId: "frontend",
    };

    it("parses a valid career path", () => {
      expect(careerPathSchema.parse(validPath)).toEqual(validPath);
    });

    it("rejects an unsupported career-path id", () => {
      const result = careerPathSchema.safeParse({ ...validPath, id: "robotics" });
      expect(result.success).toBe(false);
    });

    it("rejects a description longer than 200 characters", () => {
      const result = careerPathSchema.safeParse({
        ...validPath,
        description: "x".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("accepts a description of exactly 200 characters", () => {
      const result = careerPathSchema.safeParse({
        ...validPath,
        description: "x".repeat(200),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("roadmapSchema", () => {
    const validRoadmap = {
      id: "frontend",
      careerPathId: "frontend",
      nodes: [
        {
          id: "html",
          title: "HTML Fundamentals",
          order: 1,
          tags: ["html"],
          sections: {
            learn: [
              {
                id: "mdn-html",
                name: "MDN HTML",
                url: "https://developer.mozilla.org/",
                resourceType: "documentation",
                tags: ["html"],
              },
            ],
            practice: [],
            build: [{ projectId: "static-page" }],
            use: [{ toolId: "vscode" }],
            deploy: [],
            career: [],
          },
        },
      ],
      edges: [{ from: "html", to: "css" }],
    };

    it("parses a valid roadmap", () => {
      expect(roadmapSchema.parse(validRoadmap)).toEqual(validRoadmap);
    });

    it("rejects a roadmap missing a node section", () => {
      const broken = structuredClone(validRoadmap);
      // Remove a required section key.
      delete (broken.nodes[0].sections as Record<string, unknown>).career;
      expect(roadmapSchema.safeParse(broken).success).toBe(false);
    });
  });

  describe("toolSchema", () => {
    const validTool = {
      id: "supabase",
      name: "Supabase",
      description: "Open-source Firebase alternative.",
      category: "Databases",
      freeTier: "500MB database, 50k monthly active users.",
      website: "https://supabase.com",
      tags: ["database", "auth"],
    };

    it("parses a valid tool without optional fields", () => {
      expect(toolSchema.parse(validTool)).toEqual(validTool);
    });

    it("parses a valid tool with optional alternatives and comparison", () => {
      const withOptional = {
        ...validTool,
        alternatives: ["Firebase"],
        comparison: { databaseSupport: "Postgres", authSupport: "Built-in" },
      };
      expect(toolSchema.parse(withOptional)).toEqual(withOptional);
    });

    it("rejects an unsupported tool category", () => {
      const result = toolSchema.safeParse({ ...validTool, category: "Blockchain" });
      expect(result.success).toBe(false);
    });
  });

  describe("projectSchema", () => {
    const validProject = {
      id: "todo-app",
      name: "Todo App",
      skillLevel: "Beginner",
      description: "A simple task manager.",
      requiredSkills: ["HTML", "JavaScript"],
      estimatedTime: "4 hours",
      techStack: ["React"],
      learningOutcomes: ["State management"],
      tags: ["frontend"],
    };

    it("parses a valid project", () => {
      expect(projectSchema.parse(validProject)).toEqual(validProject);
    });

    it("rejects an unsupported skill level", () => {
      const result = projectSchema.safeParse({ ...validProject, skillLevel: "Expert" });
      expect(result.success).toBe(false);
    });
  });

  describe("learningResourceSchema", () => {
    it("parses a valid learning resource", () => {
      const resource = {
        id: "react-docs",
        name: "React Docs",
        url: "https://react.dev",
        resourceType: "documentation",
        tags: ["react"],
      };
      expect(learningResourceSchema.parse(resource)).toEqual(resource);
    });

    it("rejects an unsupported resource type", () => {
      const result = learningResourceSchema.safeParse({
        id: "x",
        name: "X",
        url: "https://x.dev",
        resourceType: "podcast",
        tags: [],
      });
      expect(result.success).toBe(false);
    });
  });
});
