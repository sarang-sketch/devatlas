"use client";

/**
 * Animated, interactive mini roadmap visualization for the homepage hero
 * (design "Feature Components", Req 1.2, 1.3).
 *
 * A handful of connected nodes representing a roadmap, animated in with Framer
 * Motion. The entrance animation starts effectively immediately (zero delay) so
 * it begins within 100ms of the hero becoming visible (Req 1.2). Each node is
 * keyboard-focusable and responds to hover/focus with a fast transform-based
 * state change that is visible within 100ms (Req 1.3, 12.4).
 *
 * Rendered inside an {@link ErrorBoundary} on the homepage so that, if it ever
 * throws, the static {@link HeroFallbackImage} is shown instead while the
 * headline and CTAs stay intact (Req 1.7).
 */

import { motion } from "framer-motion";

interface VizNode {
  id: string;
  label: string;
  x: number;
  y: number;
  primary?: boolean;
}

interface VizEdge {
  from: string;
  to: string;
}

// A small, fixed graph: one central "Start" node branching into skills.
const NODES: VizNode[] = [
  { id: "start", label: "Start", x: 160, y: 120, primary: true },
  { id: "learn", label: "Learn", x: 60, y: 60 },
  { id: "build", label: "Build", x: 60, y: 180 },
  { id: "deploy", label: "Deploy", x: 260, y: 60 },
  { id: "career", label: "Career", x: 260, y: 180 },
];

const EDGES: VizEdge[] = [
  { from: "start", to: "learn" },
  { from: "start", to: "build" },
  { from: "start", to: "deploy" },
  { from: "start", to: "career" },
];

function nodeById(id: string): VizNode {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown hero viz node: ${id}`);
  return node;
}

export function HeroRoadmapViz({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 320 240"
      width="100%"
      height="100%"
      className={className}
      role="group"
      aria-label="Interactive developer roadmap preview"
      data-testid="hero-roadmap-viz"
      // Entrance starts immediately (no delay) so it begins within 100ms (Req 1.2).
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0 }}
    >
      {/* Connectors animate in quickly. */}
      <g stroke="var(--border)" strokeWidth={3} fill="none">
        {EDGES.map((edge) => {
          const a = nodeById(edge.from);
          const b = nodeById(edge.to);
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0 }}
            />
          );
        })}
      </g>

      {/* Nodes: focusable, with a fast hover/focus response (Req 1.3). */}
      {NODES.map((node, index) => (
        <motion.g
          key={node.id}
          tabIndex={0}
          role="button"
          aria-label={`${node.label} roadmap stage`}
          data-testid={`hero-node-${node.id}`}
          className="cursor-pointer outline-none [&:focus-visible_circle]:stroke-ring [&:focus-visible_circle]:stroke-[4px]"
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          // Stagger is tiny so even the last node starts well within 100ms.
          transition={{ duration: 0.25, delay: index * 0.02 }}
          // Hover/focus produce an immediate, visible transform (Req 1.3).
          whileHover={{ scale: 1.12 }}
          whileFocus={{ scale: 1.12 }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={node.primary ? 26 : 22}
            fill={node.primary ? "var(--primary)" : "var(--accent)"}
            stroke="var(--primary)"
            strokeWidth={node.primary ? 0 : 3}
          />
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={node.primary ? "var(--primary-foreground)" : "var(--accent-foreground)"}
            style={{ pointerEvents: "none" }}
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}

export default HeroRoadmapViz;
