import type { Metadata } from "next";

import { CertificatesHub } from "@/components/certificates-hub";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

const certsRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/certificates");
export const metadata: Metadata = buildMetadata(certsRoute ?? {});

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

/**
 * /certificates — Free Certificate discovery page.
 *
 * Lists free certificates organized by field (Cloud, AI, Frontend, etc.)
 * with MNC providers prioritized. Each certificate links directly to
 * the enrollment page.
 */
export default function CertificatesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Free Certificates
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        100+ verified free certifications from top companies and learning
        platforms. Boost your resume and stand out to recruiters.
      </p>
      <div className="mt-8">
        <CertificatesHub />
      </div>
    </section>
  );
}
