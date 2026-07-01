import type { FaqEntry } from "@/lib/seo/structured-data";

/**
 * Renders an accessible, visible FAQ block using native `<details>`/`<summary>`
 * so it works without JavaScript and stays crawlable. Pair it with
 * `faqSchema(entries)` (rendered via `JsonLd`) so the visible content matches
 * the structured data — a requirement for FAQ rich results.
 */
export function FaqSection({
  entries,
  heading = "Frequently Asked Questions",
}: {
  entries: FaqEntry[];
  heading?: string;
}) {
  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {heading}
      </h2>
      <div className="mt-6 divide-y divide-border rounded-xl border border-border">
        {entries.map((entry, index) => (
          <details key={index} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
              <span>{entry.question}</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {entry.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
