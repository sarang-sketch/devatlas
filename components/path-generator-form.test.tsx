/**
 * Unit tests for PathGeneratorPage form (Task 22.2).
 *
 * Covers:
 *   - Form structure: goal select, hours input, skill level select present (Req 10.1)
 *   - Validation error for missing goal (Req 10.4)
 *   - Validation error for missing skill level (Req 10.5)
 *   - Validation error for out-of-range / non-integer hours (Req 10.6)
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PathGeneratorPage } from "@/components/path-generator-form";
import type { CareerPath } from "@/lib/domain/types";

const mockPaths: CareerPath[] = [
  {
    id: "frontend",
    name: "Frontend",
    description: "Build UIs for the web.",
    tags: ["frontend"],
    roadmapId: "frontend",
  },
  {
    id: "backend",
    name: "Backend",
    description: "Build server-side apps.",
    tags: ["backend"],
    roadmapId: "backend",
  },
];

describe("PathGeneratorPage form structure (Req 10.1)", () => {
  it("renders goal select, hours input, skill level select, and submit button", () => {
    render(<PathGeneratorPage careerPaths={mockPaths} />);

    expect(screen.getByLabelText("Learning Goal")).toBeInTheDocument();
    expect(screen.getByLabelText("Available Hours per Week")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Skill Level")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate Learning Path" }),
    ).toBeInTheDocument();
  });
});

describe("PathGeneratorPage validation messages", () => {
  it("shows an error when no goal is selected (Req 10.4)", () => {
    render(<PathGeneratorPage careerPaths={mockPaths} />);

    // Fill hours and skill but leave goal empty
    fireEvent.change(screen.getByLabelText("Available Hours per Week"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText("Current Skill Level"), {
      target: { value: "Beginner" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Learning Path" }));

    expect(
      screen.getByText("Select a learning goal from the supported career paths."),
    ).toBeInTheDocument();
  });

  it("shows an error when no skill level is selected (Req 10.5)", () => {
    render(<PathGeneratorPage careerPaths={mockPaths} />);

    fireEvent.change(screen.getByLabelText("Learning Goal"), {
      target: { value: "frontend" },
    });
    fireEvent.change(screen.getByLabelText("Available Hours per Week"), {
      target: { value: "10" },
    });
    // Skill level left empty
    fireEvent.click(screen.getByRole("button", { name: "Generate Learning Path" }));

    expect(
      screen.getByText("Select your current skill level."),
    ).toBeInTheDocument();
  });

  it("shows an error for non-integer hours input (Req 10.6)", () => {
    render(<PathGeneratorPage careerPaths={mockPaths} />);

    fireEvent.change(screen.getByLabelText("Learning Goal"), {
      target: { value: "frontend" },
    });
    fireEvent.change(screen.getByLabelText("Available Hours per Week"), {
      target: { value: "3.5" },
    });
    fireEvent.change(screen.getByLabelText("Current Skill Level"), {
      target: { value: "Beginner" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Learning Path" }));

    expect(
      screen.getByText(
        "Enter your available time as a whole number of hours per week between 1 and 80.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error for out-of-range hours (Req 10.6)", () => {
    render(<PathGeneratorPage careerPaths={mockPaths} />);

    fireEvent.change(screen.getByLabelText("Learning Goal"), {
      target: { value: "frontend" },
    });
    fireEvent.change(screen.getByLabelText("Available Hours per Week"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Current Skill Level"), {
      target: { value: "Intermediate" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Learning Path" }));

    expect(
      screen.getByText(
        "Enter your available time as a whole number of hours per week between 1 and 80.",
      ),
    ).toBeInTheDocument();
  });
});
