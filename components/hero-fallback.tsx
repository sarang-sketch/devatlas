/**
 * Static fallback for the hero roadmap visualization (Req 1.7).
 *
 * Rendered by the hero's error boundary when {@link HeroRoadmapViz} fails to
 * load or throws. It is a self-contained, dependency-free SVG (no animation, no
 * client interactivity) depicting a simple roadmap node graph, so the hero
 * still communicates the product concept while the headline and both CTAs
 * remain intact. The SVG carries a text alternative for assistive technology
 * (Req 13.3).
 */

interface HeroFallbackImageProps {
  /** Optional extra classes for layout. */
  className?: string;
}

export function HeroFallbackImage({ className }: HeroFallbackImageProps) {
  return (
    <svg
      role="img"
      aria-label="A developer roadmap shown as connected milestone nodes"
      viewBox="0 0 320 240"
      className={className}
      width="100%"
      height="100%"
      data-testid="hero-fallback"
    >
      <title>A developer roadmap shown as connected milestone nodes</title>
      {/* Connectors */}
      <g stroke="var(--border)" strokeWidth={3} fill="none">
        <line x1="60" y1="60" x2="160" y2="120" />
        <line x1="160" y1="120" x2="60" y2="180" />
        <line x1="160" y1="120" x2="260" y2="60" />
        <line x1="160" y1="120" x2="260" y2="180" />
      </g>
      {/* Nodes */}
      <g>
        <circle cx="60" cy="60" r="22" fill="var(--accent)" stroke="var(--primary)" strokeWidth={3} />
        <circle cx="160" cy="120" r="26" fill="var(--primary)" />
        <circle cx="60" cy="180" r="22" fill="var(--accent)" stroke="var(--primary)" strokeWidth={3} />
        <circle cx="260" cy="60" r="22" fill="var(--accent)" stroke="var(--primary)" strokeWidth={3} />
        <circle cx="260" cy="180" r="22" fill="var(--accent)" stroke="var(--primary)" strokeWidth={3} />
      </g>
    </svg>
  );
}

export default HeroFallbackImage;
