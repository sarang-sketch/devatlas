/**
 * Unit tests for ComparisonView (Task 21.2).
 *
 * Covers:
 *   - Max-4 boundary message (Req 9.4, 9.5)
 *   - Min-2 boundary message (Req 9.6)
 *   - Table renders with correct tool columns on valid selection
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ComparisonView } from "@/components/comparison-view";
import type { Tool } from "@/lib/domain/types";

function makeTool(id: string, name: string): Tool {
  return {
    id,
    name,
    description: `${name} description`,
    category: "Hosting",
    freeTier: "Free tier info",
    website: `https://${id}.example.com`,
    tags: ["test"],
    comparison: {
      databaseSupport: "Yes",
      authSupport: "Yes",
      storageSupport: "5GB",
      realtimeSupport: "WebSocket",
      pricing: "Free",
      learningCurve: "Low",
    },
  };
}

const tools: Tool[] = [
  makeTool("tool-a", "Tool A"),
  makeTool("tool-b", "Tool B"),
  makeTool("tool-c", "Tool C"),
  makeTool("tool-d", "Tool D"),
  makeTool("tool-e", "Tool E"),
];

function selectTool(name: string) {
  const select = screen.getByLabelText("Select a tool to add to comparison");
  fireEvent.change(select, {
    target: { value: tools.find((t) => t.name === name)!.id },
  });
}

describe("ComparisonView", () => {
  it("shows max-4 boundary message when trying to add a 5th tool (Req 9.4, 9.5)", () => {
    render(<ComparisonView tools={tools} />);

    selectTool("Tool A");
    selectTool("Tool B");
    selectTool("Tool C");
    selectTool("Tool D");
    // Attempt to add a 5th tool
    selectTool("Tool E");

    expect(
      screen.getByText("Maximum of 4 tools can be compared"),
    ).toBeInTheDocument();
  });

  it("shows min-2 boundary message when trying to remove below 2 tools (Req 9.6)", () => {
    render(<ComparisonView tools={tools} />);

    selectTool("Tool A");
    selectTool("Tool B");

    // Table should be visible now
    expect(screen.getByRole("table")).toBeInTheDocument();

    // Try to remove one tool — should show warning since it'd leave only 1
    const removeButtons = screen.getAllByLabelText(/Remove .* from comparison/);
    fireEvent.click(removeButtons[0]);

    expect(
      screen.getByText("At least 2 tools are required"),
    ).toBeInTheDocument();
  });

  it("renders a comparison table with correct tool columns (Req 9.1, 9.2)", () => {
    render(<ComparisonView tools={tools} />);

    selectTool("Tool A");
    selectTool("Tool B");
    selectTool("Tool C");

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Each selected tool appears as a column header in the table
    const columnHeaders = screen.getAllByRole("columnheader");
    const headerTexts = columnHeaders.map((h) => h.textContent ?? "");
    expect(headerTexts.some((t) => t.includes("Tool A"))).toBe(true);
    expect(headerTexts.some((t) => t.includes("Tool B"))).toBe(true);
    expect(headerTexts.some((t) => t.includes("Tool C"))).toBe(true);

    // The seven fixed rows are present
    expect(screen.getByText("Free Tier")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Realtime")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Learning Curve")).toBeInTheDocument();
  });
});
