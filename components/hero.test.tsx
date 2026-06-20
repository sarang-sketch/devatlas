/**
 * Unit tests for the Hero component (task 17.3).
 *
 * Validates: Requirements 1.1, 1.4, 1.5, 1.6, 1.7
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Hero, HERO_HEADLINE } from "@/components/hero";

/** A component that always throws, used to force the viz error path (Req 1.7). */
function Thrower(): never {
  throw new Error("forced hero viz failure");
}

describe("Hero", () => {
  it("renders the headline 'Master Any Developer Path' (Req 1.1)", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1, name: HERO_HEADLINE });
    expect(heading).toBeInTheDocument();
    expect(HERO_HEADLINE).toBe("Master Any Developer Path");
  });

  it("renders 'Explore Roadmaps' CTA that links to /roadmaps (Req 1.4, 1.5)", () => {
    render(<Hero />);

    const exploreLink = screen.getByRole("link", { name: "Explore Roadmaps" });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "/roadmaps");
  });

  it("renders 'Discover Free Tools' CTA that links to /tools (Req 1.4, 1.6)", () => {
    render(<Hero />);

    const discoverLink = screen.getByRole("link", { name: "Discover Free Tools" });
    expect(discoverLink).toBeInTheDocument();
    expect(discoverLink).toHaveAttribute("href", "/tools");
  });

  it("renders the animated visualization by default", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-roadmap-viz")).toBeInTheDocument();
  });

  it("renders the static fallback when the viz throws, keeping headline and CTAs (Req 1.7)", () => {
    // Silence React's error boundary logging.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Hero viz={<Thrower />} />);

    // Fallback image is shown in place of the failed visualization.
    expect(screen.getByTestId("hero-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-roadmap-viz")).not.toBeInTheDocument();

    // Headline remains intact.
    expect(
      screen.getByRole("heading", { level: 1, name: HERO_HEADLINE }),
    ).toBeInTheDocument();

    // Both CTAs remain intact with correct navigation targets.
    expect(
      screen.getByRole("link", { name: "Explore Roadmaps" }),
    ).toHaveAttribute("href", "/roadmaps");
    expect(
      screen.getByRole("link", { name: "Discover Free Tools" }),
    ).toHaveAttribute("href", "/tools");

    spy.mockRestore();
  });
});
