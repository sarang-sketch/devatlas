import { describe, it, expect, afterEach, vi } from "vitest";

import { read, write, remove, LocalStore, STORAGE_KEYS } from "@/lib/store/local-store";
import { emptyAccountState } from "@/lib/store/account";
import type { AccountState } from "@/lib/domain/types";

const KEY = "devatlas:test";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Happy path (jsdom provides a working localStorage)
// ---------------------------------------------------------------------------

describe("read / write happy path", () => {
  it("write returns true and read round-trips the stored value", () => {
    const state: AccountState = {
      ...emptyAccountState(),
      savedToolIds: ["a", "b"],
      completedNodes: { r1: ["n1"] },
    };

    expect(write(KEY, state)).toBe(true);
    expect(read<AccountState>(KEY, emptyAccountState())).toEqual(state);
  });

  it("read returns the fallback when the key is absent", () => {
    const fallback = emptyAccountState();
    expect(read(KEY, fallback)).toEqual(fallback);
  });

  it("remove deletes a stored key", () => {
    write(KEY, { a: 1 });
    expect(remove(KEY)).toBe(true);
    expect(read(KEY, "fallback")).toBe("fallback");
  });

  it("exposes the DevAtlas storage keys", () => {
    expect(STORAGE_KEYS.account).toBe("devatlas:account");
    expect(STORAGE_KEYS.theme).toBe("devatlas:theme");
  });
});

// ---------------------------------------------------------------------------
// Read failure: corrupt / unparsable data (Req 11.9)
// ---------------------------------------------------------------------------

describe("read failure handling", () => {
  it("returns the fallback (clean empty state) for corrupt JSON", () => {
    // Write raw, unparsable content directly, bypassing JSON.stringify.
    window.localStorage.setItem(STORAGE_KEYS.account, "{ this is not json ");

    const restored = read<AccountState>(STORAGE_KEYS.account, emptyAccountState());
    expect(restored).toEqual(emptyAccountState());
  });

  it("returns the fallback when getItem throws", () => {
    // jsdom's storage methods live on Storage.prototype.
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage read blew up");
    });

    const fallback = emptyAccountState();
    expect(read(STORAGE_KEYS.account, fallback)).toEqual(fallback);
  });
});

// ---------------------------------------------------------------------------
// Write failure: quota / disabled storage (Req 11.8, 12.7)
// ---------------------------------------------------------------------------

describe("write failure handling", () => {
  it("returns false (without throwing) when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    let result: boolean | undefined;
    expect(() => {
      result = write(STORAGE_KEYS.account, emptyAccountState());
    }).not.toThrow();
    expect(result).toBe(false);
  });

  it("remove returns false (without throwing) when removeItem throws", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("cannot remove");
    });
    expect(write(KEY, { a: 1 })).toBe(true);
    expect(remove(KEY)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// LocalStore object form
// ---------------------------------------------------------------------------

describe("LocalStore object", () => {
  it("reports availability in the jsdom environment", () => {
    expect(LocalStore.isAvailable()).toBe(true);
  });

  it("groups the read/write/remove helpers", () => {
    expect(LocalStore.write(KEY, 42)).toBe(true);
    expect(LocalStore.read(KEY, 0)).toBe(42);
    expect(LocalStore.remove(KEY)).toBe(true);
  });
});
