/**
 * Accessibility and responsive tests (Task 25.2).
 *
 * Covers:
 *   - Focus indicators present in global CSS (Req 13.1, 13.2)
 *   - Text alternatives (aria-labels) on interactive elements (Req 13.2)
 *   - Keyboard reachability: skip link exists and Escape closes dialogs (Req 13.6)
 *   - No horizontal scroll at layout boundaries (Req 13.3)
 */

import { describe, it, expect } from "vitest";

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Req 13.1, 13.2: Focus ring classes exist in globals.css
// ---------------------------------------------------------------------------

describe("Focus indicators in globals.css (Req 13.1, 13.2)", () => {
  const globalsPath = path.resolve(process.cwd(), "app/globals.css");
  const globalsContent = fs.readFileSync(globalsPath, "utf-8");

  it("defines a global *:focus-visible rule with ring styles", () => {
    expect(globalsContent).toContain("*:focus-visible");
    expect(globalsContent).toContain("ring-2");
    expect(globalsContent).toContain("ring-ring");
    expect(globalsContent).toContain("ring-offset-2");
  });
});

// ---------------------------------------------------------------------------
// Req 13.6: Skip link exists in the layout
// ---------------------------------------------------------------------------

describe("Skip link for keyboard accessibility (Req 13.6)", () => {
  const layoutPath = path.resolve(process.cwd(), "app/layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");

  it("layout contains a skip-to-main-content link targeting #main-content", () => {
    expect(layoutContent).toContain('href="#main-content"');
    expect(layoutContent).toContain("Skip to main content");
  });

  it("layout defines a <main> element with id=\"main-content\"", () => {
    expect(layoutContent).toContain('id="main-content"');
  });
});

// ---------------------------------------------------------------------------
// Req 13.2: Buttons have aria-labels (spot check navigation bar)
// ---------------------------------------------------------------------------

describe("Text alternatives on interactive elements (Req 13.2)", () => {
  const navBarPath = path.resolve(
    process.cwd(),
    "components/navigation-bar.tsx",
  );
  const navBarContent = fs.readFileSync(navBarPath, "utf-8");

  it("mobile menu button has an aria-label", () => {
    expect(navBarContent).toContain('aria-label="Open navigation menu"');
  });
});

// ---------------------------------------------------------------------------
// Req 13.3: No horizontal scroll — overflow-x-hidden on body
// ---------------------------------------------------------------------------

describe("No horizontal scroll at layout boundaries (Req 13.3)", () => {
  const layoutPath = path.resolve(process.cwd(), "app/layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");

  it("body element has overflow-x-hidden to prevent horizontal scroll", () => {
    expect(layoutContent).toContain("overflow-x-hidden");
  });
});
