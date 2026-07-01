import type { Metadata } from "next";
import Link from "next/link";

import { loadCareerPaths } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

// Per-page SEO metadata for "/roadmaps" sourced from the shared route registry
// (Req 14.2, 14.5).
const roadmapsRoute = ROUTE_REGISTRY.find(
  (route) => route.pattern === "/roadmaps",
);
export const metadata: Metadata = buildMetadata(roadmapsRoute ?? {});

export default function RoadmapsCatalogPage() {
  const result = loadCareerPaths();

  // Graceful catalog-level error handling (Req 4.4 pattern applied to catalog).
  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Developer Career Roadmaps
        </h1>
        <div
          role="alert"
          className="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
        >
          <p className="text-destructive font-medium">
            Unable to load career paths. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const careerPaths = result.data;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          itemListSchema({
            name: "Developer Career Roadmaps",
            description:
              "Step-by-step developer career roadmaps with free tools, projects, and resources.",
            path: "/roadmaps",
            items: careerPaths.map((path) => ({
              name: `${path.name} Roadmap`,
              path: `/roadmaps/${path.id}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Roadmaps", path: "/roadmaps" },
          ]),
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Developer Career Roadmaps
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Choose a specialization and follow a step-by-step learning roadmap with
        free resources, tools, and projects.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {careerPaths.map((path) => (
          <Link
            key={path.id}
            href={`/roadmaps/${path.id}`}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {path.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {path.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
