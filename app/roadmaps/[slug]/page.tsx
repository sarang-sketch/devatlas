import type { Metadata } from "next";
import Link from "next/link";

import { loadRoadmap } from "@/lib/content/loaders";
import { loadCareerPaths } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY, expandRoute } from "@/lib/seo/routes";
import { RoadmapRenderer } from "@/components/roadmap-renderer";
import { RecommendationsSection } from "@/components/recommendations-section";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, courseSchema } from "@/lib/seo/structured-data";

// ---------------------------------------------------------------------------
// Static Generation (Req 14.3)
// ---------------------------------------------------------------------------

const SLUGS = [
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "ai-engineer",
  "ml-engineer",
  "data-scientist",
  "devops",
  "cloud",
  "cybersecurity",
  "game-dev",
  "blockchain",
  "computer-science",
  "data-analyst",
  "qa-engineer",
  "embedded-systems",
  "ui-ux-designer",
  "digital-marketer",
] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Per-slug SEO metadata (Req 14.2)
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const routeDef = ROUTE_REGISTRY.find((r) => r.pattern === "/roadmaps/[slug]");
  if (routeDef) {
    const concreteRoutes = expandRoute(routeDef);
    const match = concreteRoutes.find((r) => r.path === `/roadmaps/${slug}`);
    if (match) {
      return buildMetadata(match);
    }
  }
  return buildMetadata({});
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function RoadmapPage({ params }: PageProps) {
  const { slug } = await params;
  const result = loadRoadmap(slug);

  // On failure show an error message and keep the page navigable (Req 4.4)
  if (!result.ok) {    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Roadmap Unavailable
        </h1>
        <p className="text-muted-foreground">{result.error}</p>
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          ← Back to Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <RoadmapStructuredData
        careerPathId={result.data.careerPathId}
        slug={slug}
      />
      <RoadmapRenderer roadmap={result.data} />

      <RecommendationsSection careerPathId={result.data.careerPathId} />
    </div>
  );
}

/**
 * Emits Course + BreadcrumbList JSON-LD for a roadmap. The roadmap's display
 * name and description come from the matching career path so the structured
 * data mirrors what users and crawlers see.
 */
function RoadmapStructuredData({
  careerPathId,
  slug,
}: {
  careerPathId: string;
  slug: string;
}) {
  const careerPaths = loadCareerPaths();
  const careerPath = careerPaths.ok
    ? careerPaths.data.find((cp) => cp.id === careerPathId)
    : undefined;

  const name = careerPath ? `${careerPath.name} Roadmap` : "Developer Roadmap";
  const description =
    careerPath?.description ??
    "A step-by-step developer learning roadmap with free tools, projects, and resources.";

  return (
    <JsonLd
      data={[
        courseSchema({ name, description, path: `/roadmaps/${slug}` }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Roadmaps", path: "/roadmaps" },
          { name, path: `/roadmaps/${slug}` },
        ]),
      ]}
    />
  );
}
