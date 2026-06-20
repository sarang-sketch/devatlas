"use client";

/**
 * ThemeToggle — a light/dark mode switch (Req 12.4, 12.5, 12.7).
 *
 * Toggles between light and dark themes using the ThemeProvider context.
 * Displays a Sun icon in dark mode (click to switch to light) and a Moon icon
 * in light mode (click to switch to dark). Shows a non-blocking notice when
 * the theme cannot be persisted to localStorage.
 */

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, persistenceError } = useTheme();

  const isDark = theme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>

      {persistenceError && (
        <span
          role="status"
          className="absolute top-full mt-1 whitespace-nowrap text-xs text-destructive"
        >
          Theme could not be saved
        </span>
      )}
    </div>
  );
}
