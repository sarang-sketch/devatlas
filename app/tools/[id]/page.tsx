import type { Metadata } from "next";
import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { loadTools } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY, expandRoute } from "@/lib/seo/routes";

// ---------------------------------------------------------------------------
// Static Generation (Req 14.3)
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  const result = loadTools();
  if (!result.ok) return [];
  return result.data.map((tool) => ({ id: tool.id }));
}

// ---------------------------------------------------------------------------
// Per-tool SEO metadata (Req 14.2)
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const routeDef = ROUTE_REGISTRY.find((r) => r.pattern === "/tools/[id]");
  if (routeDef) {
    const concreteRoutes = expandRoute(routeDef);
    const match = concreteRoutes.find((r) => r.path === `/tools/${id}`);
    if (match) {
      return buildMetadata(match);
    }
  }
  return buildMetadata({});
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ToolDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = loadTools();

  if (!result.ok) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Tools
        </h1>
        <p className="text-muted-foreground">{result.error}</p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          ← Back to Tools
        </Link>
      </div>
    );
  }

  const tool = result.data.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Tool Not Found
        </h1>
        <p className="text-muted-foreground">
          No tool with the id &ldquo;{id}&rdquo; could be found.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          ← Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{tool.name}</h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tool.category}
          </span>
        </div>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      {/* Free-tier details */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">Free Tier</h2>
        <p className="mt-2 text-muted-foreground">{tool.freeTier}</p>
      </section>

      {/* Website link */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">Website</h2>
        <div className="mt-2">
          <ExternalLink
            href={tool.website}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {tool.website}
          </ExternalLink>
        </div>
      </section>

      {/* Alternatives */}
      {tool.alternatives && tool.alternatives.length > 0 && (
        <section className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Alternatives</h2>
          <ul className="mt-2 flex flex-col gap-1">
            {tool.alternatives.map((alt) => (
              <li key={alt} className="text-muted-foreground">
                <Link
                  href={`/tools/${alt}`}
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {alt}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <section className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Tags</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Comparison attributes */}
      {tool.comparison && Object.keys(tool.comparison).length > 0 && (
        <section className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Comparison Attributes
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tool.comparison.databaseSupport !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Database Support</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.databaseSupport}
                </dd>
              </div>
            )}
            {tool.comparison.authSupport !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Auth Support</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.authSupport}
                </dd>
              </div>
            )}
            {tool.comparison.storageSupport !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Storage Support</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.storageSupport}
                </dd>
              </div>
            )}
            {tool.comparison.realtimeSupport !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Realtime Support</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.realtimeSupport}
                </dd>
              </div>
            )}
            {tool.comparison.pricing !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Pricing</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.pricing}
                </dd>
              </div>
            )}
            {tool.comparison.learningCurve !== undefined && (
              <div>
                <dt className="text-sm font-medium text-foreground">Learning Curve</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {tool.comparison.learningCurve}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Back link */}
      <div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          ← Back to Tools
        </Link>
      </div>
    </div>
  );
}
