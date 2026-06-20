"use client";

/**
 * WorkflowDiagram — renders a horizontal (desktop) / vertical (mobile)
 * learning-path diagram for a roadmap node's sub-skills.
 *
 * Each step is shown as a glass card connected by animated chevron arrows.
 * Users can click steps to view descriptions in a tooltip-style popover.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Lightbulb } from "lucide-react";
import type { WorkflowStep } from "@/lib/data/node-workflows";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WorkflowDiagramProps {
  steps: WorkflowStep[];
  nodeTitle: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WorkflowDiagram({ steps, nodeTitle }: WorkflowDiagramProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-amber-500" />
        <h4 className="text-sm font-semibold text-foreground">
          Learning Path for {nodeTitle}
        </h4>
      </div>

      {/* Horizontal flow (desktop) */}
      <div className="hidden sm:flex sm:flex-wrap sm:items-start sm:gap-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start">
            <WorkflowStepCard
              step={step}
              index={i}
              isExpanded={expandedStepId === step.id}
              onToggle={() =>
                setExpandedStepId((prev) =>
                  prev === step.id ? null : step.id
                )
              }
            />
            {i < steps.length - 1 && (
              <ChevronRight
                className="mt-3 size-5 shrink-0 text-primary/40"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>

      {/* Vertical flow (mobile) */}
      <div className="flex flex-col items-center gap-1 sm:hidden">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <WorkflowStepCard
              step={step}
              index={i}
              isExpanded={expandedStepId === step.id}
              onToggle={() =>
                setExpandedStepId((prev) =>
                  prev === step.id ? null : step.id
                )
              }
            />
            {i < steps.length - 1 && (
              <ChevronDown
                className="size-5 text-primary/40"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step Card
// ---------------------------------------------------------------------------

function WorkflowStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: WorkflowStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
        aria-expanded={isExpanded}
        className={[
          "relative rounded-lg border px-3 py-2 text-left transition-all duration-150",
          "w-36 sm:w-40",
          "backdrop-blur-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isExpanded
            ? "border-primary/50 bg-primary/10 shadow-md shadow-primary/10"
            : "border-border bg-card/80 hover:border-primary/30 hover:bg-accent/50",
        ].join(" ")}
      >
        {/* Step number badge */}
        <span
          className={[
            "absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {index + 1}
        </span>

        <span className="block text-xs font-medium leading-tight text-foreground">
          {step.label}
        </span>
      </motion.button>

      {/* Expanded description */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-36 overflow-hidden sm:w-40"
          >
            <p className="mt-1 rounded-md border border-border/50 bg-muted/50 px-2 py-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
