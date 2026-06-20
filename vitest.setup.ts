import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import fc from "fast-check";

// Run a minimum of 100 generated cases per property (Req 15.2).
fc.configureGlobal({ numRuns: 100 });

// Unmount React trees rendered by Testing Library after each test.
afterEach(() => {
  cleanup();
});
