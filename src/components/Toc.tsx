/**
 * "On this page" navigation built from the H2/H3 headings of the rendered body.
 * Improves scannability and adds crawlable in-page anchors.
 */
import type { Heading } from "@/lib/content";

export function Toc({ headings, label = "On this page" }: { headings: Heading[]; label?: string }) {
  if (headings.length < 3) return null;

  return (
    <nav className="toc" aria-label={label}>
      <h2>{label}</h2>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "toc-3" : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
