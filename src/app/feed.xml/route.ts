/**
 * /feed.xml — RSS 2.0 feed of published articles.
 *
 * A second discovery path for new content (feed readers, aggregators) and a
 * record of publication order that does not depend on the sitemap.
 */
import { buildRssFeed } from "@/content/articles";
import { SITE, SITE_ROOT } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const xml = buildRssFeed(
    SITE_ROOT,
    SITE.name,
    "Field notes on EV charging infrastructure, homelab systems, creator workflows and building software with AI agents.",
  );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
