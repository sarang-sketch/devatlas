/**
 * Smoke / non-functional tests (Task 26.2).
 *
 * Covers:
 *   - No backend/network calls for Req 1-11 content (Req 14.1)
 *   - SSG markup: every public route has a static page file (Req 14.3)
 *   - Loaders return ok:true for bundled data — confirming static content
 *     works without a network layer (Req 15.2)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  loadCareerPaths,
  loadTools,
  loadProjects,
  loadResources,
  loadRoadmap,
} from "@/lib/content/loaders";

// ---------------------------------------------------------------------------
// Req 14.1: No backend/network calls needed for static content
// ---------------------------------------------------------------------------

describe("No backend/network calls (Req 14.1)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("loaders operate without invoking fetch", () => {
    loadCareerPaths();
    loadTools();
    loadProjects();
    loadResources();
    loadRoadmap("frontend");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Req 14.3, 15.2: SSG — every public route has a page file
// ---------------------------------------------------------------------------

describe("SSG route coverage (Req 14.3, 15.2)", () => {
  const appDir = path.resolve(process.cwd(), "app");

  const publicRoutes = [
    "", // root
    "roadmaps",
    "tools",
    "learning-paths",
    "projects",
    "resources",
    "compare",
    "about",
    "dashboard",
  ];

  it.each(publicRoutes)(
    "route /%s has a page.tsx file in app/",
    (route) => {
      const pagePath = path.join(appDir, route, "page.tsx");
      expect(fs.existsSync(pagePath)).toBe(true);
    },
  );
});

// ---------------------------------------------------------------------------
// Req 15.2: Bundled loaders return ok:true (confirming no network needed)
// ---------------------------------------------------------------------------

describe("Bundled loaders return ok:true (Req 15.2)", () => {
  it("loadCareerPaths returns ok", () => {
    expect(loadCareerPaths().ok).toBe(true);
  });

  it("loadTools returns ok", () => {
    expect(loadTools().ok).toBe(true);
  });

  it("loadProjects returns ok", () => {
    expect(loadProjects().ok).toBe(true);
  });

  it("loadResources returns ok", () => {
    expect(loadResources().ok).toBe(true);
  });

  it("loadRoadmap returns ok for a known slug", () => {
    expect(loadRoadmap("frontend").ok).toBe(true);
  });
});
