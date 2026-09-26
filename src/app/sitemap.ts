/**
 * /sitemap.xml — generated from the route registry, so it can never list a URL
 * the site does not serve, and never omit one it does.
 *
 * Emitted for search engines with:
 *   • fully-qualified canonical URLs (including any deployment path prefix)
 *   • lastmod taken from each page's own metadata
 *   • changefreq/priority as hints only (Google ignores priority, but it costs nothing)
 */
import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "@/lib/routes";
import { url } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map((route) => ({
    url: url(route.path),
    lastModified: new Date(`${route.lastModified}T06:30:00+05:30`),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  })).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
