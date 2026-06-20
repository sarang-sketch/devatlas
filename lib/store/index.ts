/**
 * Public entry point for the DevAtlas persistence layer.
 *
 * Re-exports the pure account helpers and the fault-tolerant `LocalStore`
 * wrapper so consumers can import from `@/lib/store`.
 */

export {
  ACCOUNT_SCHEMA_VERSION,
  emptyAccountState,
  roadmapProgress,
  markNodeCompleted,
  unmarkNodeCompleted,
  saveTool,
  removeSavedTool,
  bookmarkResource,
  removeBookmark,
} from "./account";

export {
  LocalStore,
  STORAGE_KEYS,
  read,
  write,
  remove,
} from "./local-store";
