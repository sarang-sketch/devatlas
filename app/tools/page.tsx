import type { Metadata } from "next";

import { ToolsLibrary } from "@/components/tools-library";
import { loadTools } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

// Per-page SEO metadata for "/tools" sourced from the shared route registry
// (Req 14.2, 14.5).
const toolsRoute = ROUTE_REGISTRY.find((route) => route.pattern === "/tools");
export const metadata: Metadata = buildMetadata(toolsRoute ?? {});

/**
 * Tools Library server component (Req 6).
 *
 * Loads tools at build time / request time and delegates rendering to the
 * client-side ToolsLibrary component which manages filter state. On load
 * failure, passes an error flag so the UI can show an error while keeping
 * filter controls visible (Req 6.9).
 */
export default function ToolsPage() {
  const result = loadTools();

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Free Developer Tools
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Discover free and free-tier developer tools across 14 categories.
        </p>
        <div className="mt-8">
          <ToolsLibrary tools={[]} loadError />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          itemListSchema({
            name: "Free Developer Tools",
            description:
              "A curated library of free and free-tier developer tools across 14 categories.",
            path: "/tools",
            items: result.data.map((tool) => ({
              name: tool.name,
              path: `/tools/${tool.id}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
          ]),
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Free Developer Tools
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Discover free and free-tier developer tools across 14 categories.
      </p>
      <div className="mt-8">
        <ToolsLibrary tools={result.data} />
      </div>
    </section>
  );
}
