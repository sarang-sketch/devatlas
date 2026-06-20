"use client";

/**
 * ResourceCard — client component that displays a single learning resource
 * with a bookmark button for saving to the dashboard.
 */

import { ExternalLink } from "@/components/external-link";
import { BookmarkButton } from "@/components/bookmark-button";
import type { LearningResource } from "@/lib/domain/types";

interface ResourceCardProps {
  resource: LearningResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{resource.name}</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {resource.resourceType}
          </span>
        </div>
        <BookmarkButton resourceId={resource.id} />
      </div>
      <ExternalLink
        href={resource.url}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        Visit resource →
      </ExternalLink>
    </article>
  );
}
