import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Wrench, Settings, GraduationCap } from "lucide-react";

import { Hero } from "@/components/hero";
import { loadCareerPaths } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

// Per-page SEO metadata for "/" sourced from the shared route registry
// (Req 14.2, 14.5).
const homeRoute = ROUTE_REGISTRY.find((route) => route.pattern === "/");
export const metadata: Metadata = buildMetadata(homeRoute ?? {});

export default function Home() {
  const result = loadCareerPaths();
  const careerPaths = result.ok ? result.data : [];

  return (
    <main className="flex flex-1 flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Core Pillars / Features */}
      <section className="border-y bg-muted/30 py-20" aria-labelledby="pillars-heading">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="pillars-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to learn, build, and grow
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              DevAtlas maps out the complete developer journey by uniting step-by-step career roadmaps with the best free tools available on the web.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group card-hover relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 hover:border-primary/40 hover:shadow-md">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Structured Roadmaps</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Step-by-step developer roadmaps mapping out recommended learning pathways for all major specializations.
              </p>
            </div>

            <div className="group card-hover relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 hover:border-primary/40 hover:shadow-md">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300 transition-colors group-hover:bg-sky-500 group-hover:text-white">
                <Wrench className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Free Tools Library</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover a hand-picked, categorized directory of free-tier hosting, databases, authentication, APIs, and AI tools.
              </p>
            </div>

            <div className="group card-hover relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 hover:border-primary/40 hover:shadow-md">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex size-11 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                <Settings className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Path Generator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Answer a few quick questions about your skill level and goals to generate a custom, tailored learning pathway.
              </p>
            </div>

            <div className="group card-hover relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 hover:border-primary/40 hover:shadow-md">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <GraduationCap className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Practice Projects</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bridge the gap between theory and code with real-world project assignments mapped to specific learning levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Career Tracks */}
      {careerPaths.length > 0 && (
        <section className="py-20" aria-labelledby="tracks-heading">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 id="tracks-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Choose Your Specialization
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
                  Select a career path to view its complete skill map, recommended tools, and custom projects.
                </p>
              </div>
              <Link href="/roadmaps" className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all roadmaps
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {careerPaths.map((path) => (
                <Link
                  key={path.id}
                  href={`/roadmaps/${path.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {path.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {path.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Bottom CTA Section */}
      <section className="border-t bg-muted/20 py-20 text-center" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-4xl px-6 flex flex-col items-center gap-6">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start mapping your growth today
          </h2>
          <p className="max-w-md text-muted-foreground leading-relaxed">
            Gain clarity on what to learn next, and matching tools and projects to build your portfolio.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row mt-4">
            <Link href="/learning-paths" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Generate Custom Path
            </Link>
            <Link href="/roadmaps" className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              Explore Roadmaps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
