"use client";

/**
 * ProjectsHub — full-featured projects browser with search and skill-level
 * filtering (Req 8).
 *
 * Provides:
 * - A search input to filter by name, description, skills, or tech stack
 * - Skill level filter buttons (All / Beginner / Intermediate / Advanced / Production-grade)
 * - Renders matching projects using ProjectCard
 * - Shows a clean empty state with a clear button when nothing matches
 */

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import type { Project, SkillLevel } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export interface ProjectsHubProps {
  projects: Project[];
}

const SKILL_LEVELS: (SkillLevel | "All")[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Production-grade",
];

function matchesSearch(project: Project, query: string): boolean {
  const q = query.toLowerCase();
  return (
    project.name.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q) ||
    project.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
    project.techStack.some((t) => t.toLowerCase().includes(q)) ||
    project.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function ProjectsHub({ projects }: ProjectsHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | "All">("All");

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (selectedLevel !== "All") {
      result = result.filter((p) => p.skillLevel === selectedLevel);
    }

    if (searchQuery.trim().length > 0) {
      result = result.filter((p) => matchesSearch(p, searchQuery.trim()));
    }

    return result;
  }, [projects, selectedLevel, searchQuery]);

  const hasActiveFilters = selectedLevel !== "All" || searchQuery.trim().length > 0;

  function clearFilters() {
    setSearchQuery("");
    setSelectedLevel("All");
  }

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects by name, skill, or tech..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search projects"
        />
        {searchQuery.length > 0 && (
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

      {/* Skill level filter */}
      <div className="flex flex-wrap gap-2">
        {SKILL_LEVELS.map((level) => {
          const isActive = selectedLevel === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
              )}
              aria-pressed={isActive}
            >
              {level}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filteredProjects.length === 0 && hasActiveFilters ? (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center space-y-4">
          <p className="text-muted-foreground font-medium">
            No projects match the selected filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground font-medium">
            No projects available yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Active filter summary */}
      {hasActiveFilters && filteredProjects.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} project
          {projects.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
