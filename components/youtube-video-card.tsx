"use client";

/**
 * YouTubeVideoCard — renders a curated list of YouTube video tutorials
 * for a roadmap node. Each card shows a thumbnail, title, channel, and
 * duration with a clean, premium design.
 *
 * Thumbnails are loaded from YouTube's img.youtube.com CDN (no API key
 * required). Videos open in a new tab.
 */

import { motion } from "framer-motion";
import { Play, Clock, ExternalLink } from "lucide-react";
import type { VideoResource } from "@/lib/data/node-videos";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface YouTubeVideoListProps {
  videos: VideoResource[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the YouTube video ID from a URL.
 * Supports watch?v=, youtu.be/, and embed/ formats.
 */
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // invalid URL
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function YouTubeVideoList({ videos }: YouTubeVideoListProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Play className="size-4 text-red-500" />
        <h4 className="text-sm font-semibold text-foreground">
          Recommended Tutorials
        </h4>
      </div>

      {/* Video Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {videos.map((video, i) => (
          <YouTubeVideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single Video Card
// ---------------------------------------------------------------------------

function YouTubeVideoCard({
  video,
  index,
}: {
  video: VideoResource;
  index: number;
}) {
  const videoId = extractVideoId(video.url);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
      className={[
        "group flex gap-3 rounded-lg border border-border bg-card/80 p-2 transition-all duration-150",
        "hover:border-primary/30 hover:bg-accent/40 hover:shadow-md hover:shadow-primary/5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-muted">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Play className="size-6 text-muted-foreground" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex size-8 items-center justify-center rounded-full bg-red-600 shadow-lg">
            <Play className="size-4 fill-white text-white" />
          </div>
        </div>
        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-black/75 px-1 py-0.5 text-[10px] font-medium text-white">
            <Clock className="size-2.5" />
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <p className="line-clamp-2 text-xs font-medium leading-tight text-foreground group-hover:text-primary">
            {video.title}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {video.channel}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <ExternalLink className="size-2.5" />
          <span>Watch on YouTube</span>
        </div>
      </div>
    </motion.a>
  );
}
