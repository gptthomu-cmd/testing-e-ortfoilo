/**
 * ============================================================================
 *  SEO helpers — canonical URLs, metadata, Open Graph, social cards
 * ============================================================================
 *  Every page builds its metadata through `buildMetadata()` so titles,
 *  descriptions, canonicals, OG/Twitter tags and robots directives can never
 *  drift apart (or get duplicated across pages).
 * ============================================================================
 */
import type { Metadata } from "next";
import { SITE, url, SITE_ROOT, PERSON } from "./site";

export type PageMeta = {
  /** Path with a trailing slash, e.g. "/about/". */
  path: string;
  /** Unique <title> for the page (the layout template appends the site name). */
  title: string;
  /** Unique meta description, 120–158 characters. */
  description: string;
  /** Social share image path — defaults to the site-wide card. */
  ogImage?: string;
  ogImageAlt?: string;
  /** "article" enables article-specific Open Graph tags. */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  keywords?: readonly string[];
  /** Keep a page out of the index (redirect aliases, thank-you pages…). */
  noindex?: boolean;
  /** Skip the "| George S. Thomas" suffix for the homepage / brand pages. */
  titleAbsolute?: boolean;
};

export function canonicalFor(path: string): string {
  return url(path);
}

/**
 * Build a Next.js Metadata object from a PageMeta record.
 * Relative URLs are resolved against `metadataBase` (set in the root layout).
 */
export function buildMetadata(meta: PageMeta): Metadata {
  const ogImage = meta.ogImage || SITE.defaultOgImage;
  const ogImageAlt =
    meta.ogImageAlt || `${meta.title} — social card for ${SITE.name}`;

  const metadata: Metadata = {
    title: meta.titleAbsolute ? { absolute: meta.title } : meta.title,
    description: meta.description,
    keywords: meta.keywords ? [...meta.keywords] : [...SITE.keywords],
    alternates: {
      canonical: meta.path,
    },
    openGraph: {
      type: meta.type || "website",
      url: meta.path,
      title: meta.title,
      description: meta.description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [
        {
          url: ogImage,
          width: SITE.ogImageWidth,
          height: SITE.ogImageHeight,
          alt: ogImageAlt,
          type: "image/jpeg",
        },
      ],
      ...(meta.type === "article"
        ? {
            publishedTime: meta.publishedTime,
            modifiedTime: meta.modifiedTime,
            authors: meta.authors || [url("/about/")],
            section: meta.section,
            tags: meta.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
      ...(SITE.xHandle ? { site: SITE.xHandle, creator: SITE.xHandle } : {}),
    },
    robots: meta.noindex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    authors: [{ name: PERSON.name, url: url("/about/") }],
    creator: PERSON.name,
    publisher: SITE.name,
    category: "technology",
  };

  return metadata;
}

/** Dates for structured data + sitemap `lastmod`. ISO 8601, date-only. */
export const SITE_LAST_MODIFIED = "2026-09-26";

/** Words in an HTML string — used for `wordCount` in Article schema. */
export function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Plain-text description from HTML, trimmed to `max` characters. */
export function excerptFromHtml(html: string, max = 158): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/[,;:\s]+\S*$/, "")}…`;
}

/**
 * Rewrite root-relative URLs inside authored HTML so they keep working when the
 * site is deployed under a path prefix (GitHub Pages project sites).
 */
export function rewriteRootUrls(html: string, basePath: string): string {
  if (!basePath) return html;
  return html
    .replace(/(\s(?:href|src|srcset)=")\/(?!\/)/g, `$1${basePath}/`)
    .replace(/(,\s*)\/(?!\/)(?=[^"\s]+\s+\d+[wx])/g, `$1${basePath}/`);
}

/** Headings extracted from authored HTML (feeds the on-page "On this page" nav). */
export function headingsFromHtml(html: string): { id: string; text: string; level: number }[] {
  const out: { id: string; text: string; level: number }[] = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    out.push({
      level: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return out;
}

export { SITE_ROOT };
