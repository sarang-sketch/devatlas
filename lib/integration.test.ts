/**
 * Integration tests for loaders, fault isolation, and persistence failures
 * (Task 27.1).
 *
 * Covers:
 *   - Loaders read bundled JSON successfully (Req 15.1)
 *   - Forced loader failure shows section error while siblings render (Req 15.3)
 *   - Mocked failing LocalStore.write exercises write failure path (Req 11.8, 12.7)
 *   - Mocked corrupt localStorage exercises read failure path (Req 11.9)
 */

import { describe, it, expect, vi, afterEach } from "vitest";

import {
  loadCareerPaths,
  loadRoadmap,
  loadTools,
  loadProjects,
  loadResources,
} from "@/lib/content/loaders";
import { LocalStore, STORAGE_KEYS } from "@/lib/store/local-store";
import { emptyAccountState } from "@/lib/store/account";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

// ---------------------------------------------------------------------------
// Req 15.1: Loaders read bundled JSON
// ---------------------------------------------------------------------------

describe("Loaders read bundled JSON (Req 15.1)", () => {
  it("loadCareerPaths returns 18 career paths", () => {
    const result = loadCareerPaths();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(18);
    }
  });

  it("loadTools returns a non-empty list", () => {
    const result = loadTools();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBeGreaterThan(0);
    }
  });

  it("loadRoadmap returns ok for every slug", () => {
    const slugs = [
      "frontend", "backend", "fullstack", "mobile", "ai-engineer",
      "ml-engineer", "data-scientist", "devops", "cloud",
      "cybersecurity", "game-dev", "blockchain",
      "computer-science", "data-analyst", "qa-engineer",
      "embedded-systems", "ui-ux-designer", "digital-marketer",
    ];
    for (const slug of slugs) {
      expect(loadRoadmap(slug).ok).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Req 15.3: Forced file failure shows section error while siblings render
// ---------------------------------------------------------------------------

describe("Fault isolation — forced loader failure (Req 15.3)", () => {
  it("loadRoadmap returns an error for an unknown slug without affecting other loaders", () => {
    const roadmapResult = loadRoadmap("nonexistent-slug");
    expect(roadmapResult.ok).toBe(false);
    if (!roadmapResult.ok) {
      expect(roadmapResult.error).toContain("nonexistent-slug");
    }

    // Sibling loaders still function correctly
    expect(loadTools().ok).toBe(true);
    expect(loadProjects().ok).toBe(true);
    expect(loadResources().ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Req 11.8, 12.7: Mocked failing LocalStore.write exercises write failure path
// ---------------------------------------------------------------------------

describe("Persistence write failure (Req 11.8, 12.7)", () => {
  it("LocalStore.write returns false when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    const ok = LocalStore.write(STORAGE_KEYS.account, emptyAccountState());
    expect(ok).toBe(false);
  });

  it("in-memory state is unaffected by a write failure (simulated)", () => {
    // Write a value successfully first
    const state = { ...emptyAccountState(), savedToolIds: ["tool-1"] };
    expect(LocalStore.write(STORAGE_KEYS.account, state)).toBe(true);

    // Now make writes fail
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    const updatedState = { ...state, savedToolIds: ["tool-1", "tool-2"] };
    const writeOk = LocalStore.write(STORAGE_KEYS.account, updatedState);
    expect(writeOk).toBe(false);

    // The previously stored value is still readable
    const restored = LocalStore.read(STORAGE_KEYS.account, emptyAccountState());
    expect(restored).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// Req 11.9: Mocked corrupt localStorage exercises read failure path
// ---------------------------------------------------------------------------

describe("Persistence read failure — corrupt data (Req 11.9)", () => {
  it("LocalStore.read returns the fallback for corrupt JSON", () => {
    window.localStorage.setItem(STORAGE_KEYS.account, "{{invalid json!!}");

    const fallback = emptyAccountState();
    const result = LocalStore.read(STORAGE_KEYS.account, fallback);
    expect(result).toEqual(fallback);
  });

  it("LocalStore.read returns the fallback when getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    const fallback = emptyAccountState();
    const result = LocalStore.read(STORAGE_KEYS.account, fallback);
    expect(result).toEqual(fallback);
  });
});
