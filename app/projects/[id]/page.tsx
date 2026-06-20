import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { loadProjects } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import { expandRoute } from "@/lib/seo/routes";

// ---------------------------------------------------------------------------
// Static params (SSG for every project id — Req 14.3)
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  const result = loadProjects();
  if (!result.ok) return [];
  return result.data.map((project) => ({ id: project.id }));
}

// ---------------------------------------------------------------------------
// Dynamic metadata (Req 14.2)
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const routeDef = ROUTE_REGISTRY.find((r) => r.pattern === "/projects/[id]");
  if (routeDef) {
    const concreteRoutes = expandRoute(routeDef);
    const match = concreteRoutes.find((r) => r.path === `/projects/${id}`);
    if (match) return buildMetadata(match);
  }
  return buildMetadata({});
}

// ---------------------------------------------------------------------------
// Page component (Req 8.2, 8.6)
// ---------------------------------------------------------------------------

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = loadProjects();

  if (!result.ok) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <p className="text-destructive">{result.error}</p>
        <Link
          href="/projects"
          className="mt-4 text-sm text-primary underline underline-offset-4"
        >
          ← Back to projects
        </Link>
      </main>
    );
  }

  const project = result.data.find((p) => p.id === id);

  if (!project) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <p className="text-destructive">Project not found.</p>
        <Link
          href="/projects"
          className="mt-4 text-sm text-primary underline underline-offset-4"
        >
          ← Back to projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/projects"
        className="mb-6 text-sm text-muted-foreground hover:text-foreground"
      >
        ← All projects
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <Badge variant="secondary">{project.skillLevel}</Badge>
      </div>

      {/* Description (Req 8.2) */}
      <p className="mb-6 text-muted-foreground">{project.description}</p>

      {/* Required skills (Req 8.2) */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Required Skills</h2>
        <div className="flex flex-wrap gap-2">
          {project.requiredSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Estimated time (Req 8.2) */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Estimated Time</h2>
        <p className="text-muted-foreground">{project.estimatedTime}</p>
      </section>

      {/* Tech stack (Req 8.2) */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* Learning outcomes (Req 8.2) */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Learning Outcomes</h2>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          {project.learningOutcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>

      {/* Tags */}
      {project.tags.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
