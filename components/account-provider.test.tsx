/**
 * Tests for the AccountProvider context (task 13.2).
 *
 * Covers restore-on-mount, mutate-and-persist, write-failure handling, and
 * corrupt-read handling against the real `LocalStore` wrapper backed by jsdom's
 * `localStorage` (Req 11.1, 11.2, 11.3, 11.5, 11.6, 11.7, 11.8, 11.9).
 */

import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AccountState } from "@/lib/domain/types";
import { emptyAccountState } from "@/lib/store/account";
import { LocalStore, STORAGE_KEYS } from "@/lib/store/local-store";

import {
  AccountProvider,
  useAccount,
  type AccountContextValue,
} from "./account-provider";

function wrapper({ children }: { children: React.ReactNode }) {
  return <AccountProvider>{children}</AccountProvider>;
}

function renderAccount() {
  return renderHook(() => useAccount(), { wrapper });
}

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("AccountProvider restore on mount", () => {
  it("starts from an empty state with no stored data (Req 11.5, 11.6)", () => {
    const { result } = renderAccount();

    expect(result.current.account).toEqual(emptyAccountState());
    expect(result.current.hasAccount).toBe(false);
    expect(result.current.readError).toBe(false);
    expect(result.current.persistenceError).toBe(false);
  });

  it("restores a persisted account state on mount (Req 11.6)", () => {
    const stored: AccountState = {
      completedNodes: { "roadmap-frontend": ["node-html"] },
      savedToolIds: ["vercel"],
      bookmarkedResourceIds: ["mdn"],
      schemaVersion: 1,
    };
    window.localStorage.setItem(
      STORAGE_KEYS.account,
      JSON.stringify(stored),
    );

    const { result } = renderAccount();

    expect(result.current.account).toEqual(stored);
    expect(result.current.hasAccount).toBe(true);
    expect(result.current.readError).toBe(false);
  });
});

describe("AccountProvider mutations persist and update state (Req 11.2, 11.3, 11.7)", () => {
  it("marks a node completed, persisting and updating in-memory state", () => {
    const { result } = renderAccount();

    act(() => {
      result.current.markNodeCompleted("roadmap-frontend", "node-html");
    });

    expect(result.current.account.completedNodes).toEqual({
      "roadmap-frontend": ["node-html"],
    });
    expect(result.current.persistenceError).toBe(false);

    const persisted = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.account) as string,
    ) as AccountState;
    expect(persisted.completedNodes).toEqual({
      "roadmap-frontend": ["node-html"],
    });
  });

  it("saves and removes a tool, restoring the prior state (Req 11.7)", () => {
    const { result } = renderAccount();

    act(() => {
      result.current.saveTool("supabase");
    });
    expect(result.current.account.savedToolIds).toEqual(["supabase"]);

    act(() => {
      result.current.removeSavedTool("supabase");
    });
    expect(result.current.account.savedToolIds).toEqual([]);

    const persisted = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.account) as string,
    ) as AccountState;
    expect(persisted.savedToolIds).toEqual([]);
  });

  it("bookmarks and unbookmarks a resource", () => {
    const { result } = renderAccount();

    act(() => {
      result.current.bookmarkResource("mdn");
    });
    expect(result.current.account.bookmarkedResourceIds).toEqual(["mdn"]);

    act(() => {
      result.current.removeBookmark("mdn");
    });
    expect(result.current.account.bookmarkedResourceIds).toEqual([]);
  });

  it("unmarks a completed node", () => {
    const { result } = renderAccount();

    act(() => {
      result.current.markNodeCompleted("rm", "n1");
    });
    act(() => {
      result.current.unmarkNodeCompleted("rm", "n1");
    });

    expect(result.current.account.completedNodes).toEqual({});
  });
});

describe("AccountProvider write-failure handling (Req 11.8)", () => {
  it("sets persistenceError but keeps in-memory state when a write fails", () => {
    const writeSpy = vi.spyOn(LocalStore, "write").mockReturnValue(false);

    const { result } = renderAccount();

    act(() => {
      result.current.saveTool("vercel");
    });

    // In-memory state still reflects the mutation...
    expect(result.current.account.savedToolIds).toEqual(["vercel"]);
    // ...but the failure was surfaced.
    expect(result.current.persistenceError).toBe(true);
    expect(writeSpy).toHaveBeenCalled();
  });
});

describe("AccountProvider corrupt-read handling (Req 11.9)", () => {
  it("sets readError and uses the empty state when stored data is corrupt", () => {
    window.localStorage.setItem(STORAGE_KEYS.account, "{not valid json");

    const { result } = renderAccount();

    expect(result.current.readError).toBe(true);
    expect(result.current.account).toEqual(emptyAccountState());
  });
});

describe("useAccount outside a provider", () => {
  it("throws a helpful error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAccount())).toThrow(
      /must be used within an AccountProvider/,
    );
    spy.mockRestore();
  });
});

describe("AccountProvider children render (Req 11.1)", () => {
  it("renders its children", () => {
    function Probe() {
      const { hasAccount } = useAccount() as AccountContextValue;
      return <div>account:{String(hasAccount)}</div>;
    }
    render(
      <AccountProvider>
        <Probe />
      </AccountProvider>,
    );
    expect(screen.getByText("account:false")).toBeInTheDocument();
  });
});
