import type { Metadata } from "next";

import { CertificatesHub } from "@/components/certificates-hub";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  certificateCollectionSchema,
  faqSchema,
  type CertificateEntry,
  type FaqEntry,
} from "@/lib/seo/structured-data";
import { CERTIFICATE_FIELDS } from "@/lib/data/certificates";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

const certsRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/certificates");
export const metadata: Metadata = buildMetadata(certsRoute ?? {});

// ---------------------------------------------------------------------------
// Structured data source
// ---------------------------------------------------------------------------

/** Flatten every field's certificates into a single schema-ready list. */
const ALL_CERTIFICATES: CertificateEntry[] = CERTIFICATE_FIELDS.flatMap(
  (field) =>
    field.certificates.map((cert) => ({
      title: cert.title,
      provider: cert.provider,
      url: cert.url,
      field: field.name,
    })),
);

const TOTAL_CERTS = ALL_CERTIFICATES.length;
const TOTAL_FIELDS = CERTIFICATE_FIELDS.length;
const PROVIDERS = "Google, AWS, Microsoft, IBM, Meta, Cisco, and Oracle";

const CERT_FAQS: FaqEntry[] = [
  {
    question: "Are these certificates really free?",
    answer: `Yes. Every certificate listed is verified free to earn — no payment required. We track ${TOTAL_CERTS}+ free certificates from ${PROVIDERS}, plus top learning platforms like freeCodeCamp, Coursera (audit), and Kaggle.`,
  },
  {
    question: "Which companies offer free certificates for developers?",
    answer:
      "Google (Cloud Skills Boost, Grow), Amazon Web Services (Skill Builder, Cloud Quest), Microsoft (Learn), IBM (Cognitive Class, SkillsBuild), Meta, Cisco (Networking Academy), and Oracle all offer free certificates or free learning paths with digital badges.",
  },
  {
    question: "Do free certificates help you get a job?",
    answer:
      "Free certificates from recognized providers add credibility to your resume, prove hands-on skills, and give you talking points in interviews. Pair them with projects and a strong portfolio for the best results.",
  },
  {
    question: "What fields can I get free certificates in?",
    answer: `We cover ${TOTAL_FIELDS} fields including cloud computing, AI and machine learning, cybersecurity, data analytics, frontend and backend development, DevOps, blockchain, UI/UX design, digital marketing, and more.`,
  },
];

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
      <JsonLd
        data={[
          certificateCollectionSchema({
            path: "/certificates",
            certificates: ALL_CERTIFICATES,
          }),
          faqSchema(CERT_FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Free Certificates", path: "/certificates" },
          ]),
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Free Certificates for Developers
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        {TOTAL_CERTS}+ verified free certifications from {PROVIDERS}, and top
        learning platforms — across {TOTAL_FIELDS} fields including cloud, AI,
        cybersecurity, data, frontend, backend, and DevOps. Every certificate is
        100% free to earn. Boost your resume and stand out to recruiters.
      </p>
      <div className="mt-8">
        <CertificatesHub />
      </div>

      <FaqSection entries={CERT_FAQS} />
    </section>
  );
}
