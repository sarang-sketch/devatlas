import type { Metadata } from "next";

import { Mail, Heart, Rocket, Users, BookOpen, Briefcase } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";

const aboutRoute = ROUTE_REGISTRY.find(
  (route) => route.pattern === "/about",
);
export const metadata: Metadata = buildMetadata(aboutRoute ?? {});

const missions = [
  {
    icon: BookOpen,
    title: "Learn Any Skill",
    description:
      "Curated roadmaps, free courses, and structured learning paths to master any developer skill — from frontend to AI/ML.",
  },
  {
    icon: Rocket,
    title: "Build Real Projects",
    description:
      "Hands-on practice projects with clear goals and tech stacks so you can build a portfolio that impresses recruiters.",
  },
  {
    icon: Briefcase,
    title: "Land Your Dream Job",
    description:
      "Company insights, role requirements, salary data, and free certifications to make you stand out in interviews.",
  },
  {
    icon: Users,
    title: "100% Free, Forever",
    description:
      "Every roadmap, tool, project, and resource on DevAtlas is completely free. No paywalls, no premium tiers, no hidden costs.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-heading">
          About{" "}
          <span className="text-gradient">DevAtlas</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          DevAtlas is a free, open platform built for{" "}
          <span className="font-medium text-foreground">students</span>,{" "}
          <span className="font-medium text-foreground">developers</span>, and{" "}
          <span className="font-medium text-foreground">job seekers</span> who
          want to acquire real skills, build impressive projects, and land their
          dream tech job — without spending a dime.
        </p>
      </section>

      {/* Mission cards */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {missions.map((item) => (
          <article
            key={item.title}
            className="group relative rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <item.icon className="size-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Who it's for */}
      <section className="mt-20 text-center space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
          Who is DevAtlas for?
        </h2>
        <div className="mx-auto max-w-3xl grid gap-4 sm:grid-cols-3">
          {[
            { emoji: "🎓", label: "Students", desc: "Starting their coding journey" },
            { emoji: "💻", label: "Developers", desc: "Expanding their skill set" },
            { emoji: "🔍", label: "Job Seekers", desc: "Preparing for tech interviews" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border bg-muted/30 p-5 space-y-2 transition-colors hover:bg-muted/50"
            >
              <span className="text-3xl">{item.emoji}</span>
              <h4 className="font-semibold text-foreground">{item.label}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="mt-20 rounded-xl border border-border/60 bg-card p-8 sm:p-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-md">
            <Heart className="size-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Built with <span className="text-primary">passion</span>
          </h2>
          <p className="max-w-lg text-muted-foreground leading-relaxed">
            DevAtlas is created and maintained by{" "}
            <span className="font-semibold text-foreground">Sarang Kadam</span>
            , a developer who believes quality learning resources should be
            accessible to everyone, regardless of their financial situation.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-16 space-y-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
          Get in Touch
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* General queries */}
          <a
            href="mailto:contact.sarangkadam@gmail.com"
            className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <Mail className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                General Queries &amp; Contributions
              </h3>
              <p className="text-sm text-muted-foreground">
                Questions, feedback, partnerships, or want to contribute?
              </p>
              <p className="text-sm font-medium text-primary">
                contact.sarangkadam@gmail.com
              </p>
            </div>
          </a>

          {/* Platform content */}
          <a
            href="mailto:contact.devatlas@gmail.com"
            className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <Mail className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">
                Tools, Skills &amp; Certificates
              </h3>
              <p className="text-sm text-muted-foreground">
                Suggest tools, skills, roadmap additions, or certificate listings.
              </p>
              <p className="text-sm font-medium text-primary">
                contact.devatlas@gmail.com
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center space-y-4 pb-8">
        <p className="text-muted-foreground text-lg">
          Ready to start your journey?
        </p>
        <a
          href="/roadmaps"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Rocket className="size-4" />
          Explore Roadmaps
        </a>
      </section>
    </div>
  );
}
