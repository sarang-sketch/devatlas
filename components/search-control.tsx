"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  buildSearchIndex,
  search,
  MIN_QUERY_LENGTH,
  type ContentBundle,
} from "@/lib/domain/search";
import {
  loadCareerPaths,
  loadRoadmap,
  loadTools,
  loadProjects,
  loadResources,
} from "@/lib/content/loaders";
import type { ContentType, GroupedResults, SearchIndex } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Content-type display labels
// ---------------------------------------------------------------------------

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  roadmap: "Roadmap",
  node: "Skill",
  technology: "Project",
  tool: "Tool",
  database: "Database",
  api: "API",
  hosting: "Hosting",
  "ai-service": "AI Service",
  resource: "Resource",
};

// ---------------------------------------------------------------------------
// Lazy singleton search index
// ---------------------------------------------------------------------------

let cachedIndex: SearchIndex | null = null;

function getSearchIndex(): SearchIndex {
  if (cachedIndex) return cachedIndex;

  const bundle: ContentBundle = {
    careerPaths: [],
    roadmaps: [],
    tools: [],
    projects: [],
    resources: [],
  };

  const pathsResult = loadCareerPaths();
  if (pathsResult.ok) {
    bundle.careerPaths = pathsResult.data;

    // Load all roadmaps from the career paths
    for (const path of pathsResult.data) {
      const roadmapResult = loadRoadmap(path.id);
      if (roadmapResult.ok) {
        bundle.roadmaps.push(roadmapResult.data);
      }
    }
  }

  const toolsResult = loadTools();
  if (toolsResult.ok) bundle.tools = toolsResult.data;

  const projectsResult = loadProjects();
  if (projectsResult.ok) bundle.projects = projectsResult.data;

  const resourcesResult = loadResources();
  if (resourcesResult.ok) bundle.resources = resourcesResult.data;

  cachedIndex = buildSearchIndex(bundle);
  return cachedIndex;
}

// ---------------------------------------------------------------------------
// SearchControl component
// ---------------------------------------------------------------------------

export function SearchControl() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.length < MIN_QUERY_LENGTH) {
        setResults({});
        return;
      }
      const index = getSearchIndex();
      const grouped = search(index, value);
      setResults(grouped);
    }, 150);
  }, []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Navigate to result and close dialog
  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setResults({});
      router.push(href);
    },
    [router]
  );

  // Reset state when dialog closes
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
      setResults({});
    }
  }, []);

  // Determine if we have results
  const resultEntries = Object.entries(results) as [ContentType, GroupedResults[ContentType]][];
  const hasResults = resultEntries.some(([, items]) => items && items.length > 0);
  const showNoResults = query.length >= MIN_QUERY_LENGTH && !hasResults;

  return (
    <>
      {/* Desktop: visible search trigger with ⌘K hint */}
      <Button
        variant="outline"
        aria-label="Search DevAtlas"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex h-9 w-40 lg:w-48 2xl:w-56 justify-start gap-2 px-3 text-sm font-normal text-muted-foreground hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile: compact icon button */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="text-muted-foreground md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="size-5" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search DevAtlas"
        description="Search across roadmaps, tools, projects, and resources"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search roadmaps, tools, projects..."
            value={query}
            onValueChange={handleQueryChange}
          />
          <CommandList>
            {showNoResults && (
              <CommandEmpty>
                No results for &ldquo;{query}&rdquo;
              </CommandEmpty>
            )}

            {resultEntries.map(([type, items]) => {
              if (!items || items.length === 0) return null;
              return (
                <CommandGroup key={type} heading={CONTENT_TYPE_LABELS[type]}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {CONTENT_TYPE_LABELS[item.type]}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
