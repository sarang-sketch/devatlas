import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { z } from "zod";

import { parseContent } from "@/lib/content/loaders";

// Feature: devatlas, Property 29: Content validation keeps conforming entries and omits the rest
//
// parseContent(schema, raw[]) validates each entry independently and returns
// { valid, skipped }. For any array of raw entries it must:
//   - return exactly the conforming entries, in their original order,
//   - omit every non-conforming entry,
//   - report a skipped count equal to the number omitted (valid.length + skipped === input length),
//   - and surface any newly appended conforming entry in `valid`.
//
// Validates: Requirements 15.4, 15.5

// A small but representative content schema: an object with a required string
// id and a required integer value. Mirrors the shape of the real content
// schemas (constrained, typed object fields) without their incidental size.
const schema = z.object({
  id: z.string(),
  value: z.number().int(),
});

type Entry = z.infer<typeof schema>;

/** Always produces an entry that conforms to `schema`. */
const conformingArb: fc.Arbitrary<Entry> = fc.record({
  id: fc.string(),
  value: fc.integer(),
});

/**
 * Always produces a value that does NOT conform to `schema`: a non-object
 * primitive, a null, an object with a wrong-typed field, or an object missing
 * a required field. None of these can ever satisfy { id: string, value: int }.
 */
const nonConformingArb: fc.Arbitrary<unknown> = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.integer(),
  fc.string(),
  fc.boolean(),
  // id is the wrong type.
  fc.record({ id: fc.integer(), value: fc.integer() }),
  // value is the wrong type.
  fc.record({ id: fc.string(), value: fc.string() }),
  // required `value` is missing.
  fc.record({ id: fc.string() }),
  // both required fields absent.
  fc.record({ other: fc.string() }),
);

/** A tagged entry so the test knows ground truth about conformance. */
const taggedArb = fc.oneof(
  conformingArb.map((entry) => ({ entry: entry as unknown, conforms: true })),
  nonConformingArb.map((entry) => ({ entry, conforms: false })),
);

describe("parseContent — Property 29: content validation", () => {
  it("returns exactly the conforming entries, omits the rest, and counts skips", () => {
    fc.assert(
      fc.property(fc.array(taggedArb), (items) => {
        const raw = items.map((i) => i.entry);
        const expectedValid = items
          .filter((i) => i.conforms)
          .map((i) => i.entry);

        const { valid, skipped } = parseContent(schema, raw);

        // Exactly the conforming entries, in original order.
        expect(valid).toEqual(expectedValid);
        // Skipped equals the number of non-conforming entries.
        expect(skipped).toBe(raw.length - expectedValid.length);
        // Every entry is accounted for as either valid or skipped.
        expect(valid.length + skipped).toBe(raw.length);
      }),
    );
  });

  it("surfaces a freshly added conforming entry in valid (Req 15.5)", () => {
    fc.assert(
      fc.property(fc.array(taggedArb), conformingArb, (items, fresh) => {
        const raw = items.map((i) => i.entry);

        const before = parseContent(schema, raw);
        const after = parseContent(schema, [...raw, fresh]);

        // The appended conforming entry appears in valid...
        expect(after.valid).toContainEqual(fresh);
        // ...exactly once more than before, appended at the end, in order...
        expect(after.valid).toEqual([...before.valid, fresh]);
        // ...without changing the skipped count.
        expect(after.skipped).toBe(before.skipped);
      }),
    );
  });

  // Example-based edge cases complementing the universal properties.
  it("returns an empty result for an empty input", () => {
    expect(parseContent(schema, [])).toEqual({ valid: [], skipped: 0 });
  });

  it("skips every entry when none conform", () => {
    const raw = [null, 1, "x", { id: 1 }];
    const { valid, skipped } = parseContent(schema, raw);
    expect(valid).toEqual([]);
    expect(skipped).toBe(raw.length);
  });

  it("keeps every entry when all conform", () => {
    const raw = [
      { id: "a", value: 1 },
      { id: "b", value: 2 },
    ];
    const { valid, skipped } = parseContent(schema, raw);
    expect(valid).toEqual(raw);
    expect(skipped).toBe(0);
  });
});
