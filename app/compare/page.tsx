import type { Metadata } from "next";

import { ComparisonView } from "@/components/comparison-view";
import { loadTools } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// Per-page SEO metadata for "/compare" sourced from the shared route registry
// (Req 14.2, 14.5).
const compareRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/compare");
export const metadata: Metadata = buildMetadata(compareRoute ?? {});

/**
 * /compare — Tool Comparison page (Req 9).
 *
 * Server component that loads all tools via the content layer and delegates
 * the interactive comparison selection + table rendering to the client-side
 * ComparisonView component.
 */
export default function ComparePage() {
  const result = loadTools();

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Compare Developer Tools
        </h1>
        <p className="mt-4 text-destructive">
          {result.error}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Compare Developer Tools
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Select two to four tools and compare them side by side across free tier,
        database, auth, storage, realtime, pricing, and learning curve.
      </p>
      <div className="mt-8">
        <ComparisonView tools={result.data} />
      </div>
    </section>
  );
}
