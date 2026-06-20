"use client";

/**
 * BookmarkButton — a reusable client component that toggles a resource
 * bookmark on/off using the account context.
 *
 * Shows a filled bookmark icon when bookmarked, an outline when not.
 */

import { Bookmark } from "lucide-react";

import { useAccount } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  resourceId: string;
  className?: string;
}

export function BookmarkButton({ resourceId, className }: BookmarkButtonProps) {
  const { account, bookmarkResource, removeBookmark } = useAccount();

  const isBookmarked = account.bookmarkedResourceIds.includes(resourceId);

  function handleClick() {
    if (isBookmarked) {
      removeBookmark(resourceId);
    } else {
      bookmarkResource(resourceId);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleClick}
      className={cn(
        "shrink-0 transition-colors",
        isBookmarked
          ? "text-primary hover:text-primary/80"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-label={isBookmarked ? `Remove bookmark for ${resourceId}` : `Bookmark ${resourceId}`}
    >
      <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
    </Button>
  );
}
