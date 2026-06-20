"use client";

/**
 * ToolsLibrary client component (Req 6.3, 6.6, 6.7, 6.8, 6.9).
 *
 * SINGLE-SELECT ONLY — exactly one filter active at a time across
 * the entire page. Selecting a category deselects any active tag, and
 * selecting a tag deselects any active category.
 */

import { useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tool-card";
import { filterTools } from "@/lib/domain/tools";
import type { Tool, ToolCategory } from "@/lib/domain/types";

// The fifteen supported categories (Req 6.1).
const ALL_CATEGORIES: ToolCategory[] = [
  "AI",
  "Hosting",
  "Databases",
  "Domains",
  "Analytics",
  "Auth",
  "Storage",
  "Monitoring",
  "CI/CD",
  "APIs",
  "Design",
  "Productivity",
  "Testing",
  "Security",
  "Open Source",
];

/** Max tags to show before "Show more" toggle. */
const MAX_VISIBLE_TAGS = 20;

export interface ToolsLibraryProps {
  /** The loaded tools. Empty array when load succeeded with no tools. */
  tools: Tool[];
  /** True when the data loader failed (Req 6.9). */
  loadError?: boolean;
}

export function ToolsLibrary({ tools, loadError = false }: ToolsLibraryProps) {
  // Only ONE active filter at a time: either a category or a tag.
  const [activeFilter, setActiveFilter] = useState<
    { type: "category"; value: ToolCategory } | { type: "tag"; value: string } | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  // Derive all unique tags from the tool set for the tag filter.
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const tool of tools) {
      for (const tag of tool.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [tools]);

  const visibleTags = showAllTags ? allTags : allTags.slice(0, MAX_VISIBLE_TAGS);

  // Apply single filter.
  const filteredTools = useMemo(() => {
    const categoryFilter =
      activeFilter?.type === "category" ? [activeFilter.value] : [];
    const tagFilter =
      activeFilter?.type === "tag" ? [activeFilter.value] : [];
    let result = filterTools(tools, { categories: categoryFilter, tags: tagFilter });

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some((t) => t.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tools, activeFilter, searchQuery]);

  const hasActiveFilters = activeFilter !== null || searchQuery.trim() !== "";

  // --- Handlers (single-select: toggle on/off, auto-deselect other) ---

  function selectCategory(category: ToolCategory) {
    setActiveFilter((prev) =>
      prev?.type === "category" && prev.value === category
        ? null
        : { type: "category", value: category }
    );
  }

  function selectTag(tag: string) {
    setActiveFilter((prev) =>
      prev?.type === "tag" && prev.value === tag
        ? null
        : { type: "tag", value: tag }
    );
  }

  function clearFilters() {
    setActiveFilter(null);
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      {/* Load-error message — controls remain visible below (Req 6.9) */}
      {loadError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
        >
          <p className="text-destructive font-medium">
            Unable to load tools. Please try again later.
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tools by name, category, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters section */}
      <section aria-label="Tool filters" className="space-y-4">
        {/* Category — single-select pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Category
            </h2>
            <span className="text-[10px] text-muted-foreground/60">(one at a time)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((category) => {
              const isSelected =
                activeFilter?.type === "category" &&
                activeFilter.value === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => selectCategory(category)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tag — single-select compact pills with show more/less */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Tag
            </h2>
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => {
                const isSelected =
                  activeFilter?.type === "tag" && activeFilter.value === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectTag(tag)}
                    className={[
                      "rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {tag}
                  </button>
                );
              })}
              {/* Show more / less toggle */}
              {allTags.length > MAX_VISIBLE_TAGS && (
                <button
                  type="button"
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-accent"
                >
                  {showAllTags ? (
                    <>Show less <ChevronUp className="size-3" /></>
                  ) : (
                    <>{allTags.length - MAX_VISIBLE_TAGS} more <ChevronDown className="size-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active filter info + clear */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
              <X className="size-3" />
              Clear filters
            </Button>
            <span className="text-xs text-muted-foreground">
              Showing {filteredTools.length} of {tools.length} tools
              {activeFilter && (
                <> — filtered by{" "}
                  <span className="font-medium text-foreground">
                    {activeFilter.value}
                  </span>
                </>
              )}
            </span>
          </div>
        )}
      </section>

      {/* Results section */}
      {!loadError && filteredTools.length === 0 && hasActiveFilters && (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center space-y-4">
          <p className="text-muted-foreground font-medium">
            No tools match the selected filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {/* Tool count when no filter */}
      {!loadError && filteredTools.length > 0 && !hasActiveFilters && (
        <p className="text-sm text-muted-foreground">
          {filteredTools.length} free tool{filteredTools.length !== 1 ? "s" : ""} available
        </p>
      )}

      {/* Tool card grid */}
      {!loadError && filteredTools.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
