import type { Metadata } from "next";

import { ProjectsHub } from "@/components/projects-hub";
import { loadProjects } from "@/lib/content/loaders";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTE_REGISTRY } from "@/lib/seo/routes";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

// Per-page SEO metadata for "/projects" (Req 14.2, 14.5).
const projectsRoute = ROUTE_REGISTRY.find((r) => r.pattern === "/projects");
export const metadata: Metadata = buildMetadata(projectsRoute ?? {});

export default function ProjectsPage() {
  const result = loadProjects();

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Practice Projects
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Build real projects to strengthen your portfolio and sharpen your skills.
        </p>
        <p className="mt-8 text-destructive">{result.error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          itemListSchema({
            name: "Developer Practice Projects",
            description:
              "Hands-on practice projects from beginner to production-grade, each with goals and a tech stack.",
            path: "/projects",
            items: result.data.map((project) => ({
              name: project.name,
              path: `/projects/${project.id}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Practice Projects
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Build real projects to strengthen your portfolio and sharpen your skills.
      </p>
      <div className="mt-8">
        <ProjectsHub projects={result.data} />
      </div>
    </section>
  );
}
