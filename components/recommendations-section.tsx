import Link from "next/link";

import { getCareerPath } from "@/lib/domain/catalog";
import { loadTools } from "@/lib/content/loaders";
import { recommendTools } from "@/lib/domain/tools";
import type { CareerPathId } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RecommendationsSectionProps {
  careerPathId: CareerPathId;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RecommendationsSection — renders tools matched to the career path with a
 * control to navigate to each tool's card page (Req 7.1, 7.4).
 *
 * If no tools match the career path's tags, the section is omitted entirely
 * (returns null, Req 7.5).
 */
export function RecommendationsSection({ careerPathId }: RecommendationsSectionProps) {
  const careerPath = getCareerPath(careerPathId);
  if (!careerPath) {
    return null;
  }

  const toolsResult = loadTools();
  if (!toolsResult.ok) {
    return null;
  }

  const recommended = recommendTools(careerPath, toolsResult.data);

  // Omit the section entirely when there are no matches (Req 7.5)
  if (recommended.length === 0) {
    return null;
  }

  return (
    <section aria-label="Recommended Tools" className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Recommended Tools
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommended.map((tool) => (
          <div
            key={tool.id}
            className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <h3 className="text-sm font-medium text-foreground">{tool.name}</h3>
            <p className="text-xs text-muted-foreground">{tool.category}</p>
            <Link
              href={`/tools/${tool.id}`}
              className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
            >
              View Tool →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
