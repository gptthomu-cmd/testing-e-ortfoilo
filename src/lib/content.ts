/**
 * Small helpers shared by pages that render authored HTML content.
 */
import { rewriteRootUrls } from "./seo";
import { BASE_PATH } from "./site";

export type Heading = { id: string; text: string; level: number };

/**
 * Extract H2/H3 headings from authored HTML. Headings must carry an `id` — the
 * SEO checker enforces this so anchors and the on-page nav can never dangle.
 */
export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23])(?:\s+id="([^"]*)")?[^>]*>([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  let autoIndex = 0;
  while ((match = re.exec(html))) {
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    const id = match[2] || slugify(text) || `section-${++autoIndex}`;
    headings.push({ level: Number(match[1]), id, text });
  }
  return headings;
}

/** Add ids to headings that lack them, in document order. */
export function ensureHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, level, attrs, inner) => {
    if (/\sid=/.test(attrs)) return full;
    const id = slugify(inner.replace(/<[^>]+>/g, "").trim());
    if (!id) return full;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
}

/** Rewrite root-relative links so the content works under the deploy prefix. */
export function prepareHtml(html: string): string {
  return rewriteRootUrls(ensureHeadingIds(html), BASE_PATH);
}

/** Rough word count for Article schema `wordCount`. */
export function wordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Reading time estimate from the same word count. */
export function readingTime(html: string): string {
  const minutes = Math.max(1, Math.round(wordCount(html) / 210));
  return `${minutes} min read`;
}
