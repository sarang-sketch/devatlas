import type { Metadata } from "next";

import { CompaniesHub } from "@/components/companies-hub";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

const companiesRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/companies");
export const metadata: Metadata = buildMetadata(companiesRoute ?? {});

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

/**
 * /companies — Company Demand page.
 *
 * Lists global MNCs and Indian companies with their open roles.
 * Clicking a role reveals a complete learning roadmap with phases,
 * skills, videos, and free resources.
 */
export default function CompaniesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Company Demand
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Discover which top companies are hiring, what roles they need, and get a
        complete learning roadmap to land your dream job.
      </p>
      <div className="mt-8">
        <CompaniesHub />
      </div>
    </section>
  );
}
