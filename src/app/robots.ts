/**
 * /robots.txt — deliberately permissive.
 *
 * A small site loses more from an over-restrictive robots file than it gains
 * from clever rules, so this allows everything indexable, blocks nothing that
 * matters, and advertises the sitemap and the feed.
 *
 * NOTE for GitHub Pages project sites: robots.txt is only honoured at the origin
 * root (https://<user>.github.io/robots.txt). A project site served from
 * /<repo>/ cannot satisfy that, so `deploy/root/robots.txt` in this repository
 * contains a ready-to-publish root copy for a user-site repository or custom
 * domain. See docs/DEPLOYMENT.md.
 */
import type { MetadataRoute } from "next";
import { SITE_ROOT, ENDPOINTS } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Internal scaffolding that has no value in the index.
        disallow: ["/api/", "/*?utm_", "/*?ref="],
      },
      {
        // Block aggressive scrapers and AI-training crawlers that add no
        // referral value; search crawlers stay allowed.
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "ClaudeBot", "Bytespider"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_ROOT}${ENDPOINTS.sitemap}`,
    host: SITE_ROOT,
    // Next adds the feed as a secondary discovery hint.
  };
}
