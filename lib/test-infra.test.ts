import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Placeholder test verifying the test runner, fast-check, and shared setup
// are wired up correctly. Replaced by real domain tests in later tasks.
describe("test infrastructure", () => {
  it("runs a basic example test", () => {
    expect(1 + 1).toBe(2);
  });

  it("runs a property test with fast-check", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      }),
    );
  });

  it("uses a global numRuns default of at least 100", () => {
    expect(fc.readConfigureGlobal()?.numRuns).toBe(100);
  });
});
