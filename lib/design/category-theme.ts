/**
 * Per-category visual identity for tool categories.
 *
 * Every category gets a signature color (from the brand palette), a Lucide
 * icon name, and Tailwind class fragments for badges and accents. This keeps
 * the 14 categories visually distinct so users can scan the tools grid at a
 * glance, without introducing any new dependencies.
 *
 * Classes are kept static (no runtime string interpolation) so Tailwind's
 * compiler can see them at build time.
 */

import {
  Sparkles,
  Cloud,
  Database,
  BarChart3,
  KeyRound,
  HardDrive,
  Activity,
  GitBranch,
  Plug,
  Palette,
  Zap,
  TestTube2,
  ShieldCheck,
  Code2,
  Globe,
  type LucideIcon,
} from "lucide-react";

import type { ToolCategory } from "@/lib/domain/types";

export interface CategoryTheme {
  /** Icon glyph used in badges and accents. */
  icon: LucideIcon;
  /** Badge background + text classes (static Tailwind tokens). */
  badge: string;
  /** Logo tile background tint (static Tailwind tokens). */
  tile: string;
}

const THEMES: Record<ToolCategory, CategoryTheme> = {
  AI: {
    icon: Sparkles,
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-300 ring-1 ring-inset ring-violet-500/20",
    tile: "bg-violet-500/10",
  },
  Hosting: {
    icon: Cloud,
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-sky-500/20",
    tile: "bg-sky-500/10",
  },
  Databases: {
    icon: Database,
    badge: "bg-teal-500/10 text-teal-600 dark:text-teal-300 ring-1 ring-inset ring-teal-500/20",
    tile: "bg-teal-500/10",
  },
  Analytics: {
    icon: BarChart3,
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20",
    tile: "bg-indigo-500/10",
  },
  Auth: {
    icon: KeyRound,
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20",
    tile: "bg-amber-500/10",
  },
  Storage: {
    icon: HardDrive,
    badge: "bg-pink-500/10 text-pink-600 dark:text-pink-300 ring-1 ring-inset ring-pink-500/20",
    tile: "bg-pink-500/10",
  },
  Monitoring: {
    icon: Activity,
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
    tile: "bg-emerald-500/10",
  },
  "CI/CD": {
    icon: GitBranch,
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-300 ring-1 ring-inset ring-blue-500/20",
    tile: "bg-blue-500/10",
  },
  APIs: {
    icon: Plug,
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 ring-1 ring-inset ring-cyan-500/20",
    tile: "bg-cyan-500/10",
  },
  Design: {
    icon: Palette,
    badge: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 ring-1 ring-inset ring-fuchsia-500/20",
    tile: "bg-fuchsia-500/10",
  },
  Productivity: {
    icon: Zap,
    badge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 ring-1 ring-inset ring-yellow-500/20",
    tile: "bg-yellow-500/10",
  },
  Testing: {
    icon: TestTube2,
    badge: "bg-lime-500/10 text-lime-600 dark:text-lime-300 ring-1 ring-inset ring-lime-500/20",
    tile: "bg-lime-500/10",
  },
  Security: {
    icon: ShieldCheck,
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-300 ring-1 ring-inset ring-rose-500/20",
    tile: "bg-rose-500/10",
  },
  "Open Source": {
    icon: Code2,
    badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20",
    tile: "bg-slate-500/10",
  },
  Domains: {
    icon: Globe,
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-300 ring-1 ring-inset ring-orange-500/20",
    tile: "bg-orange-500/10",
  },
};

/** Returns the visual theme for a given tool category. */
export function getCategoryTheme(category: ToolCategory): CategoryTheme {
  return THEMES[category];
}

/**
 * Extracts a registered hostname from a tool's website URL so we can fetch a
 * favicon. Returns an empty string when the URL cannot be parsed.
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
