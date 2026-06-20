# Implementation Plan: DevAtlas

## Overview

This plan implements DevAtlas bottom-up: the content layer (typed/validated static JSON) and pure domain logic come first so the algorithmically interesting behavior can be property-tested in isolation, followed by the persistence layer and context providers, and finally the Next.js App Router presentation layer, SEO/sitemap, accessibility, error handling, and performance work. Each step builds on the previous ones and wires its output into the running app so there is no orphaned code. Property-based tests (fast-check) validate the 29 correctness properties and live next to the domain code they cover; example, integration, and smoke tests cover rendering, fault isolation, and non-functional concerns.

Stack: React + TypeScript on Next.js (App Router), Tailwind CSS, Shadcn UI, Framer Motion. Test runner: Vitest + fast-check + Testing Library.

## Tasks

- [x] 1. Scaffold project and test infrastructure
  - [x] 1.1 Initialize the Next.js + TypeScript + Tailwind + Shadcn UI + Framer Motion app
    - Create the Next.js App Router project with TypeScript and Tailwind CSS configured
    - Install and initialize Shadcn UI and add Framer Motion
    - Create the `app/`, `lib/{domain,content,store,seo}`, `data/`, and `components/` directory skeleton from the design's project structure
    - _Requirements: 14.3, 15.2_

  - [x] 1.2 Set up the test runner with fast-check and Testing Library
    - Configure Vitest (or Jest) with React Testing Library and jsdom
    - Add fast-check and a shared test setup with a minimum of 100 generated cases per property
    - Add `test` scripts and verify a placeholder test runs (use `--run`/single-execution mode, not watch)
    - _Requirements: 15.2_

- [x] 2. Build the content layer types, schemas, and loaders
  - [x] 2.1 Define core enumerations and domain TypeScript types
    - Add `CareerPathId` (exactly 12), `ToolCategory` (14), `SkillLevel` (4), `ContentType` (9), `NodeSectionKey` (6)
    - Add interfaces: `CareerPath`, `Roadmap`, `RoadmapEdge`, `RoadmapNode`, `ResourceLink`, `ProjectRef`, `ToolRef`, `Tool`, `Project`, `LearningResource`, and the search/comparison/path/account models
    - _Requirements: 4.1, 6.1, 8.1, 15.1_

  - [x] 2.2 Define Zod schemas mirroring the domain types
    - Write Zod schemas for `CareerPath`, `Roadmap`/`RoadmapNode`/`RoadmapEdge`, `Tool` (incl. optional `comparison`), `Project`, and `LearningResource`
    - Enforce constrained fields (12 path ids, 14 categories, 4 skill levels, description <= 200 chars) at the schema level
    - _Requirements: 4.1, 4.2, 6.1, 8.1, 15.1, 15.4_

  - [x] 2.3 Implement `parseContent` and the per-file data loaders
    - Implement `parseContent(schema, raw[])` returning `{ valid, skipped }`, validating each entry independently and skipping non-conforming entries
    - Implement loaders returning a discriminated result `{ ok: true, data } | { ok: false, error }` for career paths, roadmaps (by slug), tools, projects, and resources, reporting per-file retrieve/parse failures
    - _Requirements: 15.1, 15.3, 15.4, 15.5_

  - [x]* 2.4 Write property test for content validation
    - **Feature: devatlas, Property 29: Content validation keeps conforming entries and omits the rest** — parsing returns exactly the conforming entries, omits non-conforming ones, reports a skipped count equal to the number omitted, and includes any newly added conforming entry
    - **Validates: Requirements 15.4, 15.5**

