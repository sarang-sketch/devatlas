import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { ThemeProvider, useTheme } from "@/components/theme-provider";

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  vi.restoreAllMocks();
});

/** A small probe component that exposes the theme context for assertions. */
function Probe() {
  const { theme, setTheme, persistenceError } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="persistence-error">{String(persistenceError)}</span>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("light")}>light</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("defaults to light with no dark class when nothing is stored", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByTestId("persistence-error").textContent).toBe("false");
  });

  it("applies the dark class on setTheme('dark')", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("dark").click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByTestId("persistence-error").textContent).toBe("false");
  });

  it("sets persistenceError but keeps the theme applied when the write fails (Req 12.7)", () => {
    // Force the underlying store write to fail.
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("dark").click();
    });

    // The selection still applies for the session...
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    // ...but the persistence error is surfaced.
    expect(screen.getByTestId("persistence-error").textContent).toBe("true");
  });

  it("restores a stored dark theme on mount (Req 12.6)", () => {
    window.localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify("dark"));

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("throws when useTheme is used outside a ThemeProvider", () => {
    // Silence the expected React error boundary log.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      /useTheme must be used within a ThemeProvider/,
    );
    spy.mockRestore();
  });
});

// Re-declare the key locally to avoid coupling the test to import order.
const STORAGE_KEY_THEME = "devatlas:theme";
