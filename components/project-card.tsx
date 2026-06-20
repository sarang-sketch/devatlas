import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/domain/types";

interface ProjectCardProps {
  project: Project;
}

/**
 * Displays a project summary card with name, skill-level badge,
 * description snippet, required skills, estimated time, and tech stack.
 * Links to the project detail page at /projects/{id} (Req 8.2, 8.6).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {project.name}
        </h3>
        <Badge variant="secondary">{project.skillLevel}</Badge>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {project.description}
      </p>

      <div className="mb-2 flex flex-wrap gap-1">
        {project.requiredSkills.map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
        <span>⏱ {project.estimatedTime}</span>
        <span className="truncate text-right">
          {project.techStack.slice(0, 3).join(", ")}
          {project.techStack.length > 3 && "…"}
        </span>
      </div>
    </Link>
  );
}
