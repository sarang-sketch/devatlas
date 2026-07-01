import type { Metadata } from "next";

import { CompaniesHub } from "@/components/companies-hub";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  companyCollectionSchema,
  faqSchema,
  type CompanyEntry,
  type FaqEntry,
} from "@/lib/seo/structured-data";
import { COMPANIES } from "@/lib/data/companies";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

const companiesRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/companies");
export const metadata: Metadata = buildMetadata(companiesRoute ?? {});

// ---------------------------------------------------------------------------
// Structured data source
// ---------------------------------------------------------------------------

const COMPANY_ENTRIES: CompanyEntry[] = COMPANIES.map((company) => ({
  name: company.name,
  description: company.description,
  careersUrl: company.careersUrl,
  roleCount: company.roles.length,
}));

const TOTAL_COMPANIES = COMPANIES.length;
const TOTAL_ROLES = COMPANIES.reduce((sum, c) => sum + c.roles.length, 0);

const COMPANY_FAQS: FaqEntry[] = [
  {
    question: "Which top companies are hiring developers?",
    answer: `We track ${TOTAL_COMPANIES}+ companies actively hiring — global MNCs like Google, Microsoft, Amazon, Meta, Apple, and NVIDIA, and leading Indian companies like TCS, Infosys, Flipkart, Zomato, Razorpay, and CRED.`,
  },
  {
    question: "How do I prepare for interviews at these companies?",
    answer:
      "Each company lists its common roles with a complete free learning roadmap — phase-by-phase skills, curated resources, and free video courses covering data structures, system design, and interview preparation.",
  },
  {
    question: "Do you show salaries for each role?",
    answer:
      "Yes. Every role includes a salary range along with the key requirements and a step-by-step roadmap to build the skills that company looks for.",
  },
  {
    question: "Are the learning roadmaps free?",
    answer:
      "Completely free. Every roadmap uses free resources — freeCodeCamp, official docs, LeetCode, NeetCode, CS50, and free YouTube courses — so you can prepare without paying for anything.",
  },
];

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
      <JsonLd
        data={[
          companyCollectionSchema({
            path: "/companies",
            companies: COMPANY_ENTRIES,
          }),
          faqSchema(COMPANY_FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Companies Hiring", path: "/companies" },
          ]),
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Companies Hiring Developers & Interview Roadmaps
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Discover which of {TOTAL_COMPANIES}+ top companies are hiring — from
        Google, Microsoft, and Amazon to TCS, Infosys, Flipkart, and Razorpay.
        Explore {TOTAL_ROLES}+ roles with salaries, requirements, and a complete
        free learning roadmap to land your dream job.
      </p>
      <div className="mt-8">
        <CompaniesHub />
      </div>

      <FaqSection entries={COMPANY_FAQS} />
    </section>
  );
}
