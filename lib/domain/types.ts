/**
 * DevAtlas core domain types.
 *
 * These are the inferred, trusted domain types for all platform content and
 * user state. Each content type has a corresponding Zod schema (task 2.2) used
 * by the loaders to turn raw static JSON into these trusted shapes.
 *
 * This module contains type definitions only — no runtime logic.
 */

// ---------------------------------------------------------------------------
// Core Enumerations
// ---------------------------------------------------------------------------

/** The exactly eighteen supported career paths (Req 4.1). */
export type CareerPathId =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "ai-engineer"
  | "ml-engineer"
  | "data-scientist"
  | "devops"
  | "cloud"
  | "cybersecurity"
  | "game-dev"
  | "blockchain"
  | "computer-science"
  | "data-analyst"
  | "qa-engineer"
  | "embedded-systems"
  | "ui-ux-designer"
  | "digital-marketer";

/** The fifteen supported tool categories (Req 6.1). */
export type ToolCategory =
  | "AI"
  | "Hosting"
  | "Databases"
  | "Analytics"
  | "Auth"
  | "Storage"
  | "Monitoring"
  | "CI/CD"
  | "APIs"
  | "Design"
  | "Productivity"
  | "Testing"
  | "Security"
  | "Open Source"
  | "Domains";

/** The four supported project skill levels (Req 8.1). */
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Production-grade";

/** The nine search content-type groups (Req 3.1). */
export type ContentType =
  | "roadmap"
  | "node"
  | "technology"
  | "tool"
  | "database"
  | "api"
  | "hosting"
  | "ai-service"
  | "resource";

/** The six section keys exposed by every roadmap node (Req 5.2). */
export type NodeSectionKey = "learn" | "practice" | "build" | "use" | "deploy" | "career";

// ---------------------------------------------------------------------------
// Career Path & Roadmap
// ---------------------------------------------------------------------------

export interface CareerPath {
  id: CareerPathId;
  /** e.g. "Frontend". */
  name: string;
  /** <= 200 chars (Req 4.2). */
  description: string;
  /** Used for tool recommendation matching (Req 7). */
  tags: string[];
  roadmapId: string;
}

export interface Roadmap {
  id: string;
  careerPathId: CareerPathId;
  /** Ordered first -> last. */
  nodes: RoadmapNode[];
  /** Directed connectors (Req 5.1). */
  edges: RoadmapEdge[];
}

export interface RoadmapEdge {
  /** Source node id. */
  from: string;
  /** Target node id. */
  to: string;
}

export interface RoadmapNode {
  id: string;
  /** Skill/topic name. */
  title: string;
  /** Sequence position. */
  order: number;
  tags: string[];
  sections: {
    /** Courses, docs, videos, articles (Req 5.3). */
    learn: ResourceLink[];
    /** Challenges, exercises, platforms (Req 5.4). */
    practice: ResourceLink[];
    /** Project suggestions (Req 5.5). */
    build: ProjectRef[];
    /** Recommended free tools (Req 5.6). */
    use: ToolRef[];
    /** Deployment platforms (Req 5.7). */
    deploy: ResourceLink[];
    /** Interview, resume, job resources (Req 5.8). */
    career: ResourceLink[];
  };
}

export interface ResourceLink {
  id: string;
  name: string;
  /** External; opens in new tab (Req 5.10). */
  url: string;
  resourceType:
    | "course"
    | "documentation"
    | "video"
    | "article"
    | "challenge"
    | "platform"
    | "deployment"
    | "career";
  tags: string[];
}

export interface ProjectRef {
  projectId: string;
}

export interface ToolRef {
  toolId: string;
}

// ---------------------------------------------------------------------------
// Tool
// ---------------------------------------------------------------------------

export interface Tool {
  id: string;
  name: string;
  description: string;
  /** (Req 6.1). */
  category: ToolCategory;
  /** Free-tier details. */
  freeTier: string;
  /** External link (Req 6.2). */
  website: string;
  /** Optional (Req 6.2). */
  alternatives?: string[];
  /** Optional/empty allowed; drives filter + recommend (Req 6.6, 7). */
  tags: string[];
  /**
   * Comparison attributes (Req 9.2); any may be absent -> placeholder shown
   * (Req 9.3).
   */
  comparison?: {
    databaseSupport?: string;
    authSupport?: string;
    storageSupport?: string;
    realtimeSupport?: string;
    pricing?: string;
    learningCurve?: string;
  };
}

// ---------------------------------------------------------------------------
// Project & Learning Resource
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  /** Exactly one (Req 8.1). */
  skillLevel: SkillLevel;
  /** (Req 8.2). */
  description: string;
  requiredSkills: string[];
  estimatedTime: string;
  techStack: string[];
  learningOutcomes: string[];
  tags: string[];
}

export interface LearningResource {
  id: string;
  name: string;
  url: string;
  resourceType: ResourceLink["resourceType"];
  tags: string[];
}

// ---------------------------------------------------------------------------
// Search, Comparison, and Path Generator Models
// ---------------------------------------------------------------------------

export interface SearchableItem {
  id: string;
  name: string;
  type: ContentType;
  tags: string[];
  /** Navigation target (Req 3.5). */
  href: string;
}

export interface SearchIndex {
  items: SearchableItem[];
}

export type GroupedResults = Partial<Record<ContentType, SearchResult[]>>;

export interface SearchResult {
  id: string;
  name: string;
  type: ContentType;
  href: string;
}

export interface ToolFilter {
  categories: ToolCategory[];
  tags: string[];
}

export interface ComparisonRow {
  label: string;
  /** null -> placeholder. */
  values: (string | null)[];
}

export interface ComparisonTable {
  tools: Tool[];
  rows: ComparisonRow[];
}

export interface RawPathInput {
  goal: string | null;
  hoursPerWeek: string;
  skillLevel: SkillLevel | null;
}

export interface PathGeneratorInput {
  goal: CareerPathId;
  hoursPerWeek: number;
  skillLevel: SkillLevel;
}

export interface GeneratedPath {
  goal: CareerPathId;
  /** Excludes levels below input (Req 10.3). */
  milestones: Milestone[];
  projects: Project[];
  resources: ResourceLink[];
  tools: Tool[];
  deployment: ResourceLink[];
}

export interface Milestone {
  nodeId: string;
  title: string;
  skillLevel: SkillLevel;
}

// ---------------------------------------------------------------------------
// Account / Persistence Model
// ---------------------------------------------------------------------------

export interface AccountState {
  /** roadmapId -> nodeIds (Req 11.2, 11.4). */
  completedNodes: Record<string, string[]>;
  /** (Req 11.3). */
  savedToolIds: string[];
  /** (Req 11.3). */
  bookmarkedResourceIds: string[];
  schemaVersion: number;
}
