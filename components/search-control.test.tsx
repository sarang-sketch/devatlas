/**
 * Unit tests for SearchControl (task 16.6).
 *
 * Validates: Requirements 3.4, 3.5, 3.6, 3.7
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";

// Polyfill ResizeObserver for cmdk in jsdom
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = FakeResizeObserver;

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock the search domain module so we can control results without loading real data
vi.mock("@/lib/domain/search", () => ({
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  buildSearchIndex: vi.fn().mockReturnValue({ items: [] }),
  search: vi.fn().mockReturnValue({}),
}));

// Mock the content loaders to avoid filesystem reads
vi.mock("@/lib/content/loaders", () => ({
  loadCareerPaths: () => ({ ok: true, data: [] }),
  loadRoadmap: () => ({ ok: false }),
  loadTools: () => ({ ok: true, data: [] }),
  loadProjects: () => ({ ok: true, data: [] }),
  loadResources: () => ({ ok: true, data: [] }),
}));

import { SearchControl } from "@/components/search-control";
import { search } from "@/lib/domain/search";
import type { GroupedResults } from "@/lib/domain/types";

const mockSearch = vi.mocked(search);

beforeEach(() => {
  mockPush.mockClear();
  mockSearch.mockClear();
  mockSearch.mockReturnValue({});
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/**
 * Helper: opens the search dialog and types the given query, advancing the
 * debounce timer to trigger the search callback.
 */
async function openAndType(query: string) {
  const { container } = render(<SearchControl />);

  // Open the dialog by clicking a search button. There are two responsive
  // triggers (desktop + mobile); click the first available.
  const searchButton = screen.getAllByRole("button", { name: /search/i })[0];
  await act(async () => {
    fireEvent.click(searchButton);
  });

  // Type into the input character-by-character using fireEvent
  const input = screen.getByPlaceholderText(/search roadmaps/i);
  await act(async () => {
    fireEvent.change(input, { target: { value: query } });
  });

  // Advance past the 150ms debounce
  await act(async () => {
    vi.advanceTimersByTime(200);
  });

  return { container };
}

describe("SearchControl", () => {
  it("displays result name and content type (Req 3.4)", async () => {
    const results: GroupedResults = {
      roadmap: [
        { id: "frontend", name: "Frontend Development", type: "roadmap", href: "/roadmaps/frontend" },
      ],
      tool: [
        { id: "vercel", name: "Vercel", type: "tool", href: "/tools/vercel" },
      ],
    };
    mockSearch.mockReturnValue(results);

    await openAndType("fro");

    // Check results display name and type
    expect(screen.getByText("Frontend Development")).toBeInTheDocument();
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    // Type labels appear both as group headings and in result items
    const roadmapLabels = screen.getAllByText("Roadmap");
    expect(roadmapLabels.length).toBeGreaterThanOrEqual(1);
    const toolLabels = screen.getAllByText("Tool");
    expect(toolLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("navigates via router.push when a result is activated (Req 3.5)", async () => {
    const results: GroupedResults = {
      roadmap: [
        { id: "frontend", name: "Frontend Development", type: "roadmap", href: "/roadmaps/frontend" },
      ],
    };
    mockSearch.mockReturnValue(results);

    await openAndType("fro");

    // Click the result item (cmdk uses onSelect callback)
    const resultItem = screen.getByText("Frontend Development");
    await act(async () => {
      fireEvent.click(resultItem);
    });

    expect(mockPush).toHaveBeenCalledWith("/roadmaps/frontend");
  });

  it("shows no-results message containing the query when no matches (Req 3.7)", async () => {
    mockSearch.mockReturnValue({});

    await openAndType("xyznotfound");

    // The no-results message should include the query text
    const noResults = screen.getByText(/no results for/i);
    expect(noResults).toBeInTheDocument();
    expect(noResults.textContent).toContain("xyznotfound");
  });

  it("withholds results when query is fewer than 2 characters (Req 3.6)", async () => {
    const results: GroupedResults = {
      roadmap: [
        { id: "frontend", name: "Frontend Development", type: "roadmap", href: "/roadmaps/frontend" },
      ],
    };
    // Even if search would return results, it should never be called
    mockSearch.mockReturnValue(results);

    render(<SearchControl />);

    // Open the dialog (two responsive triggers exist; use the first)
    const searchButton = screen.getAllByRole("button", { name: /search/i })[0];
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // Clear mock call history after opening to isolate the behavior
    mockSearch.mockClear();

    // Type only 1 character
    const input = screen.getByPlaceholderText(/search roadmaps/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "f" } });
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // search() should NOT have been called since query length < 2
    expect(mockSearch).not.toHaveBeenCalled();
    // No results should be visible
    expect(screen.queryByText("Frontend Development")).not.toBeInTheDocument();
  });
});
