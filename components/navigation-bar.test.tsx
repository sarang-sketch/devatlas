/**
 * Unit tests for NavigationBar (task 16.5).
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";


// Mock next/navigation before importing the component
const mockUsePathname = vi.fn<() => string>().mockReturnValue("/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock ThemeToggle to avoid requiring ThemeProvider context
vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button aria-label="Toggle theme">Theme</button>,
}));

// Mock SearchControl to isolate NavigationBar from its search dependencies
vi.mock("@/components/search-control", () => ({
  SearchControl: () => <button aria-label="Search">Search</button>,
}));

import { NavigationBar } from "@/components/navigation-bar";

beforeEach(() => {
  mockUsePathname.mockReturnValue("/");
});

const EXPECTED_LINKS = [
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Free Tools", href: "/tools" },
  { label: "Learning Paths", href: "/learning-paths" },
  { label: "Companies", href: "/companies" },
  { label: "Certificates", href: "/certificates" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Compare Tools", href: "/compare" },
  { label: "About", href: "/about" },
];

describe("NavigationBar", () => {
  it("renders all 9 navigation links with correct hrefs (Req 2.1)", () => {
    render(<NavigationBar />);

    for (const { label, href } of EXPECTED_LINKS) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("has sticky positioning classes so the nav stays fixed at the top (Req 2.2)", () => {
    render(<NavigationBar />);

    const header = screen.getByRole("banner");
    expect(header.className).toMatch(/sticky/);
    expect(header.className).toMatch(/top-0/);
  });

  it("visually indicates the active link based on current pathname (Req 2.4)", () => {
    mockUsePathname.mockReturnValue("/roadmaps");
    render(<NavigationBar />);

    const activeLink = screen.getByRole("link", { name: "Roadmaps" });
    expect(activeLink.className).toMatch(/text-primary/);
    expect(activeLink.className).toMatch(/font-semibold/);

    // An inactive link should not have active classes
    const inactiveLink = screen.getByRole("link", { name: "Projects" });
    expect(inactiveLink.className).toMatch(/text-muted-foreground/);
    expect(inactiveLink.className).not.toMatch(/font-semibold/);
  });

  it("displays a search button (Req 2.3, 2.5)", () => {
    render(<NavigationBar />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it("renders a mobile menu button visible below md breakpoint (Req 2.6, 2.7)", () => {
    render(<NavigationBar />);

    // The mobile menu trigger has an accessible label
    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(menuButton).toBeInTheDocument();

    // Its container has xl:hidden class so it's only visible below the xl breakpoint
    const mobileContainer = menuButton.closest(".xl\\:hidden");
    expect(mobileContainer).toBeInTheDocument();
  });

  it("indicates active link for sub-paths (Req 2.4)", () => {
    mockUsePathname.mockReturnValue("/roadmaps/frontend");
    render(<NavigationBar />);

    const roadmapsLink = screen.getByRole("link", { name: "Roadmaps" });
    expect(roadmapsLink.className).toMatch(/text-primary/);
    expect(roadmapsLink.className).toMatch(/font-semibold/);
  });
});
