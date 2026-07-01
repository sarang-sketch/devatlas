/**
 * Renders one or more schema.org JSON-LD objects as a `<script>` tag.
 *
 * JSON-LD is the format Google recommends for structured data. It is injected
 * as static markup so it works with `output: "export"` and is present in the
 * initial HTML for crawlers (no client-side execution required).
 */

interface JsonLdProps {
  /** A single schema object or an array of schema objects. */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Safe: `data` is built from our own trusted, static content — never
      // from user input — so there is no injection surface here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
