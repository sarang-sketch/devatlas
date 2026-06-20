/**
 * DevAtlas content Zod schemas.
 *
 * These schemas mirror the trusted domain types in `@/lib/domain/types` and are
 * used by the content loaders to turn raw static JSON into validated domain
 * objects (Req 15.1, 15.4). Constrained fields are enforced at the schema level:
 * the twelve career-path ids, the fourteen tool categories, the four skill
 * levels, and the <=200-character career-path description (Req 4.1, 4.2, 6.1,
 * 8.1).
 *
 * Each schema's inferred type is asserted to be structurally identical to its
 * corresponding domain interface (see the type-level assertions at the bottom of
 * this file), so the schemas and the domain types cannot drift apart without a
 * compile error.
 */

import { z } from "zod";

import type {
  CareerPath,
  CareerPathId,
  ContentType,
  LearningResource,
  Project,
  ProjectRef,
  ResourceLink,
  Roadmap,
  RoadmapEdge,
  RoadmapNode,
  SkillLevel,
  Tool,
  ToolCategory,
  ToolRef,
} from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Core Enumerations
// ---------------------------------------------------------------------------

/** Exactly the twelve supported career-path ids (Req 4.1). */
export const careerPathIdSchema = z.enum([
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
]);

/** Exactly the fourteen supported tool categories (Req 6.1). */
/** Exactly the fifteen supported tool categories (Req 6.1). */
export const toolCategorySchema = z.enum([
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
  "Domains",
]);

/** Exactly the four supported skill levels (Req 8.1). */
export const skillLevelSchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
]);

/** The nine search content-type groups (Req 3.1). */
export const contentTypeSchema = z.enum([
  "roadmap",
  "node",
  "technology",
  "tool",
  "database",
  "api",
  "hosting",
  "ai-service",
  "resource",
]);

/** The resource-link kinds shared by ResourceLink and LearningResource. */
export const resourceTypeSchema = z.enum([
  "course",
  "documentation",
  "video",
  "article",
  "challenge",
  "platform",
  "deployment",
  "career",
]);

// ---------------------------------------------------------------------------
// Career Path & Roadmap
// ---------------------------------------------------------------------------

export const careerPathSchema = z.object({
  id: careerPathIdSchema,
  name: z.string(),
  // <= 200 chars (Req 4.2).
  description: z.string().max(200),
  tags: z.array(z.string()),
  roadmapId: z.string(),
});

export const resourceLinkSchema = z.object({
  id: z.string(),
  name: z.string(),
  // External; opens in a new tab (Req 5.10).
  url: z.string(),
  resourceType: resourceTypeSchema,
  tags: z.array(z.string()),
});

export const projectRefSchema = z.object({
  projectId: z.string(),
});

export const toolRefSchema = z.object({
  toolId: z.string(),
});

export const roadmapNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  tags: z.array(z.string()),
  // Every node exposes exactly the six sections (Req 5.2).
  sections: z.object({
    learn: z.array(resourceLinkSchema),
    practice: z.array(resourceLinkSchema),
    build: z.array(projectRefSchema),
    use: z.array(toolRefSchema),
    deploy: z.array(resourceLinkSchema),
    career: z.array(resourceLinkSchema),
  }),
});

export const roadmapEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const roadmapSchema = z.object({
  id: z.string(),
  careerPathId: careerPathIdSchema,
  // Ordered first -> last.
  nodes: z.array(roadmapNodeSchema),
  // Directed connectors (Req 5.1).
  edges: z.array(roadmapEdgeSchema),
});

// ---------------------------------------------------------------------------
// Tool
// ---------------------------------------------------------------------------

/** Comparison attributes (Req 9.2); any may be absent -> placeholder (Req 9.3). */
export const toolComparisonSchema = z.object({
  databaseSupport: z.string().optional(),
  authSupport: z.string().optional(),
  storageSupport: z.string().optional(),
  realtimeSupport: z.string().optional(),
  pricing: z.string().optional(),
  learningCurve: z.string().optional(),
});

export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  // One of the fourteen supported categories (Req 6.1).
  category: toolCategorySchema,
  freeTier: z.string(),
  website: z.string(),
  // Optional (Req 6.2).
  alternatives: z.array(z.string()).optional(),
  // Optional/empty allowed; drives filter + recommend (Req 6.6, 7).
  tags: z.array(z.string()),
  comparison: toolComparisonSchema.optional(),
});

// ---------------------------------------------------------------------------
// Project & Learning Resource
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Exactly one supported skill level (Req 8.1).
  skillLevel: skillLevelSchema,
  description: z.string(),
  requiredSkills: z.array(z.string()),
  estimatedTime: z.string(),
  techStack: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  tags: z.array(z.string()),
});

export const learningResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  resourceType: resourceTypeSchema,
  tags: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// Schema/domain consistency assertions
// ---------------------------------------------------------------------------
//
// These compile-time-only checks guarantee each schema's inferred type is
// structurally identical to its domain interface. If a schema and its domain
// type ever drift apart, `npx tsc --noEmit` fails here.

/** True iff A and B are mutually assignable (exact structural equality). */
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertType<_Check extends true>(): void {
  /* type-level only */
}

assertType<Equals<z.infer<typeof careerPathIdSchema>, CareerPathId>>();
assertType<Equals<z.infer<typeof toolCategorySchema>, ToolCategory>>();
assertType<Equals<z.infer<typeof skillLevelSchema>, SkillLevel>>();
assertType<Equals<z.infer<typeof contentTypeSchema>, ContentType>>();
assertType<Equals<z.infer<typeof careerPathSchema>, CareerPath>>();
assertType<Equals<z.infer<typeof resourceLinkSchema>, ResourceLink>>();
assertType<Equals<z.infer<typeof projectRefSchema>, ProjectRef>>();
assertType<Equals<z.infer<typeof toolRefSchema>, ToolRef>>();
assertType<Equals<z.infer<typeof roadmapNodeSchema>, RoadmapNode>>();
assertType<Equals<z.infer<typeof roadmapEdgeSchema>, RoadmapEdge>>();
assertType<Equals<z.infer<typeof roadmapSchema>, Roadmap>>();
assertType<Equals<z.infer<typeof toolSchema>, Tool>>();
assertType<Equals<z.infer<typeof projectSchema>, Project>>();
assertType<Equals<z.infer<typeof learningResourceSchema>, LearningResource>>();
