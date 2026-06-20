import type { Metadata } from "next";

import { ResourceCard } from "@/components/resource-card";
import { loadResources } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// Per-page SEO metadata for "/resources" sourced from the shared route registry
// (Req 14.2, 14.5).
const resourcesRoute = ROUTE_REGISTRY.find(
  (route) => route.pattern === "/resources",
);
export const metadata: Metadata = buildMetadata(resourcesRoute ?? {});

export default function ResourcesPage() {
  const result = loadResources();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Developer Learning Resources
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A curated collection of free courses, documentation, platforms, and
        tools to accelerate your developer journey.
      </p>

      {!result.ok ? (
        <div
          role="alert"
          className="mt-8 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {result.error}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </section>
  );
}