- [x] 3. Author static JSON seed content
  - [x] 3.1 Create `data/career-paths.json` with the 12 career paths
    - Add exactly 12 `CareerPath` entries (frontend, backend, fullstack, mobile, ai-engineer, ml-engineer, data-scientist, devops, cloud, cybersecurity, game-dev, blockchain), each with name, <=200-char description, recommendation `tags`, and `roadmapId`
    - _Requirements: 4.1, 4.2, 7.1_

  - [x] 3.2 Create `data/roadmaps/<slug>.json` for each path
    - Author one roadmap per career path with ordered nodes and directed edges, each node exposing all six sections (learn, practice, build, use, deploy, career) with real seed links/refs (some sections intentionally empty to exercise placeholders)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

  - [x] 3.3 Create `data/tools.json` spanning the 14 categories
    - Add tools across all 14 categories with name, description, free-tier details, website, optional alternatives/tags, and optional `comparison` attributes (some absent to exercise placeholders)
    - _Requirements: 6.1, 6.2, 7.1, 9.2, 9.3_

  - [x] 3.4 Create `data/projects.json` across the 4 skill levels
    - Add projects classified across Beginner, Intermediate, Advanced, and Production-grade with description, required skills, estimated time, tech stack, learning outcomes, and tags
    - _Requirements: 8.1, 8.2_

  - [x] 3.5 Create `data/resources.json` learning resources
    - Add learning resources with name, url, resourceType, and tags for the resources listing and search index
    - _Requirements: 3.1, 15.1_

- [x] 4. Implement search domain logic
  - [x] 4.1 Implement `buildSearchIndex`, `search`, and result grouping
    - Build a searchable item per source item carrying its `ContentType` and `href`; implement case-insensitive substring matching on name/tags with the 2..100 char query bounds; group results by content type
    - _Requirements: 3.1, 3.2, 3.3, 3.6_

  - [x]* 4.2 Write property test for search index coverage
    - **Feature: devatlas, Property 1: Search index covers every content item** — exactly one searchable item per source item with a matching content type
    - **Validates: Requirements 3.1**

  - [x]* 4.3 Write property test for search matching and bounds
    - **Feature: devatlas, Property 2: Search returns exactly the case-insensitive substring matches** — for queries of length 2..100 results are exactly the case-insensitive name/tag substring matches; outside that range the result is empty
    - **Validates: Requirements 3.2, 3.6**

  - [x]* 4.4 Write property test for result grouping
    - **Feature: devatlas, Property 3: Search results are grouped by their own content type** — every result appears only in its own type group and no group holds a foreign type
    - **Validates: Requirements 3.3**

- [x] 5. Implement catalog and roadmap integrity logic
  - [x] 5.1 Implement career-path catalog and roadmap ordering helpers
    - Expose validated catalog access and helpers that confirm node ordering and forward-only edges from the loaded roadmaps
    - _Requirements: 4.1, 4.2, 5.1_

  - [x]* 5.2 Write property test for catalog integrity
    - **Feature: devatlas, Property 4: Career path catalog integrity** — path ids are exactly the 12 supported ids, each references a loadable roadmap, and each description is <=200 chars
    - **Validates: Requirements 4.1, 4.2**

  - [x]* 5.3 Write property test for roadmap ordering
    - **Feature: devatlas, Property 5: Roadmap nodes are forward-ordered by their connectors** — nodes strictly increase by `order` and every edge connects lower order to higher order
    - **Validates: Requirements 5.1**

- [x] 6. Implement node-section logic
  - [x] 6.1 Implement node section key and emptiness helpers
    - Provide helpers that return exactly the six section keys for a node and report whether each section is empty (driving placeholder vs. items rendering)
    - _Requirements: 5.2, 5.9_

  - [x]* 6.2 Write property test for section key set
    - **Feature: devatlas, Property 6: Every node exposes exactly the six sections** — the rendered section key set equals {learn, practice, build, use, deploy, career}
    - **Validates: Requirements 5.2**

  - [x]* 6.3 Write property test for placeholder vs items
    - **Feature: devatlas, Property 7: Empty sections show a placeholder, non-empty sections show items** — empty sections resolve to the placeholder, non-empty sections resolve to their items
    - **Validates: Requirements 5.9**

