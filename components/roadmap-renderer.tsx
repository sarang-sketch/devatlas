"use client";

/**
 * RoadmapRenderer — displays a roadmap as a vertical flow of nodes connected
 * by directed connectors, ordered first→last (Req 5.1). Handles node selection
 * with section display within 100ms using Framer Motion AnimatePresence
 * (Req 5.2).
 *
 * Integrates the real NodeSectionPanel for each node and provides a
 * "Mark as Completed" / "✓ Completed" button per node using the account
 * context.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

import { NodeSectionPanel } from "@/components/node-section-panel";
import { useAccount } from "@/components/account-provider";
import { orderedNodeSequence } from "@/lib/domain/catalog";
import { cn } from "@/lib/utils";
import type { Roadmap, RoadmapNode } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RoadmapRendererProps {
  roadmap: Roadmap;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RoadmapRenderer({ roadmap }: RoadmapRendererProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { account, markNodeCompleted, unmarkNodeCompleted } = useAccount();

  const orderedNodes = orderedNodeSequence(roadmap);

  const completedNodeIds = account.completedNodes[roadmap.careerPathId] ?? [];

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  return (
    <div className="flex flex-col items-center gap-0">
      <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
        {roadmap.careerPathId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Roadmap
      </h1>

      <div
        className="relative flex flex-col items-center"
        role="list"
        aria-label="Roadmap nodes"
      >
        {orderedNodes.map((node, index) => (
          <RoadmapNodeItem
            key={node.id}
            node={node}
            roadmapId={roadmap.careerPathId}
            isSelected={selectedNodeId === node.id}
            isCompleted={completedNodeIds.includes(node.id)}
            isLast={index === orderedNodes.length - 1}
            onClick={handleNodeClick}
            onToggleComplete={(nodeId) => {
              if (completedNodeIds.includes(nodeId)) {
                unmarkNodeCompleted(roadmap.careerPathId, nodeId);
              } else {
                markNodeCompleted(roadmap.careerPathId, nodeId);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual Node + Connector
// ---------------------------------------------------------------------------

interface RoadmapNodeItemProps {
  node: RoadmapNode;
  roadmapId: string;
  isSelected: boolean;
  isCompleted: boolean;
  isLast: boolean;
  onClick: (nodeId: string) => void;
  onToggleComplete: (nodeId: string) => void;
}

function RoadmapNodeItem({
  node,
  roadmapId,
  isSelected,
  isCompleted,
  isLast,
  onClick,
  onToggleComplete,
}: RoadmapNodeItemProps) {
  return (
    <div className="flex flex-col items-center" role="listitem">
      {/* Node card/pill with completion indicator */}
      <div className="flex w-full max-w-md items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleComplete(node.id)}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-border bg-background hover:border-green-400"
          )}
          aria-label={isCompleted ? `Unmark ${node.title} as completed` : `Mark ${node.title} as completed`}
        >
          {isCompleted && <Check className="size-4" />}
        </button>

        <button
          type="button"
          onClick={() => onClick(node.id)}
          aria-expanded={isSelected}
          aria-controls={`node-panel-${node.id}`}
          className={cn(
            "relative z-10 flex-1 rounded-lg border px-6 py-3 text-center font-medium transition-colors duration-75",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isCompleted && "border-green-500/30 bg-green-500/5",
            isSelected
              ? "border-primary bg-primary/10 text-primary shadow-md"
              : isCompleted
                ? "text-foreground hover:border-primary/50 hover:bg-accent"
                : "border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-accent"
          )}
        >
          <span className={cn("text-sm sm:text-base", isCompleted && "line-through opacity-70")}>
            {node.title}
          </span>
        </button>
      </div>

      {/* Node section panel — full tabbed content */}
      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            id={`node-panel-${node.id}`}
            key={`panel-${node.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.08, ease: "easeOut" }}
            className="w-full max-w-2xl overflow-hidden"
          >
            <div className="mt-2">
              <NodeSectionPanel node={node} roadmapId={roadmapId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directed connector (vertical line + arrow) to the next node */}
      {!isLast && (
        <div className="flex flex-col items-center" aria-hidden="true">
          <div className="h-6 w-0.5 bg-border" />
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className="text-border"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="h-2 w-0.5 bg-border" />
        </div>
      )}
    </div>
  );
}

