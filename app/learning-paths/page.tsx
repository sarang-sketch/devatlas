import type { Metadata } from "next";

import { PathGeneratorPage } from "@/components/path-generator-form";
import { loadCareerPaths } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// ---------------------------------------------------------------------------
// SEO metadata (Req 14.2, 14.5)
// ---------------------------------------------------------------------------

const learningPathsRoute = ROUTE_REGISTRY.find(
  (r) => r.pattern === "/learning-paths",
);
export const metadata: Metadata = buildMetadata(learningPathsRoute ?? {});

// ---------------------------------------------------------------------------
// Page Component (Req 10)
// ---------------------------------------------------------------------------

/**
 * /learning-paths — Learning Path Generator (Req 10).
 *
 * Server component that loads career paths for the dropdown and delegates the
 * interactive form + generated-path rendering to the client-side
 * PathGeneratorPage component.
 */
export default function LearningPathsPage() {
  const result = loadCareerPaths();

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Personalized Learning Paths
        </h1>
        <p className="mt-4 text-destructive">{result.error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Personalized Learning Paths
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Generate a personalized roadmap based on your goal, available time, and
        current skill level.
      </p>
      <div className="mt-8">
        <PathGeneratorPage careerPaths={result.data} />
      </div>
    </section>
  );
}