- [x] 7. Implement tools filtering and recommendation logic
  - [x] 7.1 Implement `filterTools`
    - Keep a tool iff (its category is among selected categories, or none selected) AND it carries every selected tag; empty filter returns the full list
    - _Requirements: 6.3, 6.6, 6.8_

  - [x] 7.2 Implement `recommendTools`
    - Return exactly the tools sharing at least one tag with the career path's tag set; empty when none match
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 7.3 Implement tool-card field projection helper
    - Provide a pure projection of a tool's display fields (always name/description/free-tier/category/website; alternatives and tags only when defined)
    - _Requirements: 6.2_

  - [x]* 7.4 Write property test for tool category validity
    - **Feature: devatlas, Property 8: Every tool belongs to a supported category** — each loaded tool's category is one of the 14 supported categories
    - **Validates: Requirements 6.1**

  - [x]* 7.5 Write property test for tool-card fields
    - **Feature: devatlas, Property 9: Tool card shows required fields always and optional fields when present** — required fields always projected; alternatives/tags projected exactly when defined
    - **Validates: Requirements 6.2**

  - [x]* 7.6 Write property test for tool filtering
    - **Feature: devatlas, Property 10: Tool filtering applies category membership and conjunctive tag matching** — a tool is included iff category matches (or none selected) and it carries every selected tag
    - **Validates: Requirements 6.6**

  - [x]* 7.7 Write property test for empty/cleared filters
    - **Feature: devatlas, Property 11: No active filters yields the full tool set** — no filters returns the full list and clearing filters from any state returns the same full list
    - **Validates: Requirements 6.3, 6.8**

  - [x]* 7.8 Write property test for recommendations
    - **Feature: devatlas, Property 12: Recommendations are exactly the tag-matching tools** — exactly the tools sharing >=1 tag with the path; empty when none
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5**

- [x] 8. Implement project filtering logic
  - [x] 8.1 Implement `filterProjects`
    - Return all projects when no level is selected; otherwise exactly the projects at the chosen level
    - _Requirements: 8.3, 8.4_

  - [x] 8.2 Implement project-detail field projection helper
    - Provide a pure projection of a project's detail fields (description, required skills, estimated time, tech stack, learning outcomes)
    - _Requirements: 8.2_

  - [x]* 8.3 Write property test for project skill level
    - **Feature: devatlas, Property 13: Every project has exactly one supported skill level** — each loaded project's level is exactly one of the four
    - **Validates: Requirements 8.1**

  - [x]* 8.4 Write property test for project-detail fields
    - **Feature: devatlas, Property 14: Project detail shows all required fields** — the projection includes all five required fields
    - **Validates: Requirements 8.2**

  - [x]* 8.5 Write property test for project filtering
    - **Feature: devatlas, Property 15: Project filtering selects exactly the chosen level** — no level returns all; a level returns exactly that level's projects and excludes others
    - **Validates: Requirements 8.3, 8.4**

- [x] 9. Implement comparison builder logic
  - [x] 9.1 Implement `buildComparison`, `canAddTool`, and `canRemoveTool`
    - Build one column per selected tool (selection order) with the fixed rows (free-tier, database, auth, storage, realtime, pricing, learning curve); render `null` for absent attributes; enforce add < 4 and remove > 2
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x]* 9.2 Write property test for comparison structure
    - **Feature: devatlas, Property 16: Comparison builds one column per selected tool with the fixed rows** — one column per tool in order and exactly the seven fixed rows
    - **Validates: Requirements 9.1, 9.2**

  - [x]* 9.3 Write property test for missing-value placeholders
    - **Feature: devatlas, Property 17: Missing comparison values render as a placeholder** — absent attributes resolve to the placeholder, present attributes resolve to their value
    - **Validates: Requirements 9.3**

  - [x]* 9.4 Write property test for selection bounds
    - **Feature: devatlas, Property 18: Comparison selection size is bounded between 2 and 4** — add permitted only when <4, remove only when >2, and a permitted removal drops exactly that tool
    - **Validates: Requirements 9.4, 9.5, 9.6**

