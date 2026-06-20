"use client";

/**
 * Generic React error boundary (design "Feature Components", Req 1.7).
 *
 * Catches render/runtime errors thrown by its subtree and renders a provided
 * fallback instead, so a failure in one isolated piece of UI (for example the
 * animated {@link HeroRoadmapViz}) never takes down the surrounding page. The
 * headline and call-to-action controls live outside this boundary, so they keep
 * rendering even when the wrapped child throws.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  /** The subtree to guard. */
  children: ReactNode;
  /** What to render once the subtree has thrown. */
  fallback: ReactNode;
  /** Optional hook for logging/telemetry when an error is caught. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Switch to the fallback on the next render after a child throws.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
