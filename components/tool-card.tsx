"use client";

/**
 * ToolCard component.
 *
 * Displays a single tool with a favicon tile, color-coded category badge with
 * an icon, a highlighted free-tier callout (the #1 value users scan for), and
 * optional alternatives and tags. Includes a SaveToolButton so the tool can be
 * saved to / removed from the user's dashboard.
 *
 * Shows a 🇮🇳 "Free for India" ribbon when the tool carries the "free-india" tag.
 */

import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "@/components/external-link";
import { SaveToolButton } from "@/components/save-tool-button";
import { getCategoryTheme, getDomain } from "@/lib/design/category-theme";
import type { Tool } from "@/lib/domain/types";

export interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isFreeIndia = tool.tags.includes("free-india");
  const theme = getCategoryTheme(tool.category);
  const CategoryIcon = theme.icon;
  const domain = getDomain(tool.website);
  const faviconSrc = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      {/* Subtle category tint wash on hover (decorative). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* 🇮🇳 Free for India ribbon */}
      {isFreeIndia && (
        <div className="absolute -right-12 top-3 rotate-45 bg-gradient-to-r from-orange-500 via-white to-green-600 px-10 py-0.5 text-[10px] font-bold text-gray-900 shadow-md">
          🇮🇳 Free for India
        </div>
      )}

      {/* Header: logo tile + name + save + category badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Favicon tile (tinted with the category color). */}
          <div
            className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border ${theme.tile}`}
          >
            {faviconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faviconSrc}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                className="size-7 rounded object-contain"
              />
            ) : (
              <CategoryIcon className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <span className="text-[11px] text-muted-foreground">{domain}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <SaveToolButton toolId={tool.id} />
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      {/* Free-tier callout — the #1 value users scan for. */}
      <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Free tier
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-foreground/80">
          {tool.freeTier}
        </p>
      </div>

      {/* Footer: category badge + website link */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${theme.badge}`}
        >
          <CategoryIcon className="size-3.5" />
          {tool.category}
        </span>

        <ExternalLink
          href={tool.website}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          Visit website
          <svg
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </ExternalLink>
      </div>

      {/* Tags — hide the internal free-india marker. */}
      {tool.tags && tool.tags.filter((tag) => tag !== "free-india").length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
          {tool.tags
            .filter((tag) => tag !== "free-india")
            .slice(0, 5)
            .map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                {tag}
              </Badge>
            ))}
        </div>
      )}
    </article>
  );
}
