/**
 * Unit tests for ToolsLibrary (task 19.3).
 *
 * Validates:
 * - No-results message when filter matches nothing (Req 6.7)
 * - Clear-filters control resets filters (Req 6.8)
 * - Load-error state keeps filter UI visible (Req 6.9)
 * - Website link opens in new tab (Req 6.4, 6.5)
 * - Single-select: only one filter active at a time
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import type { Tool } from "@/lib/domain/types";
import { ToolsLibrary } from "@/components/tools-library";

// Mock next/link for ToolCard internal links
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the AccountProvider context used by SaveToolButton inside ToolCard
vi.mock("@/components/account-provider", () => ({
  useAccount: () => ({
    account: { completedNodes: {}, savedToolIds: [], bookmarkedResourceIds: [], schemaVersion: 1 },
    hasAccount: false,
    saveTool: vi.fn(),
    removeSavedTool: vi.fn(),
    bookmarkResource: vi.fn(),
    removeBookmark: vi.fn(),
    markNodeCompleted: vi.fn(),
    unmarkNodeCompleted: vi.fn(),
    persistenceError: false,
    readError: false,
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeTool(overrides: Partial<Tool> = {}): Tool {
  return {
    id: "tool-1",
    name: "Supabase",
    description: "Open source Firebase alternative",
    category: "Databases",
    freeTier: "Generous free tier",
    website: "https://supabase.com",
    tags: ["database", "realtime"],
    ...overrides,
  };
}

const sampleTools: Tool[] = [
  makeTool({ id: "supabase", name: "Supabase", category: "Databases", tags: ["database", "realtime"] }),
  makeTool({ id: "vercel", name: "Vercel", category: "Hosting", tags: ["hosting", "serverless"], website: "https://vercel.com" }),
  makeTool({ id: "stripe", name: "Stripe", category: "APIs", tags: ["payments", "api"], website: "https://stripe.com" }),
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ToolsLibrary", () => {
  describe("No-results message (Req 6.7)", () => {
    it("shows 'No tools match the selected filters' when category filter matches nothing", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      // Select a category that none of the tools belong to
      const securityBtn = screen.getByRole("button", { name: "Security" });
      await act(async () => {
        securityBtn.click();
      });

      expect(
        screen.getByText("No tools match the selected filters."),
      ).toBeInTheDocument();
    });

    it("does not show no-results message when filters have matches", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      // Select Databases — Supabase should match
      const dbBtn = screen.getByRole("button", { name: "Databases" });
      await act(async () => {
        dbBtn.click();
      });

      expect(
        screen.queryByText("No tools match the selected filters."),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Supabase")).toBeInTheDocument();
    });
  });

  describe("Single-select behavior", () => {
    it("selecting a category deselects any previously selected category", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      // Select Databases
      const dbBtn = screen.getByRole("button", { name: "Databases" });
      await act(async () => {
        dbBtn.click();
      });
      expect(screen.getByText("Supabase")).toBeInTheDocument();

      // Now select Hosting — should show Vercel, not Supabase
      const hostingBtn = screen.getByRole("button", { name: "Hosting" });
      await act(async () => {
        hostingBtn.click();
      });
      expect(screen.getByText("Vercel")).toBeInTheDocument();
    });

    it("clicking the same category again deselects it", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      const dbBtn = screen.getByRole("button", { name: "Databases" });
      await act(async () => {
        dbBtn.click();
      });
      // Only Supabase visible
      expect(screen.getByText("Supabase")).toBeInTheDocument();

      // Click again to deselect
      await act(async () => {
        dbBtn.click();
      });
      // All tools visible again
      expect(screen.getByText("Supabase")).toBeInTheDocument();
      expect(screen.getByText("Vercel")).toBeInTheDocument();
      expect(screen.getByText("Stripe")).toBeInTheDocument();
    });
  });

  describe("Clear-filters control (Req 6.8)", () => {
    it("shows a clear-filters button in the no-results area that resets the view", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      // Apply a filter that yields no results
      const securityBtn = screen.getByRole("button", { name: "Security" });
      await act(async () => {
        securityBtn.click();
      });

      expect(
        screen.getByText("No tools match the selected filters."),
      ).toBeInTheDocument();

      // Click a "Clear filters" button
      const clearBtns = screen.getAllByRole("button", { name: /clear/i });
      await act(async () => {
        clearBtns[clearBtns.length - 1].click();
      });

      // All tools should now be visible again
      expect(screen.getByText("Supabase")).toBeInTheDocument();
      expect(screen.getByText("Vercel")).toBeInTheDocument();
      expect(screen.getByText("Stripe")).toBeInTheDocument();
      expect(
        screen.queryByText("No tools match the selected filters."),
      ).not.toBeInTheDocument();
    });

    it("shows a clear-filters button in the filter section when filters are active", async () => {
      render(<ToolsLibrary tools={sampleTools} />);

      const dbBtn = screen.getByRole("button", { name: "Databases" });
      await act(async () => {
        dbBtn.click();
      });

      // A clear button should appear in the filter controls section
      expect(
        screen.getByRole("button", { name: /clear/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Load-error keeps controls visible (Req 6.9)", () => {
    it("shows error message but keeps filter UI present", () => {
      render(<ToolsLibrary tools={[]} loadError={true} />);

      // Error message is displayed
      expect(
        screen.getByText("Unable to load tools. Please try again later."),
      ).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Filter UI is still present — category buttons are visible
      expect(
        screen.getByRole("button", { name: "AI" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Hosting" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Databases" }),
      ).toBeInTheDocument();
    });

    it("does not show tool cards when load error is present", () => {
      render(<ToolsLibrary tools={[]} loadError={true} />);

      // No tool cards rendered
      expect(screen.queryByText("Supabase")).not.toBeInTheDocument();
    });
  });

  describe("Website link new-tab behavior (Req 6.4, 6.5)", () => {
    it("renders tool website links with target=_blank and rel=noopener noreferrer", () => {
      render(<ToolsLibrary tools={[sampleTools[0]]} />);

      const websiteLink = screen.getByRole("link", { name: "Visit website" });
      expect(websiteLink).toHaveAttribute("href", "https://supabase.com");
      expect(websiteLink).toHaveAttribute("target", "_blank");
      expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("shows inline error when window.open fails for a tool website link (Req 6.5)", async () => {
      vi.spyOn(window, "open").mockReturnValue(null);

      render(<ToolsLibrary tools={[sampleTools[0]]} />);

      const websiteLink = screen.getByRole("link", { name: "Visit website" });
      await act(async () => {
        websiteLink.click();
      });

      expect(screen.getByRole("alert")).toHaveTextContent(
        "This link could not be opened.",
      );
    });
  });
});
