"use client";

/**
 * SaveToolButton — a reusable client component that toggles saving/unsaving
 * a tool using the account context.
 *
 * Shows a filled heart icon when saved, an outline when not.
 */

import { Heart } from "lucide-react";

import { useAccount } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveToolButtonProps {
  toolId: string;
  className?: string;
}

export function SaveToolButton({ toolId, className }: SaveToolButtonProps) {
  const { account, saveTool, removeSavedTool } = useAccount();

  const isSaved = account.savedToolIds.includes(toolId);

  function handleClick() {
    if (isSaved) {
      removeSavedTool(toolId);
    } else {
      saveTool(toolId);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleClick}
      className={cn(
        "shrink-0 transition-colors",
        isSaved
          ? "text-red-500 hover:text-red-400"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-label={isSaved ? `Unsave ${toolId}` : `Save ${toolId}`}
    >
      <Heart className={cn("size-4", isSaved && "fill-current")} />
    </Button>
  );
}
