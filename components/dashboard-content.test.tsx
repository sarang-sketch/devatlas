/**
 * Unit tests for DashboardContent (Task 23.3).
 *
 * Covers:
 *   - Dashboard sections render headings (Req 11.1)
 *   - No-account welcome state grants full access (Req 11.5)
 *   - Empty state shown on read failure (Req 11.9)
 *   - Persistence error notice (Req 11.8)
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardContent } from "@/components/dashboard-content";

// Mock the useAccount hook to control context values directly
vi.mock("@/components/account-provider", () => ({
  useAccount: vi.fn(),
}));

import { useAccount } from "@/components/account-provider";

const mockedUseAccount = vi.mocked(useAccount);

function mockAccountValue(overrides: Partial<ReturnType<typeof useAccount>>) {
  mockedUseAccount.mockReturnValue({
    account: {
      completedNodes: {},
      savedToolIds: [],
      bookmarkedResourceIds: [],
      schemaVersion: 1,
    },
    hasAccount: false,
    markNodeCompleted: vi.fn(),
    unmarkNodeCompleted: vi.fn(),
    saveTool: vi.fn(),
    removeSavedTool: vi.fn(),
    bookmarkResource: vi.fn(),
    removeBookmark: vi.fn(),
    persistenceError: false,
    readError: false,
    ...overrides,
  });
}

describe("DashboardContent — welcome state (Req 11.1, 11.5)", () => {
  it("shows the welcome state when there is no account data", () => {
    mockAccountValue({ hasAccount: false, readError: false });

    render(<DashboardContent />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Welcome to your Dashboard" }),
    ).toBeInTheDocument();
    // Full access — navigation links to roadmaps and tools are present
    expect(screen.getByRole("link", { name: "Explore Roadmaps" })).toHaveAttribute(
      "href",
      "/roadmaps",
    );
    expect(screen.getByRole("link", { name: "Browse Free Tools" })).toHaveAttribute(
      "href",
      "/tools",
    );
  });
});

describe("DashboardContent — read error empty state (Req 11.9)", () => {
  it("shows the read-error empty state when tracked data cannot be read", () => {
    mockAccountValue({ hasAccount: false, readError: true });

    render(<DashboardContent />);

    expect(
      screen.getByText("No progress or saved items available"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/couldn't read your tracked data/i),
    ).toBeInTheDocument();
  });
});

describe("DashboardContent — persistence error notice (Req 11.8)", () => {
  it("shows a persistence-failure notice alongside the welcome state", () => {
    mockAccountValue({ hasAccount: false, readError: false, persistenceError: true });

    render(<DashboardContent />);

    expect(
      screen.getByText("Some items could not be saved."),
    ).toBeInTheDocument();
  });

  it("shows a persistence-failure notice alongside the read-error state", () => {
    mockAccountValue({ hasAccount: false, readError: true, persistenceError: true });

    render(<DashboardContent />);

    expect(
      screen.getByText("Some items could not be saved."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No progress or saved items available"),
    ).toBeInTheDocument();
  });
});
