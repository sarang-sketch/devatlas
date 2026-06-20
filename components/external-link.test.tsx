import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import {
  ExternalLink,
  OPEN_FAILED_MESSAGE,
} from "@/components/external-link";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ExternalLink", () => {
  it("renders an anchor that opens in a new tab without leaking the opener (Req 5.10, 6.4)", () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("opens the destination and shows no error on a successful open", () => {
    // A successful open returns a truthy window reference.
    const open = vi
      .spyOn(window, "open")
      .mockReturnValue({} as Window);

    render(<ExternalLink href="https://example.com">Example</ExternalLink>);

    act(() => {
      screen.getByRole("link", { name: "Example" }).click();
    });

    expect(open).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText(OPEN_FAILED_MESSAGE)).toBeNull();
  });

  it("shows the error and preserves the current view when the open is blocked (Req 5.11, 6.5)", () => {
    // A blocked open returns null.
    vi.spyOn(window, "open").mockReturnValue(null);
    const onError = vi.fn();
    const locationBefore = window.location.href;

    render(
      <ExternalLink href="https://example.com" onError={onError}>
        Example
      </ExternalLink>,
    );

    act(() => {
      screen.getByRole("link", { name: "Example" }).click();
    });

    expect(screen.getByRole("alert").textContent).toBe(OPEN_FAILED_MESSAGE);
    expect(onError).toHaveBeenCalledWith("https://example.com");
    // The current view is preserved (no navigation away).
    expect(window.location.href).toBe(locationBefore);
  });

  it("shows the error when window.open throws (Req 5.11, 6.5)", () => {
    vi.spyOn(window, "open").mockImplementation(() => {
      throw new Error("popup blocked");
    });
    const locationBefore = window.location.href;

    render(<ExternalLink href="https://example.com">Example</ExternalLink>);

    act(() => {
      screen.getByRole("link", { name: "Example" }).click();
    });

    expect(screen.getByRole("alert").textContent).toBe(OPEN_FAILED_MESSAGE);
    expect(window.location.href).toBe(locationBefore);
  });
});