- [x] 10. Implement path generator logic
  - [x] 10.1 Implement `validatePathInput`
    - Succeed iff a goal is selected, a skill level is selected, and hours is a whole number in 1..80; otherwise return the offending field
    - _Requirements: 10.4, 10.5, 10.6_

  - [x] 10.2 Implement `generatePath`
    - Produce milestones, recommended projects, learning resources, recommended tools, and deployment recommendations, excluding milestones below the input skill level
    - _Requirements: 10.2, 10.3_

  - [x]* 10.3 Write property test for generated components
    - **Feature: devatlas, Property 19: Generated path contains all required components** — milestones, projects, resources, tools, and deployment are all provided for valid input
    - **Validates: Requirements 10.2**

  - [x]* 10.4 Write property test for skill-level floor
    - **Feature: devatlas, Property 20: Generated milestones never fall below the chosen skill level** — every milestone level >= input level under Beginner < Intermediate < Advanced < Production-grade
    - **Validates: Requirements 10.3**

  - [x]* 10.5 Write property test for input validation
    - **Feature: devatlas, Property 21: Path input validation accepts only well-formed input** — valid iff goal + skill level present and time is a whole number in 1..80; failures identify the offending field
    - **Validates: Requirements 10.4, 10.5, 10.6**

- [x] 11. Checkpoint - domain layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement persistence layer and progress logic
  - [x] 12.1 Implement the `LocalStore` wrapper
    - Wrap local storage with `typeof window` guards; catch `setItem` failures (set a persistence-error flag, keep session state) and catch read/parse/corrupt-data failures (return a clean empty state)
    - _Requirements: 11.6, 11.8, 11.9, 12.7_

  - [x] 12.2 Implement `roadmapProgress` and account mutation helpers
    - Implement `roadmapProgress` as `round(completed/total*100)` clamped 0..100, plus pure add/remove helpers for completed nodes, saved tools, and bookmarks
    - _Requirements: 11.2, 11.3, 11.4, 11.7_

  - [x]* 12.3 Write property test for progress
    - **Feature: devatlas, Property 22: Roadmap progress is a clamped percentage of completed nodes** — equals round(completed/total*100), within 0..100, 0 when none and 100 when all
    - **Validates: Requirements 11.4**

  - [x]* 12.4 Write property test for persist/restore round trip
    - **Feature: devatlas, Property 23: Account state survives a persist/restore round trip** — serialize then restore yields an equal account state
    - **Validates: Requirements 11.2, 11.3, 11.6**

  - [x]* 12.5 Write property test for add-then-remove
    - **Feature: devatlas, Property 24: Add-then-remove returns to the prior state** — adding then removing an item restores the original; removing a present item deletes exactly that item
    - **Validates: Requirements 11.7**

- [x] 13. Implement theme and account context providers
  - [x] 13.1 Implement theme resolution and `ThemeProvider`
    - Implement `resolveTheme` (light default when nothing stored) and a `ThemeProvider` that persists selection via `LocalStore` and exposes a `persistenceError` flag
    - _Requirements: 12.1, 12.3, 12.6, 12.7_

  - [x] 13.2 Implement `AccountProvider`
    - Wire the account state, mark/unmark/save/remove/bookmark actions to `LocalStore`, restore on mount, and expose `persistenceError`/`readError` flags
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6, 11.7, 11.8, 11.9_

  - [x]* 13.3 Write property test for theme persistence
    - **Feature: devatlas, Property 25: Theme persistence round trip and default resolution** — store-then-resolve returns the same theme; resolves to light when none stored
    - **Validates: Requirements 12.1, 12.3, 12.6**

