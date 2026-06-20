import { describe, it, expect } from "vitest";

import { resolveTheme, isTheme } from "@/lib/theme/theme";

// ---------------------------------------------------------------------------
// resolveTheme (Req 12.1 light default, Req 12.6 apply stored theme)
// ---------------------------------------------------------------------------

describe("resolveTheme", () => {
  it("defaults to light when nothing is stored", () => {
    expect(resolveTheme(null)).toBe("light");
  });

  it("returns the stored theme when it is a valid theme", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("falls back to light for an invalid stored value", () => {
    expect(resolveTheme("")).toBe("light");
    expect(resolveTheme("DARK")).toBe("light");
    expect(resolveTheme("blue")).toBe("light");
  });
});

describe("isTheme", () => {
  it("recognizes the supported themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
  });

  it("rejects null and unsupported values", () => {
    expect(isTheme(null)).toBe(false);
    expect(isTheme("system")).toBe(false);
  });
});
