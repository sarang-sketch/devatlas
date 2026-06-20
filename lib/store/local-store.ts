/**
 * DevAtlas persistence layer — a thin, fault-tolerant wrapper around the
 * browser's local storage (design "Persistence Layer", Req 11, Req 12).
 *
 * The wrapper exists so the rest of the app never touches `localStorage`
 * directly and never has to crash on its many failure modes:
 *
 *   - Server / non-browser environments: every access is guarded by a
 *     `typeof window` check so calls during SSR are safe no-ops (Req 15.2).
 *   - Write failure (Req 11.8, 12.7): `setItem` can throw (storage disabled or
 *     quota exceeded). `write` catches the exception and returns `false` so the
 *     caller can keep its in-memory session state and surface a
 *     "could not be saved" notice — nothing is thrown.
 *   - Read failure (Req 11.9): `getItem` can throw and stored data can be
 *     corrupt/unparsable. `read` catches every such case and returns the
 *     caller-provided fallback (a clean empty state) instead of crashing.
 *
 * The default empty `AccountState` factory is re-exported here for convenience
 * so callers can do `read(ACCOUNT_KEY, emptyAccountState())`.
 */

import { emptyAccountState } from "./account";

export { emptyAccountState };

/** Storage keys used by the DevAtlas persistence layer. */
export const STORAGE_KEYS = {
  account: "devatlas:account",
  theme: "devatlas:theme",
} as const;

/**
 * True only when running in a browser with a usable `localStorage`.
 *
 * Guards against both server-side rendering (`window` undefined) and
 * environments where `localStorage` itself is unavailable.
 */
function isStorageAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined" &&
    window.localStorage !== null
  );
}

/**
 * Read and JSON-parse a value from local storage.
 *
 * Returns `fallback` when:
 *   - storage is unavailable (non-browser / SSR),
 *   - the key is absent,
 *   - reading throws, or
 *   - the stored value is corrupt and cannot be parsed.
 *
 * Never throws (Req 11.9).
 */
export function read<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Serialize and write a value to local storage.
 *
 * Returns `true` on success and `false` on any failure (storage unavailable,
 * `setItem` throwing because storage is disabled or the quota is exceeded, or a
 * serialization error). Never throws, so callers can branch on the boolean to
 * set a persistence-error flag while keeping session state intact (Req 11.8,
 * 12.7).
 */
export function write(key: string, value: unknown): boolean {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a key from local storage.
 *
 * Returns `true` on success and `false` on any failure. Never throws.
 */
export function remove(key: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * The DevAtlas local-storage wrapper.
 *
 * Grouped object form of the read/write/remove helpers for callers that prefer
 * `LocalStore.read(...)` over importing the individual functions.
 */
export const LocalStore = {
  read,
  write,
  remove,
  isAvailable: isStorageAvailable,
} as const;