- [x] 14. Define design tokens and contrast palette
  - [x] 14.1 Define the Tailwind/Shadcn design-token palettes
    - Define a single typography/spacing scale and the light + dark color tokens, including all text-on-background token pairs
    - _Requirements: 12.1, 12.2_

  - [x]* 14.2 Write property test for contrast thresholds
    - **Feature: devatlas, Property 26: Design-token text/background pairs meet contrast thresholds** — each pair is >=4.5:1 for small text and >=3:1 for large/bold text, in both palettes
    - **Validates: Requirements 13.4, 13.5**

- [x] 15. Implement SEO metadata and sitemap
  - [x] 15.1 Implement metadata helpers, defaults, and a public-route registry
    - Provide per-route title (1..60) and description (50..160) resolution with defaults applied when a route defines neither, and a registry distinguishing public from non-public routes
    - _Requirements: 14.2, 14.5_

  - [x] 15.2 Implement `app/sitemap.ts`
    - Generate a sitemap from the route registry listing every public route and excluding non-public routes
    - _Requirements: 14.4_

  - [x]* 15.3 Write property test for route metadata
    - **Feature: devatlas, Property 27: Every route exposes valid, unique SEO metadata** — titles 1..60, descriptions 50..160 (defaults applied), and titles unique across public routes
    - **Validates: Requirements 14.2, 14.5**

  - [x]* 15.4 Write property test for sitemap coverage
    - **Feature: devatlas, Property 28: Sitemap lists exactly the public routes** — contains every public route and no non-public route
    - **Validates: Requirements 14.4**

- [x] 16. Build root layout and navigation
  - [x] 16.1 Implement `RootLayout` with providers and accessibility scaffolding
    - Wrap all routes with `ThemeProvider`, `AccountProvider`, and `NavigationBar`; set `lang`, a skip link, and SEO defaults
    - _Requirements: 12.1, 13.3, 13.6, 14.5_

  - [x] 16.2 Implement `NavigationBar` with sticky behavior and mobile menu
    - Sticky top bar with links to Roadmaps, Free Tools, Learning Paths, Projects, Resources, Compare Tools, Community; active-link indication via `usePathname`; collapsible Shadcn `Sheet` menu below 768px (collapsed by default, toggleable)
    - _Requirements: 2.1, 2.2, 2.4, 2.6, 2.7_

  - [x] 16.3 Implement `SearchControl` and `SearchResults`
    - Always-visible search control that opens a focused query input, calls the search engine, renders type-grouped results showing name + type, navigates on activation, and shows a query-bearing no-results message
    - _Requirements: 2.3, 2.5, 3.3, 3.4, 3.5, 3.7_

  - [x] 16.4 Implement `ThemeToggle`
    - Light/dark switch that writes via the theme provider and shows a non-blocking notice on write failure
    - _Requirements: 12.4, 12.5, 12.7_

  - [x]* 16.5 Write unit tests for navigation
    - Link set, sticky visibility, active-link indication, search-open focus, and mobile collapse/toggle
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x]* 16.6 Write unit tests for search UI
    - Result name + type display, navigation on activation, no-results message containing the query, and withholding below 2 chars
    - _Requirements: 3.4, 3.5, 3.6, 3.7_

- [x] 17. Build the homepage
  - [x] 17.1 Implement the homepage hero and CTAs
    - Hero with headline "Master Any Developer Path", primary CTA "Explore Roadmaps" (to roadmaps listing) and secondary CTA "Discover Free Tools" (to Tools Library)
    - _Requirements: 1.1, 1.4, 1.5, 1.6_

  - [x] 17.2 Implement `HeroRoadmapViz` with error boundary and fallback
    - Framer Motion animated, interactive mini node graph that begins animating within 100ms and responds to node interaction within 100ms; wrap in an error boundary rendering `HeroFallbackImage` while keeping headline and CTAs
    - _Requirements: 1.2, 1.3, 1.7_

  - [x]* 17.3 Write unit tests for the homepage
    - Headline, CTA labels and navigation targets, and forced-viz-error fallback keeping headline + CTAs
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7_

