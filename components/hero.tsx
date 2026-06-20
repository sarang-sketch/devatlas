"use client";

/**
 * DevAtlas homepage hero (Req 1).
 *
 * Communicates what DevAtlas offers and where to start: the headline
 * "Master Any Developer Path", a supporting subheadline and tagline, the two
 * primary call-to-action controls, and the animated roadmap visualization.
 *
 * Framer Motion applies a subtle fade-in + slide-up entrance animation on the
 * headline and CTAs (Req 1.1, 1.4).
 *
 * Fault isolation (Req 1.7): the visualization is wrapped in an
 * {@link ErrorBoundary} that renders the static {@link HeroFallbackImage} on
 * failure. The headline and both CTAs live *outside* the boundary, so they keep
 * rendering even if the visualization throws.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary";
import { HeroFallbackImage } from "@/components/hero-fallback";
import { HeroRoadmapViz } from "@/components/hero-roadmap-viz";
import { cn } from "@/lib/utils";

export const HERO_HEADLINE = "Master Any Developer Path";
export const HERO_SUBHEADLINE =
  "Interactive roadmaps, free tools, projects, resources and deployment guides — all in one place.";
export const HERO_TAGLINE = "Your complete map to becoming a developer.";

/** Shared fade-in + slide-up animation variants. */
const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface HeroProps {
  /**
   * The visualization to render inside the error boundary. Defaults to the
   * live {@link HeroRoadmapViz}; tests can inject an alternative (e.g. a
   * component that throws) to exercise the fallback path.
   */
  viz?: ReactNode;
}

export function Hero({ viz }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Layered background: dotted grid + soft radial glow (decorative). */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:py-28">
        {/* Copy + CTAs: outside the error boundary so they always render. */}
        <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-left">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0 }}
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {HERO_TAGLINE}
          </motion.span>

          <motion.h1
            id="hero-heading"
            className="text-4xl font-extrabold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master Any <span className="text-gradient text-gradient--shimmer">Developer Path</span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-lg leading-8 text-muted-foreground text-pretty"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {HERO_SUBHEADLINE}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/roadmaps"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-6 shadow-sm transition-transform hover:-translate-y-0.5",
              )}
            >
              Explore Roadmaps
            </Link>
            <Link
              href="/tools"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-6 transition-transform hover:-translate-y-0.5",
              )}
            >
              Discover Free Tools
            </Link>
          </motion.div>

          {/* Lightweight trust signals. */}
          <motion.ul
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground md:justify-start"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <li>12 career roadmaps</li>
            <li aria-hidden className="text-border">•</li>
            <li>50+ free-tier tools</li>
            <li aria-hidden className="text-border">•</li>
            <li>No account required</li>
          </motion.ul>
        </div>

        {/* Visualization: isolated so a failure degrades to the static image. */}
        <div
          id="hero-viz-area"
          className="flex w-full max-w-md flex-1 items-center justify-center min-h-[240px]"
        >
          <div className="aspect-[4/3] w-full rounded-2xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-sm">
            <ErrorBoundary fallback={<HeroFallbackImage className="h-full w-full" />}>
              {viz ?? <HeroRoadmapViz className="h-full w-full" />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
