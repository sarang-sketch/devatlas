"use client";

/**
 * DevAtlas shared external-link component (design "Feature Components" →
 * `ExternalLink`, Req 5.10, 5.11, 6.4, 6.5).
 *
 * Renders a real anchor so it stays keyboard operable and is announced as a
 * link, always carrying `target="_blank" rel="noopener noreferrer"` so an
 * ordinary activation opens the destination in a new browser tab without
 * leaking the opener window (Req 5.10, 6.4).
 *
 * A plain `target="_blank"` anchor rarely fails synchronously, so the open is
 * driven through an `onClick` handler that calls `window.open(...)` and detects
 * a blocked/failed open: when the call returns a falsy reference or throws, the
 * default navigation is prevented and a non-blocking inline error message is
 * shown next to the link while the current view is preserved (Req 5.11, 6.5).
 * On a successful open the destination is opened in the new tab and the current
 * view is left unchanged.
 */

import { useState, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Message shown next to the link when the external site could not be opened. */
export const OPEN_FAILED_MESSAGE = "This link could not be opened.";

export interface ExternalLinkProps {
  /** Destination URL opened in a new browser tab. */
  href: string;
  /** Accessible label / visible content for the link. */
  children: ReactNode;
  /** Optional class names applied to the anchor element. */
  className?: string;
  /** Optional callback invoked with the href when the open fails. */
  onError?: (href: string) => void;
}

export function ExternalLink({
  href,
  children,
  className,
  onError,
}: ExternalLinkProps) {
  const [openFailed, setOpenFailed] = useState(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Take control of the open so a blocked/failed attempt can be detected and
    // the current view preserved instead of navigating away (Req 5.11, 6.5).
    event.preventDefault();

    let opened: Window | null = null;
    try {
      opened = window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      opened = null;
    }

    if (!opened) {
      // Blocked or failed: surface a non-blocking notice and keep the view.
      setOpenFailed(true);
      onError?.(href);
      return;
    }

    // Success: a new tab opened; clear any prior error, leave the view intact.
    setOpenFailed(false);
  };

  return (
    <span className="inline-flex flex-col gap-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(className)}
      >
        {children}
      </a>
      {openFailed ? (
        <span role="alert" className="text-sm text-destructive">
          {OPEN_FAILED_MESSAGE}
        </span>
      ) : null}
    </span>
  );
}
