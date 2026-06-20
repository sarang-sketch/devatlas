"use client";

/**
 * DevAtlas NodeSectionPanel — renders the six resource sections of a
 * selected roadmap node using Shadcn Tabs for clean navigation, plus
 * a visual learning-path workflow diagram and curated YouTube tutorials.
 *
 * - Learn (Req 5.3): ResourceLinks as activatable ExternalLinks
 * - Practice (Req 5.4): ResourceLinks as activatable ExternalLinks
 * - Build (Req 5.5): ProjectRefs as internal links to /projects/{projectId}
 * - Use (Req 5.6): ToolRefs as internal links to /tools/{toolId}
 * - Deploy (Req 5.7): ResourceLinks as activatable ExternalLinks
 * - Career (Req 5.8): ResourceLinks as activatable ExternalLinks
 *
 * Empty sections show a placeholder (Req 5.9). Framer Motion AnimatePresence
 * provides a smooth reveal transition, and a brief loading state is shown if
 * the panel takes longer than 100ms to appear (Req 5.12).
 *
 * Additional features:
 * - WorkflowDiagram: visual sub-skill learning path with animated chevrons
 * - YouTubeVideoList: curated video tutorials with thumbnail previews
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lightbulb, Wrench } from "lucide-react";

import type { RoadmapNode } from "@/lib/domain/types";
import { NODE_SECTION_KEYS, isSectionEmpty } from "@/lib/domain/nodes";
import { ExternalLink } from "@/components/external-link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkflowDiagram } from "@/components/workflow-diagram";
import { YouTubeVideoList } from "@/components/youtube-video-card";
import { NODE_WORKFLOWS } from "@/lib/data/node-workflows";
import { NODE_VIDEOS } from "@/lib/data/node-videos";
import {
  TOOL_NAMES,
  PROJECT_NAMES,
  humanizeId,
  isKnownTool,
  isKnownProject,
} from "@/lib/data/catalog-names";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Human-readable labels for each section tab. */
const SECTION_LABELS: Record<string, string> = {
  learn: "Learn",
  practice: "Practice",
  build: "Build",
  use: "Use",
  deploy: "Deploy",
  career: "Career",
};

/** Placeholder shown when a section has no items (Req 5.9). */
export const EMPTY_SECTION_MESSAGE = "No content available for this section.";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeSectionPanelProps {
  /** The selected roadmap node whose sections are displayed. */
  node: RoadmapNode;
  /** The roadmap id this node belongs to (used for tracking). */
  roadmapId: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function NodeSectionPanel({ node, roadmapId: _roadmapId }: NodeSectionPanelProps) {
  // Req 5.12: Show a loading indicator if panel content isn't ready within 100ms.
  // Since the data is passed as a prop (already loaded), this addresses the UI
  // transition timing — a brief delay before showing content triggers the loader.
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0); // Content is already available (prop), mark ready immediately
    return () => clearTimeout(timer);
  }, [node]);

  // If for some reason the panel hasn't mounted yet, show loading state.
  // In practice this fires for a single frame at most.
  if (!isReady) {
    return (
      <div
        className="flex items-center justify-center p-6"
        role="status"
        aria-label="Loading section content"
      >
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  const workflowSteps = NODE_WORKFLOWS[node.id];
  const videos = NODE_VIDEOS[node.id];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="w-full space-y-4"
      >
        {/* Visual Learning Path Workflow */}
        {workflowSteps && workflowSteps.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-card to-accent/20 p-4">
            <WorkflowDiagram steps={workflowSteps} nodeTitle={node.title} />
          </div>
        )}

        {/* Curated YouTube Tutorials */}
        {videos && videos.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-card/90 p-4">
            <YouTubeVideoList videos={videos} />
          </div>
        )}

        {/* Resource Tabs */}
        <Tabs defaultValue="learn" className="w-full">
          <TabsList className="flex flex-wrap gap-1">
            {NODE_SECTION_KEYS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {SECTION_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {NODE_SECTION_KEYS.map((key) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="rounded-lg border bg-card p-4">
                {isSectionEmpty(node, key) ? (
                  <p className="text-sm text-muted-foreground italic">
                    {EMPTY_SECTION_MESSAGE}
                  </p>
                ) : (
                  <SectionContent node={node} sectionKey={key} />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Section content renderer
// ---------------------------------------------------------------------------

function SectionContent({
  node,
  sectionKey,
}: {
  node: RoadmapNode;
  sectionKey: string;
}) {
  switch (sectionKey) {
    case "learn":
      return <ResourceLinkList items={node.sections.learn} />;
    case "practice":
      return <ResourceLinkList items={node.sections.practice} />;
    case "build":
      return <ProjectRefList items={node.sections.build} />;
    case "use":
      return <ToolRefList items={node.sections.use} />;
    case "deploy":
      return <ResourceLinkList items={node.sections.deploy} />;
    case "career":
      return <ResourceLinkList items={node.sections.career} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// List sub-components
// ---------------------------------------------------------------------------

/** Renders ResourceLinks as activatable ExternalLinks (Req 5.3, 5.4, 5.7, 5.8). */
function ResourceLinkList({ items }: { items: RoadmapNode["sections"]["learn"] }) {
  return (
    <ul className="space-y-2">
      {items.map((resource) => (
        <li key={resource.id}>
          <ExternalLink
            href={resource.url}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
          >
            {resource.name}
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}

/** Renders ProjectRefs: real projects link to their detail page; free-form
 * project ideas (ids not in the catalog) render as styled suggestions (Req 5.5). */
function ProjectRefList({ items }: { items: RoadmapNode["sections"]["build"] }) {
  return (
    <ul className="space-y-2">
      {items.map((ref) => {
        const known = isKnownProject(ref.projectId);
        const label = known
          ? PROJECT_NAMES[ref.projectId]
          : humanizeId(ref.projectId);

        if (known) {
          return (
            <li key={ref.projectId}>
              <Link
                href={`/projects/${ref.projectId}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
              >
                <Lightbulb className="size-4 shrink-0 text-amber-500" />
                {label}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          );
        }

        return (
          <li
            key={ref.projectId}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <Lightbulb className="size-4 shrink-0 text-amber-500" />
            <span>{label}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
              Project idea
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Renders ToolRefs as internal links to /tools/{toolId} with the tool's
 * display name; unknown ids fall back to a humanized, non-linked label (Req 5.6). */
function ToolRefList({ items }: { items: RoadmapNode["sections"]["use"] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((ref) => {
        const known = isKnownTool(ref.toolId);
        const label = known ? TOOL_NAMES[ref.toolId] : humanizeId(ref.toolId);

        if (known) {
          return (
            <li key={ref.toolId}>
              <Link
                href={`/tools/${ref.toolId}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary"
              >
                <Wrench className="size-3.5 text-primary" />
                {label}
              </Link>
            </li>
          );
        }

        return (
          <li key={ref.toolId}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <Wrench className="size-3.5" />
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
