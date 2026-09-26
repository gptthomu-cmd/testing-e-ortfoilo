/**
 * The site's route registry — one list that drives the sitemap, the robots
 * directives and the build-time SEO checker.
 *
 * Keeping it here (rather than reading the filesystem after the build) means the
 * checker can compare "routes the site claims exist" against "routes the build
 * actually produced", which is the failure mode worth catching.
 */
import { PROJECTS } from "@/content/projects";
import { ARTICLES } from "@/content/articles";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { ORGANIZATION } from "./site";

export type SiteRoute = {
  path: string;
  /** Sitemap priority hint. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  lastModified: string;
  /** Set for pages excluded from the sitemap. */
  noindex?: boolean;
};

/** Pages with hand-written content. */
const STATIC_ROUTES: SiteRoute[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", lastModified: "2026-09-26" },
  { path: "/about/", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-26" },
  { path: "/work/", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-26" },
  ...PROJECTS.map<SiteRoute>((project) => ({
    path: `/work/${project.slug}/`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-09-26",
  })),
  { path: "/ventures/", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-26" },
  ...ORGANIZATION.ventures.map<SiteRoute>((venture) => ({
    path: venture.path,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-09-26",
  })),
  { path: "/blog/", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-09-26" },
  ...ARTICLES.map<SiteRoute>((article) => ({
    path: `/blog/${article.slug}/`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: article.updated || article.date,
  })),
  {
    path: "/search-console-monitoring/",
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: "2026-09-26",
  },
  { path: "/contact/", priority: 0.6, changeFrequency: "yearly", lastModified: "2026-09-26" },
  ...LEGAL_DOCUMENTS.map<SiteRoute>((doc) => ({
    path: doc.path,
    priority: 0.3,
    changeFrequency: "yearly",
    lastModified: doc.updated,
  })),
];

/** Pages that must never appear in the sitemap. */
export const NON_INDEXABLE_ROUTES: SiteRoute[] = [
  { path: "/404.html", priority: 0, changeFrequency: "yearly", lastModified: "2026-09-26", noindex: true },
];

/** Indexable routes, longest-path-first is not required but stable ordering helps diffs. */
export const SITE_ROUTES: SiteRoute[] = STATIC_ROUTES;

export function allRoutePaths(): string[] {
  return SITE_ROUTES.map((route) => route.path);
}
