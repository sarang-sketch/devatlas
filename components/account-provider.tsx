"use client";

/**
 * DevAtlas account context provider.
 *
 * Wires the pure account-state helpers (`lib/store/account`) to the
 * fault-tolerant `LocalStore` persistence wrapper and exposes them to the React
 * tree via context. The app allows full, no-account access everywhere, so this
 * provider never gates functionality — it simply tracks optional progress,
 * saved tools, and bookmarks (Req 11.1, 11.5).
 *
 * Behavior:
 *   - On mount it restores the persisted `AccountState` (Req 11.6). If a stored
 *     value is present but corrupt/unparsable it falls back to a clean empty
 *     state and raises `readError` (Req 11.9).
 *   - Each mutation applies the matching pure helper, updates in-memory React
 *     state, and persists through `LocalStore.write`. When a write fails the
 *     in-memory state is kept and `persistenceError` is raised so the UI can
 *     show a "could not be saved" notice (Req 11.8).
 *
 * The exposed shape matches the design's `AccountContextValue`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AccountState } from "@/lib/domain/types";
import {
  bookmarkResource as bookmarkResourcePure,
  emptyAccountState,
  markNodeCompleted as markNodeCompletedPure,
  removeBookmark as removeBookmarkPure,
  removeSavedTool as removeSavedToolPure,
  saveTool as saveToolPure,
  unmarkNodeCompleted as unmarkNodeCompletedPure,
} from "@/lib/store/account";
import { LocalStore, STORAGE_KEYS } from "@/lib/store/local-store";

/** Context value exposed by {@link AccountProvider} (design "Context Providers"). */
export interface AccountContextValue {
  account: AccountState;
  hasAccount: boolean;
  markNodeCompleted: (roadmapId: string, nodeId: string) => void;
  unmarkNodeCompleted: (roadmapId: string, nodeId: string) => void;
  saveTool: (toolId: string) => void;
  removeSavedTool: (toolId: string) => void;
  bookmarkResource: (resourceId: string) => void;
  removeBookmark: (resourceId: string) => void;
  /** True when the most recent persistence write failed (Req 11.8). */
  persistenceError: boolean;
  /** True when the initial restore found present-but-corrupt data (Req 11.9). */
  readError: boolean;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/**
 * Derive whether the visitor has any tracked data.
 *
 * Kept intentionally simple: the app grants full access regardless of account
 * state (Req 11.5), so this is only a convenience flag for the UI.
 */
function deriveHasAccount(state: AccountState): boolean {
  return (
    Object.keys(state.completedNodes).length > 0 ||
    state.savedToolIds.length > 0 ||
    state.bookmarkedResourceIds.length > 0
  );
}

/**
 * Restore the persisted account state on startup.
 *
 * `LocalStore.read` already swallows failures and returns the fallback, so it
 * cannot by itself tell us whether a present value was corrupt. To set
 * `readError` precisely (Req 11.9) we first inspect the raw stored string: a
 * non-null value that fails to `JSON.parse` is corrupt, so we report the error
 * and use the empty state. An absent value (a brand-new visitor) is not an
 * error.
 */
function restoreAccount(): { state: AccountState; readError: boolean } {
  const fallback = emptyAccountState();

  if (!LocalStore.isAvailable()) {
    return { state: fallback, readError: false };
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEYS.account);
  } catch {
    // Reading itself threw (storage disabled mid-session): treat as a read error.
    return { state: fallback, readError: true };
  }

  if (raw === null) {
    // No stored data — a clean first visit, not an error.
    return { state: fallback, readError: false };
  }

  try {
    JSON.parse(raw);
  } catch {
    // Present but corrupt/unparsable — clean empty state + readError (Req 11.9).
    return { state: fallback, readError: true };
  }

  // Value is present and parses; defer to the wrapper for the typed read.
  return {
    state: LocalStore.read(STORAGE_KEYS.account, fallback),
    readError: false,
  };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountState>(emptyAccountState);
  const [persistenceError, setPersistenceError] = useState(false);
  const [readError, setReadError] = useState(false);

  // Restore persisted state on mount (Req 11.6). Runs client-side only so SSR
  // renders the empty state and hydration reconciles to the restored value.
  useEffect(() => {
    const { state, readError: hadReadError } = restoreAccount();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: hydrate from localStorage on mount
    setAccount(state);
    setReadError(hadReadError);
  }, []);

  /**
   * Apply a pure state transition, commit it to React state, and persist it.
   * On write failure the in-memory state is kept and `persistenceError` is set
   * (Req 11.8); a successful write clears any prior error.
   */
  const applyAndPersist = useCallback(
    (transition: (prev: AccountState) => AccountState) => {
      setAccount((prev) => {
        const next = transition(prev);
        const ok = LocalStore.write(STORAGE_KEYS.account, next);
        setPersistenceError(!ok);
        return next;
      });
    },
    [],
  );

  const markNodeCompleted = useCallback(
    (roadmapId: string, nodeId: string) =>
      applyAndPersist((prev) => markNodeCompletedPure(prev, roadmapId, nodeId)),
    [applyAndPersist],
  );

  const unmarkNodeCompleted = useCallback(
    (roadmapId: string, nodeId: string) =>
      applyAndPersist((prev) =>
        unmarkNodeCompletedPure(prev, roadmapId, nodeId),
      ),
    [applyAndPersist],
  );

  const saveTool = useCallback(
    (toolId: string) => applyAndPersist((prev) => saveToolPure(prev, toolId)),
    [applyAndPersist],
  );

  const removeSavedTool = useCallback(
    (toolId: string) =>
      applyAndPersist((prev) => removeSavedToolPure(prev, toolId)),
    [applyAndPersist],
  );

  const bookmarkResource = useCallback(
    (resourceId: string) =>
      applyAndPersist((prev) => bookmarkResourcePure(prev, resourceId)),
    [applyAndPersist],
  );

  const removeBookmark = useCallback(
    (resourceId: string) =>
      applyAndPersist((prev) => removeBookmarkPure(prev, resourceId)),
    [applyAndPersist],
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      hasAccount: deriveHasAccount(account),
      markNodeCompleted,
      unmarkNodeCompleted,
      saveTool,
      removeSavedTool,
      bookmarkResource,
      removeBookmark,
      persistenceError,
      readError,
    }),
    [
      account,
      markNodeCompleted,
      unmarkNodeCompleted,
      saveTool,
      removeSavedTool,
      bookmarkResource,
      removeBookmark,
      persistenceError,
      readError,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

/**
 * Access the DevAtlas account context.
 *
 * @throws if used outside an {@link AccountProvider}.
 */
export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (ctx === null) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return ctx;
}
