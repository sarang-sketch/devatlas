/**
 * Unit tests for ProjectsHub (task 20.3).
 *
 * Validates:
 * - Skill-level filtering shows only matching projects (Req 8.3, 8.4)
 * - No-results message when filter matches nothing (Req 8.5)
 * - Clear-filters control resets view to show all projects (Req 8.5)
 * - Build-section navigation renders /projects/{id} links (Req 8.6)
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import type { Project } from "@/lib/domain/types";
import { ProjectsHub } from "@/components/projects-hub";

// Mock next/link to render a plain <a> so we can assert href values
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Todo App",
    skillLevel: "Beginner",
    description: "Build a basic todo application",
    requiredSkills: ["HTML", "CSS", "JavaScript"],
    estimatedTime: "2 hours",
    techStack: ["React", "TypeScript"],
    learningOutcomes: ["State management basics"],
    tags: ["frontend"],
    ...overrides,
  };
}

const sampleProjects: Project[] = [
  makeProject({
    id: "todo-app",
    name: "Todo App",
    skillLevel: "Beginner",
    requiredSkills: ["HTML", "CSS"],
  }),
  makeProject({
    id: "ecommerce",
    name: "E-Commerce Store",
    skillLevel: "Intermediate",
    description: "Full-stack e-commerce platform",
    requiredSkills: ["React", "Node.js"],
  }),
  makeProject({
    id: "ml-pipeline",
    name: "ML Pipeline",
    skillLevel: "Advanced",
    description: "Machine learning data pipeline",
    requiredSkills: ["Python", "TensorFlow"],
  }),
  makeProject({
    id: "saas-platform",
    name: "SaaS Platform",
    skillLevel: "Production-grade",
    description: "Multi-tenant SaaS application",
    requiredSkills: ["Next.js", "PostgreSQL"],
  }),
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProjectsHub", () => {
  describe("Skill-level filtering (Req 8.3, 8.4)", () => {
    it("filters to show only Beginner projects when Beginner is selected", async () => {
      render(<ProjectsHub projects={sampleProjects} />);

      const beginnerBtn = screen.getByRole("button", { name: "Beginner" });
      await act(async () => {
        beginnerBtn.click();
      });

      expect(screen.getByText("Todo App")).toBeInTheDocument();
      expect(screen.queryByText("E-Commerce Store")).not.toBeInTheDocument();
      expect(screen.queryByText("ML Pipeline")).not.toBeInTheDocument();
      expect(screen.queryByText("SaaS Platform")).not.toBeInTheDocument();
    });

    it("filters to show only Intermediate projects", async () => {
      render(<ProjectsHub projects={sampleProjects} />);

      const btn = screen.getByRole("button", { name: "Intermediate" });
      await act(async () => {
        btn.click();
      });

      expect(screen.getByText("E-Commerce Store")).toBeInTheDocument();
      expect(screen.queryByText("Todo App")).not.toBeInTheDocument();
      expect(screen.queryByText("ML Pipeline")).not.toBeInTheDocument();
    });

    it("filters to show only Advanced projects", async () => {
      render(<ProjectsHub projects={sampleProjects} />);

      const btn = screen.getByRole("button", { name: "Advanced" });
      await act(async () => {
        btn.click();
      });

      expect(screen.getByText("ML Pipeline")).toBeInTheDocument();
      expect(screen.queryByText("Todo App")).not.toBeInTheDocument();
      expect(screen.queryByText("E-Commerce Store")).not.toBeInTheDocument();
    });

    it("selecting 'All' shows all projects", async () => {
      render(<ProjectsHub projects={sampleProjects} />);

      // First filter to Beginner
      const beginnerBtn = screen.getByRole("button", { name: "Beginner" });
      await act(async () => {
        beginnerBtn.click();
      });

      // Then select All
      const allBtn = screen.getByRole("button", { name: "All" });
      await act(async () => {
        allBtn.click();
      });

      expect(screen.getByText("Todo App")).toBeInTheDocument();
      expect(screen.getByText("E-Commerce Store")).toBeInTheDocument();
      expect(screen.getByText("ML Pipeline")).toBeInTheDocument();
      expect(screen.getByText("SaaS Platform")).toBeInTheDocument();
    });
  });

  describe("No-results and clear control (Req 8.5)", () => {
    it("shows no-results message when search matches nothing", async () => {
      render(<ProjectsHub projects={sampleProjects} />);

      const searchInput = screen.getByLabelText("Search projects");
      await act(async () => {
        searchInput.focus();
        // Simulate typing a query that matches nothing
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(searchInput, "zzzznonexistent");
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.dispatchEvent(new Event("change", { bubbles: true }));
      });

      expect(
        screen.getByText("No projects match the selected filters."),
      ).toBeInTheDocument();
    });

    it("shows no-results message when skill filter matches nothing in a filtered set", async () => {
      // Only pass beginner projects, then filter by Advanced
      const beginnerOnly = [sampleProjects[0]];
      render(<ProjectsHub projects={beginnerOnly} />);

      const advancedBtn = screen.getByRole("button", { name: "Advanced" });
      await act(async () => {
        advancedBtn.click();
      });

      expect(
        screen.getByText("No projects match the selected filters."),
      ).toBeInTheDocument();
    });

    it("clear-filters button resets the view to show all projects", async () => {
      const beginnerOnly = [sampleProjects[0]];
      render(<ProjectsHub projects={beginnerOnly} />);

      // Filter by Advanced (no results)
      const advancedBtn = screen.getByRole("button", { name: "Advanced" });
      await act(async () => {
        advancedBtn.click();
      });

      expect(
        screen.getByText("No projects match the selected filters."),
      ).toBeInTheDocument();

      // Click clear button
      const clearBtn = screen.getByRole("button", { name: "Clear filters" });
      await act(async () => {
        clearBtn.click();
      });

      // Project should be visible again
      expect(screen.getByText("Todo App")).toBeInTheDocument();
      expect(
        screen.queryByText("No projects match the selected filters."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Build-section navigation to project detail (Req 8.6)", () => {
    it("each project card links to /projects/{id}", () => {
      render(<ProjectsHub projects={sampleProjects} />);

      const todoLink = screen.getByRole("link", { name: /Todo App/i });
      expect(todoLink).toHaveAttribute("href", "/projects/todo-app");

      const ecomLink = screen.getByRole("link", { name: /E-Commerce Store/i });
      expect(ecomLink).toHaveAttribute("href", "/projects/ecommerce");

      const mlLink = screen.getByRole("link", { name: /ML Pipeline/i });
      expect(mlLink).toHaveAttribute("href", "/projects/ml-pipeline");

      const saasLink = screen.getByRole("link", { name: /SaaS Platform/i });
      expect(saasLink).toHaveAttribute("href", "/projects/saas-platform");
    });
  });
});
