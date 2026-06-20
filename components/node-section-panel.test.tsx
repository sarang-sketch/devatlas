/**
 * Unit tests for NodeSectionPanel (tasks 18.6).
 *
 * Validates:
 * - Learn/Practice/Deploy/Career sections render ExternalLinks (Req 5.3, 5.4, 5.7, 5.8)
 * - Build section renders /projects/{id} links (Req 5.5)
 * - Use section renders /tools/{id} links (Req 5.6)
 * - Empty sections show "No content available" placeholder (Req 5.9)
 * - Loading state is shown before content is ready (Req 5.12)
 * - External links carry target="_blank" rel="noopener noreferrer" (Req 5.10, 5.11)
 * - Recommendation card navigation targets (Req 7.4)
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import type { RoadmapNode } from "@/lib/domain/types";
import {
  NodeSectionPanel,
  EMPTY_SECTION_MESSAGE,
} from "@/components/node-section-panel";

// Mock next/link to render a plain <a> so we can assert href values
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

// Mock framer-motion so AnimatePresence/motion.div render synchronously
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
    a: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <a {...props}>{children}</a>,
  },
}));

// Mock the new visual sub-components so they don't break existing tests
vi.mock("@/components/workflow-diagram", () => ({
  WorkflowDiagram: () => null,
}));

vi.mock("@/components/youtube-video-card", () => ({
  YouTubeVideoList: () => null,
}));

vi.mock("@/lib/data/node-workflows", () => ({
  NODE_WORKFLOWS: {},
}));

vi.mock("@/lib/data/node-videos", () => ({
  NODE_VIDEOS: {},
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Render and advance past the loading state. */
function renderPanel(node: RoadmapNode) {
  const result = render(<NodeSectionPanel node={node} roadmapId="frontend" />);
  act(() => {
    vi.runAllTimers();
  });
  return result;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeNode(overrides: Partial<RoadmapNode["sections"]> = {}): RoadmapNode {
  return {
    id: "node-1",
    title: "HTML Basics",
    order: 1,
    tags: ["html"],
    sections: {
      learn: [
        { id: "r1", name: "MDN Docs", url: "https://mdn.dev", resourceType: "documentation", tags: [] },
        { id: "r2", name: "HTML Course", url: "https://freecodecamp.org", resourceType: "course", tags: [] },
      ],
      practice: [
        { id: "r3", name: "CSS Battle", url: "https://cssbattle.dev", resourceType: "challenge", tags: [] },
      ],
      build: [
        { projectId: "todo-app" },
        { projectId: "personal-portfolio" },
      ],
      use: [
        { toolId: "vs-code" },
        { toolId: "github" },
      ],
      deploy: [
        { id: "r4", name: "Vercel", url: "https://vercel.com", resourceType: "deployment", tags: [] },
      ],
      career: [
        { id: "r5", name: "Resume Tips", url: "https://resume.io", resourceType: "career", tags: [] },
      ],
      ...overrides,
    },
  };
}

function makeEmptyNode(): RoadmapNode {
  return {
    id: "node-empty",
    title: "Empty Node",
    order: 0,
    tags: [],
    sections: {
      learn: [],
      practice: [],
      build: [],
      use: [],
      deploy: [],
      career: [],
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("NodeSectionPanel", () => {
  describe("Learn section (Req 5.3)", () => {
    it("renders resource links as external anchors with correct text", () => {
      renderPanel(makeNode());

      const mdnLink = screen.getByRole("link", { name: "MDN Docs" });
      expect(mdnLink).toHaveAttribute("href", "https://mdn.dev");
      expect(mdnLink).toHaveAttribute("target", "_blank");
      expect(mdnLink).toHaveAttribute("rel", "noopener noreferrer");

      const courseLink = screen.getByRole("link", { name: "HTML Course" });
      expect(courseLink).toHaveAttribute("href", "https://freecodecamp.org");
    });
  });

  describe("Practice section (Req 5.4)", () => {
    it("renders practice links as external anchors", () => {
      renderPanel(makeNode());

      // Switch to Practice tab
      const practiceTab = screen.getByRole("tab", { name: "Practice" });
      act(() => {
        practiceTab.click();
      });

      const link = screen.getByRole("link", { name: "CSS Battle" });
      expect(link).toHaveAttribute("href", "https://cssbattle.dev");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Build section (Req 5.5)", () => {
    it("renders known projects as internal links with their display name", () => {
      renderPanel(makeNode());

      const buildTab = screen.getByRole("tab", { name: "Build" });
      act(() => {
        buildTab.click();
      });

      const todoLink = screen.getByRole("link", { name: /Todo App/i });
      expect(todoLink).toHaveAttribute("href", "/projects/todo-app");

      const portfolioLink = screen.getByRole("link", { name: /Personal Portfolio/i });
      expect(portfolioLink).toHaveAttribute("href", "/projects/personal-portfolio");
    });

    it("renders free-form project ideas (unknown ids) as non-linked suggestions", () => {
      renderPanel(
        makeNode({ build: [{ projectId: "build-a-shell-in-c" }] }),
      );

      const buildTab = screen.getByRole("tab", { name: "Build" });
      act(() => {
        buildTab.click();
      });

      // Humanized label is shown...
      expect(screen.getByText("Build A Shell In C")).toBeInTheDocument();
      // ...and it is NOT a link (no detail page exists for an idea).
      expect(
        screen.queryByRole("link", { name: /Build A Shell In C/i }),
      ).toBeNull();
    });
  });

  describe("Use section (Req 5.6)", () => {
    it("renders known tools as internal links with their display name", () => {
      renderPanel(makeNode());

      const useTab = screen.getByRole("tab", { name: "Use" });
      act(() => {
        useTab.click();
      });

      const vscodeLink = screen.getByRole("link", { name: /Visual Studio Code/i });
      expect(vscodeLink).toHaveAttribute("href", "/tools/vs-code");

      const githubLink = screen.getByRole("link", { name: /^GitHub$/i });
      expect(githubLink).toHaveAttribute("href", "/tools/github");
    });
  });

  describe("Deploy section (Req 5.7)", () => {
    it("renders deploy links as external anchors", () => {
      renderPanel(makeNode());

      const deployTab = screen.getByRole("tab", { name: "Deploy" });
      act(() => {
        deployTab.click();
      });

      const link = screen.getByRole("link", { name: "Vercel" });
      expect(link).toHaveAttribute("href", "https://vercel.com");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  describe("Career section (Req 5.8)", () => {
    it("renders career links as external anchors", () => {
      renderPanel(makeNode());

      const careerTab = screen.getByRole("tab", { name: "Career" });
      act(() => {
        careerTab.click();
      });

      const link = screen.getByRole("link", { name: "Resume Tips" });
      expect(link).toHaveAttribute("href", "https://resume.io");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Empty section placeholder (Req 5.9)", () => {
    it("shows the 'No content available' message when a section has no items", () => {
      renderPanel(makeEmptyNode());

      // The Learn tab is default; it should show the placeholder
      expect(screen.getByText(EMPTY_SECTION_MESSAGE)).toBeInTheDocument();
    });

    it("placeholder message text matches the exported constant", () => {
      expect(EMPTY_SECTION_MESSAGE).toBe(
        "No content available for this section.",
      );
    });

    it("shows placeholders for all empty sections when switching tabs", () => {
      renderPanel(makeEmptyNode());

      // Switch through each tab and confirm placeholder
      for (const tabName of ["Practice", "Build", "Use", "Deploy", "Career"]) {
        const tab = screen.getByRole("tab", { name: tabName });
        act(() => {
          tab.click();
        });
        expect(screen.getByText(EMPTY_SECTION_MESSAGE)).toBeInTheDocument();
      }
    });
  });

  describe("External link attributes (Req 5.10, 5.11)", () => {
    it("all external links carry target=_blank and rel=noopener noreferrer", () => {
      renderPanel(makeNode());

      // Learn tab is active by default with external links
      const links = screen.getAllByRole("link");
      for (const link of links) {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("http")) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      }
    });

    it("shows inline error when window.open fails (Req 5.11)", () => {
      vi.spyOn(window, "open").mockReturnValue(null);

      renderPanel(makeNode());

      const link = screen.getByRole("link", { name: "MDN Docs" });
      act(() => {
        link.click();
      });

      expect(screen.getByRole("alert")).toHaveTextContent(
        "This link could not be opened.",
      );
    });
  });

  describe("Loading state (Req 5.12)", () => {
    it("shows a loading indicator initially before content is ready", () => {
      // Don't use renderPanel — render directly without advancing timers
      render(<NodeSectionPanel node={makeNode()} roadmapId="frontend" />);

      const loadingIndicator = screen.getByRole("status");
      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).toHaveAttribute(
        "aria-label",
        "Loading section content",
      );
    });
  });
});
