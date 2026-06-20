"use client";

/**
 * Dashboard client component.
 *
 * Displays the user's tracked progress: completed roadmap nodes (with unmark),
 * per-roadmap progress bars, saved tools (with remove), and bookmarked
 * resources (with remove). Shows appropriate empty states when no account data
 * exists (Req 11.1) or when tracked data cannot be read (Req 11.9), and
 * surfaces persistence-failure notices (Req 11.8).
 *
 * Polished to map raw IDs (nodes, tools, resources) to their actual descriptive
 * names/titles, wrap them in proper navigation links, and style them as premium
 * hoverable cards.
 */

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, Bookmark, CheckCircle2, Heart, Layout, Trash2 } from "lucide-react";

import { useAccount } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { loadRoadmap, loadTools, loadResources } from "@/lib/content/loaders";
import { roadmapProgress } from "@/lib/store/account";
import type { Roadmap } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PersistenceNotice() {
  return (
    <div
      role="alert"
      className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200"
    >
      Some items could not be saved.
    </div>
  );
}

function ReadErrorState() {
  return (
    <section className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        No progress or saved items available
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t read your tracked data. Try clearing your browser
        storage and starting fresh.
      </p>
    </section>
  );
}

function WelcomeState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card/30">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Layout className="size-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        Welcome to your Dashboard
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start exploring roadmaps, saving free tools, and bookmarking learning resources to see your progress here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/roadmaps" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Explore Roadmaps
        </Link>
        <Link href="/tools" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          Browse Free Tools
        </Link>
      </div>
    </section>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% complete`}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-8 text-right">
        {percent}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard content
// ---------------------------------------------------------------------------

export function DashboardContent() {
  const {
    account,
    hasAccount,
    unmarkNodeCompleted,
    removeSavedTool,
    removeBookmark,
    persistenceError,
    readError,
  } = useAccount();

  // Compute per-roadmap progress for roadmaps the user has started.
  const roadmapData = useMemo(() => {
    const roadmapIds = Object.keys(account.completedNodes);
    const results: Array<{
      roadmapId: string;
      roadmap: Roadmap;
      progress: number;
    }> = [];

    for (const roadmapId of roadmapIds) {
      const result = loadRoadmap(roadmapId);
      if (result.ok) {
        results.push({
          roadmapId,
          roadmap: result.data,
          progress: roadmapProgress(account, result.data),
        });
      }
    }

    return results;
  }, [account]);

  // Load all tools to match toolId -> toolName
  const toolsMap = useMemo(() => {
    const map = new Map<string, { name: string; category: string }>();
    const result = loadTools();
    if (result.ok) {
      for (const tool of result.data) {
        map.set(tool.id, { name: tool.name, category: tool.category });
      }
    }
    return map;
  }, []);

  // Load all resources to match resourceId -> resourceName
  const resourcesMap = useMemo(() => {
    const map = new Map<string, { name: string; type: string; url: string }>();
    const result = loadResources();
    if (result.ok) {
      for (const res of result.data) {
        map.set(res.id, { name: res.name, type: res.resourceType, url: res.url });
      }
    }
    return map;
  }, []);

  // Build node ID to Title map across started roadmaps
  const nodeTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const { roadmap } of roadmapData) {
      for (const node of roadmap.nodes) {
        map.set(node.id, node.title);
      }
    }
    return map;
  }, [roadmapData]);

  // Req 11.9: If tracked data cannot be read, show empty state.
  if (readError) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        {persistenceError && <PersistenceNotice />}
        <ReadErrorState />
      </section>
    );
  }

  // Req 11.1: If no account data, show welcome/empty state.
  if (!hasAccount) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        {persistenceError && <PersistenceNotice />}
        <WelcomeState />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Track your progress, saved tools, and learning bookmarks.
        </p>
      </div>

      <div className="mt-8 space-y-12">

      {/* Req 11.8: Non-blocking persistence error notice */}
      {persistenceError && <PersistenceNotice />}

      {/* Per-roadmap progress (Req 11.4) */}
      {roadmapData.length > 0 && (
        <section aria-labelledby="progress-heading" className="space-y-4">
          <h2
            id="progress-heading"
            className="text-lg font-semibold text-foreground flex items-center gap-2"
          >
            <BookOpen className="size-5 text-primary" />
            Roadmap Progress
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {roadmapData.map(({ roadmapId, progress, roadmap }) => (
              <div key={roadmapId} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-foreground capitalize">
                    {roadmap.careerPathId.replace(/-/g, " ")}
                  </h3>
                  <Link
                    href={`/roadmaps/${roadmapId}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View Roadmap →
                  </Link>
                </div>
                <ProgressBar percent={progress} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Roadmap Nodes (Req 11.1, 11.7) */}
      {Object.keys(account.completedNodes).length > 0 && (
        <section aria-labelledby="completed-heading" className="space-y-4">
          <h2
            id="completed-heading"
            className="text-lg font-semibold text-foreground flex items-center gap-2"
          >
            <CheckCircle2 className="size-5 text-green-500" />
            Completed Roadmap Nodes
          </h2>
          <div className="space-y-6">
            {Object.entries(account.completedNodes).map(([roadmapId, nodeIds]) => {
              const roadmapLabel = roadmapId.replace(/-/g, " ");
              return (
                <div key={roadmapId} className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {roadmapLabel}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {nodeIds.map((nodeId) => {
                      const title = nodeTitleMap.get(nodeId) || nodeId;
                      return (
                        <div
                          key={nodeId}
                          className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm hover:border-green-500/30 transition-colors"
                        >
                          <Link
                            href={`/roadmaps/${roadmapId}`}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline"
                          >
                            {title}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => unmarkNodeCompleted(roadmapId, nodeId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Unmark ${title} as completed`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Saved Tools (Req 11.1, 11.7) */}
      {account.savedToolIds.length > 0 && (
        <section aria-labelledby="saved-tools-heading" className="space-y-4">
          <h2
            id="saved-tools-heading"
            className="text-lg font-semibold text-foreground flex items-center gap-2"
          >
            <Heart className="size-5 text-red-500 fill-current" />
            Saved Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {account.savedToolIds.map((toolId) => {
              const toolInfo = toolsMap.get(toolId);
              const name = toolInfo?.name || toolId;
              const category = toolInfo?.category || "Developer Tool";
              return (
                <div
                  key={toolId}
                  className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm hover:border-red-500/20 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Link
                      href={`/tools/${toolId}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors hover:underline truncate"
                    >
                      {name}
                    </Link>
                    <span className="text-xs text-muted-foreground truncate">{category}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeSavedTool(toolId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove saved tool ${name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bookmarked Resources (Req 11.1, 11.7) */}
      {account.bookmarkedResourceIds.length > 0 && (
        <section aria-labelledby="bookmarks-heading" className="space-y-4">
          <h2
            id="bookmarks-heading"
            className="text-lg font-semibold text-foreground flex items-center gap-2"
          >
            <Bookmark className="size-5 text-primary fill-current" />
            Bookmarked Resources
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {account.bookmarkedResourceIds.map((resourceId) => {
              const resInfo = resourcesMap.get(resourceId);
              const name = resInfo?.name || resourceId;
              const type = resInfo?.type || "Link";
              const url = resInfo?.url || "#";
              return (
                <div
                  key={resourceId}
                  className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors hover:underline truncate"
                    >
                      {name}
                    </a>
                    <span className="text-xs text-muted-foreground capitalize">{type}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeBookmark(resourceId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove bookmark ${name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}
      </div>
    </section>
  );
}
