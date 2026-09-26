/**
 * JSON-LD emitter. Escapes `<` so a stray angle bracket inside a string can
 * never terminate the script tag early.
 */
import type { JsonLdNode } from "@/lib/schema";

export function JsonLd({ data, id }: { data: JsonLdNode | JsonLdNode[]; id?: string }) {
  const json = JSON.stringify(data, null, 0).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      id={id}
      // Structured data is generated from typed local objects, never user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