- [x] 18. Build the career path catalog and interactive roadmap
  - [x] 18.1 Implement the `/roadmaps` Career Path Catalog
    - List all 12 paths with name and <=200-char description; selecting a path opens its roadmap; on roadmap load failure show an error and keep other paths selectable
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 18.2 Implement `/roadmaps/[slug]` and `RoadmapRenderer`
    - Render nodes connected by directed connectors ordered first→last and handle node selection (sections shown within 100ms)
    - _Requirements: 5.1, 5.2_

  - [x] 18.3 Implement `NodeSectionPanel` for the six sections
    - Render Learn/Practice/Deploy/Career as activatable links, Build as project suggestions, Use as recommended tools; show placeholders for empty sections and a loading indicator when content is not ready within 100ms
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.12_

  - [x] 18.4 Implement the `ExternalLink` component
    - Open external sites in a new tab with `target="_blank" rel="noopener noreferrer"`; on failure show an error message and preserve the current view
    - _Requirements: 5.10, 5.11, 6.4, 6.5_

  - [x] 18.5 Implement `RecommendationsSection`
    - Render tools matched to the career path with a control to navigate to each tool's card; omit the section entirely when there are no matches
    - _Requirements: 7.1, 7.4, 7.5_

  - [x]* 18.6 Write unit tests for the roadmap experience
    - Section link rendering, empty-section placeholders, loading state, external-link attributes/failure, and recommendation card navigation
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 7.4_

- [x] 19. Build the Tools Library
  - [x] 19.1 Implement `/tools` with `ToolCard` and `ToolFilters`
    - Render all tools with no filters; show name/description/free-tier/category/website plus alternatives/tags when defined; category + tag multi-select filtering with a no-results message, clear-filters control, and a load-error message that keeps controls visible
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8, 6.9_

  - [x] 19.2 Implement `/tools/[id]` tool detail
    - Render the full tool card detail and wire the website link through `ExternalLink`
    - _Requirements: 6.2, 6.4, 6.5_

  - [x]* 19.3 Write unit tests for the Tools Library
    - No-results message and clear control, load-error keeps controls, and website-link new-tab behavior
    - _Requirements: 6.4, 6.5, 6.7, 6.8, 6.9_

- [x] 20. Build the Project Hub
  - [x] 20.1 Implement `/projects` with `ProjectCard` and `ProjectFilters`
    - Show all projects with no filter and a single skill-level filter; render project fields; show a no-results message and clear control when the filter matches nothing
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 20.2 Implement `/projects/[id]` detail and Build-section navigation
    - Render project detail and open it when selected from a Roadmap_Node Build section
    - _Requirements: 8.2, 8.6_

  - [x]* 20.3 Write unit tests for the Project Hub
    - Skill-level filtering, no-results + clear control, and Build-section navigation to project detail
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

- [x] 21. Build the Comparison View
  - [x] 21.1 Implement `/compare` `ComparisonView`
    - Display 2–4 tools side by side with the fixed rows and placeholders for missing values; add/remove with max-4 and min-2 enforcement and the corresponding boundary messages
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x]* 21.2 Write unit tests for the Comparison View
    - Max/min boundary messages and table update on tool removal
    - _Requirements: 9.4, 9.5, 9.6_

- [x] 22. Build the Path Generator
  - [x] 22.1 Implement `/learning-paths` form and `GeneratedPathView`
    - Goal/time/level form requesting a supported career path, whole-number hours, and a skill level; show field-specific validation messages and withhold generation until valid; render the generated roadmap within 2s
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x]* 22.2 Write unit tests for the Path Generator
    - Form structure and validation messages for missing goal, missing skill level, and out-of-range/non-integer time
    - _Requirements: 10.1, 10.4, 10.5, 10.6_

