/**
 * JSON-LD structured data builders (schema.org) for DevAtlas.
 *
 * Structured data makes pages eligible for Google rich results (sitelinks,
 * breadcrumbs, course/app cards) and gives search engines an explicit,
 * machine-readable description of each page's entity. All builders are pure and
 * return plain objects that are serialized into a `<script type="application/
 * ld+json">` tag by the `JsonLd` component.
 *
 * URLs are built as absolute values against `SITE_URL` so they remain valid
 * regardless of where the page is embedded or crawled from.
 */

import { SITE_URL } from "@/app/sitemap";

/** The canonical site origin without a trailing slash. */
const ORIGIN = SITE_URL.replace(/\/+$/, "");

/** Builds an absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return ORIGIN;
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Organization schema — identifies DevAtlas as the publishing entity so Google
 * can associate the brand, logo, and profiles with the site.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DevAtlas",
    url: ORIGIN,
    logo: absoluteUrl("/icon.svg"),
    description:
      "DevAtlas is a free platform with developer career roadmaps, curated free tools, hands-on projects, and learning resources.",
    founder: {
      "@type": "Person",
      name: "Sarang Kadam",
    },
  };
}

/**
 * WebSite schema — declares the site entity and enables the sitelinks search
 * box treatment in search results.
 */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevAtlas",
    alternateName: "DevAtlas — Developer Roadmaps & Free Tools",
    url: ORIGIN,
    description:
      "Free developer roadmaps, curated free tools, hands-on projects, free certifications, and learning resources — all in one place.",
    publisher: {
      "@type": "Organization",
      name: "DevAtlas",
    },
  };
}

/** A single breadcrumb node: a human label and its site-relative path. */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * BreadcrumbList schema — renders the breadcrumb trail in search results and
 * clarifies the site hierarchy to crawlers.
 */
export function breadcrumbSchema(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Course schema for a roadmap — presents the learning path as a course so it
 * can qualify for course rich results.
 */
export function courseSchema(input: {
  name: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: "DevAtlas",
      sameAs: ORIGIN,
    },
    isAccessibleForFree: true,
  };
}

/**
 * SoftwareApplication schema for a developer tool — describes the tool as an
 * application, including its free-tier availability.
 */
export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
  category?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: input.category ?? "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * CollectionPage + ItemList schema for a listing page — communicates that the
 * page is a curated collection and lists its members in order.
 */
export function itemListSchema(input: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/**
 * A course/credential entry for the certificate collection schema.
 */
export interface CertificateEntry {
  title: string;
  provider: string;
  url: string;
  field: string;
}

/**
 * CollectionPage + ItemList of Course entries for the free-certificates page.
 * Each certificate is modeled as a free `Course` provided by its issuing
 * organization, so searches like "free Google certificate" or "free AWS
 * course" can surface the page (and individual entries) as rich results.
 */
export function certificateCollectionSchema(input: {
  path: string;
  certificates: CertificateEntry[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Developer Certificates",
    description:
      "A curated collection of verified free certificates from Google, AWS, Microsoft, IBM, Meta, Cisco, and top learning platforms.",
    url: absoluteUrl(input.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.certificates.length,
      itemListElement: input.certificates.map((cert, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: cert.title,
          description: `Free ${cert.field} certificate from ${cert.provider}.`,
          url: cert.url,
          provider: {
            "@type": "Organization",
            name: cert.provider,
          },
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            category: "Free",
          },
        },
      })),
    },
  };
}

/**
 * A company entry for the company-demand collection schema.
 */
export interface CompanyEntry {
  name: string;
  description: string;
  careersUrl: string;
  roleCount: number;
}

/**
 * CollectionPage + ItemList of Organization entries for the companies page.
 * Helps searches like "companies hiring developers" or "which company is
 * hiring freshers" find the page.
 */
export function companyCollectionSchema(input: {
  path: string;
  companies: CompanyEntry[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Companies Hiring Developers",
    description:
      "Top global and Indian companies hiring developers, with open roles, salary ranges, and free learning roadmaps for each position.",
    url: absoluteUrl(input.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.companies.length,
      itemListElement: input.companies.map((company, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Organization",
          name: company.name,
          description: company.description,
          url: company.careersUrl,
        },
      })),
    },
  };
}

/** A single frequently-asked question and its answer. */
export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * FAQPage schema. When paired with matching visible on-page content, this makes
 * the page eligible for FAQ rich results and helps it rank for question-style
 * searches (e.g. "are these certificates really free?").
 */
export function faqSchema(entries: FaqEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}
