"use client";

/**
 * DevAtlas theme context provider (design "Context Providers", Req 12).
 *
 * Holds the active theme, applies it to the document by toggling the `.dark`
 * class on `<html>` (globals.css defines the light defaults and the `.dark`
 * overrides), and persists the user's selection through the fault-tolerant
 * {@link LocalStore} wrapper.
 *
 * Behavior:
 *   - On mount it reads the stored theme and resolves it (light when nothing is
 *     stored — Req 12.1; the stored theme otherwise — Req 12.6), then applies
 *     the corresponding class.
 *   - `setTheme` updates state, applies the class immediately, and writes to the
 *     store. If the write fails it sets `persistenceError` to `true` but keeps
 *     the selected theme applied for the session (Req 12.3, 12.7).
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { LocalStore, STORAGE_KEYS } from "@/lib/store/local-store";
import { resolveTheme, type Theme } from "@/lib/theme/theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** true when the last write to the Local_Store failed (Req 12.7). */
  persistenceError: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Add or remove the `.dark` class on the document root so the CSS theme tokens
 * take effect. No-op outside the browser (SSR safety).
 */
function applyThemeClass(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Light is the default until the stored selection is read on mount (Req 12.1).
  const [theme, setThemeState] = useState<Theme>("light");
  const [persistenceError, setPersistenceError] = useState(false);

  // Restore the persisted theme once, on mount (Req 12.6).
  useEffect(() => {
    const stored = LocalStore.read<string | null>(STORAGE_KEYS.theme, null);
    const resolved = resolveTheme(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydrate theme from localStorage on mount
    setThemeState(resolved);
    applyThemeClass(resolved);
  }, []);

  const setTheme = (next: Theme) => {
    // Apply the selection for the session regardless of persistence outcome.
    setThemeState(next);
    applyThemeClass(next);

    // Persist; on failure keep the applied theme but flag the error (Req 12.7).
    const ok = LocalStore.write(STORAGE_KEYS.theme, next);
    setPersistenceError(!ok);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, persistenceError }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Access the theme context. Must be called from within a {@link ThemeProvider}.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