- [x] 23. Build the Dashboard, Resources, and Community pages
  - [x] 23.1 Implement `/dashboard`
    - Show completed skills/roadmaps, saved tools, bookmarked resources, and per-roadmap progress bars; support unmark/remove; show an empty state when tracked data cannot be read; surface save-failure notices
    - _Requirements: 11.1, 11.4, 11.7, 11.8, 11.9_

  - [x] 23.2 Implement `/resources` and `/community`
    - Render the learning-resources listing (from static data, fault-isolated) and the community page reachable from navigation
    - _Requirements: 2.1, 3.1, 15.1, 15.3_

  - [x]* 23.3 Write unit tests for the Dashboard
    - Dashboard sections, no-account full access, and empty state on read failure
    - _Requirements: 11.1, 11.5, 11.9_

- [x] 24. Checkpoint - presentation layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 25. Implement accessibility and responsiveness
  - [x] 25.1 Apply accessibility and responsive layout across components
    - Ensure visible focus indicators, text alternatives for informative non-text content, full keyboard operability with focus escape, and no horizontal scrolling of primary content between 320 and 1920px
    - _Requirements: 13.1, 13.2, 13.3, 13.6_

  - [x]* 25.2 Write accessibility and responsive tests
    - Focus indicators, text alternatives, keyboard reachability/escape, and no horizontal scroll at the 320px and 1920px boundaries
    - _Requirements: 13.1, 13.2, 13.3, 13.6_

- [x] 26. Implement performance and SSG wiring
  - [x] 26.1 Wire static generation for all public routes
    - Add `generateStaticParams` enumerating all 12 paths, all tools, and all projects so every public route prerenders to static markup; apply above-the-fold/performance optimizations
    - _Requirements: 14.1, 14.3_

  - [x]* 26.2 Write smoke / non-functional tests
    - Verify no backend/network calls for Req 1–11 content, SSG markup for every public route, and the responsive/performance budgets on representative routes
    - _Requirements: 14.1, 14.3, 15.2_

- [x] 27. Integration tests and final wiring
  - [x]* 27.1 Write integration tests for loaders, fault isolation, and persistence failures
    - Loaders read bundled JSON into validated domain objects; a forced single-file failure shows its section error while siblings render; mocked failing/corrupt local storage exercises write-failure and read-failure paths
    - _Requirements: 15.1, 15.3, 11.8, 11.9, 12.7_

- [x] 28. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; they cover property, unit, integration, and smoke tests.
- Property tests use fast-check (min. 100 generated cases) and are tagged `Feature: devatlas, Property N: ...`, mapping 1:1 to the 29 correctness properties in the design.
- Foundational layers (content, domain, persistence) are implemented and tested before the presentation layer so the algorithmic behavior is validated in isolation.
- Each task references the specific requirement sub-clauses it implements for traceability.
- Checkpoints provide incremental validation points between layers.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "3.2", "3.3", "3.4", "3.5"] },
    { "id": 3, "tasks": ["2.3", "14.1", "15.1"] },
    { "id": 4, "tasks": ["4.1", "5.1", "6.1", "7.1", "7.2", "7.3", "8.1", "8.2", "9.1", "10.1", "10.2", "12.1", "12.2", "13.1", "13.2", "15.2"] },
    { "id": 5, "tasks": ["2.4", "4.2", "4.3", "4.4", "5.2", "5.3", "6.2", "6.3", "7.4", "7.5", "7.6", "7.7", "7.8", "8.3", "8.4", "8.5", "9.2", "9.3", "9.4", "10.3", "10.4", "10.5", "12.3", "12.4", "12.5", "13.3", "14.2", "15.3", "15.4"] },
    { "id": 6, "tasks": ["16.1", "16.2", "16.3", "16.4", "17.1", "17.2", "18.1", "18.2", "18.3", "18.4", "18.5", "19.1", "19.2", "20.1", "20.2", "21.1", "22.1", "23.1", "23.2", "25.1", "26.1"] },
    { "id": 7, "tasks": ["16.5", "16.6", "17.3", "18.6", "19.3", "20.3", "21.2", "22.2", "23.3", "25.2", "26.2", "27.1"] }
  ]
}
```
