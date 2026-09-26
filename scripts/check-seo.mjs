#!/usr/bin/env node
/**
 * ============================================================================
 *  Build-time SEO & quality gate
 * ============================================================================
 *  Runs against the exported `out/` directory (after `npm run build`) and fails
 *  if the site breaks an invariant that matters for search, accessibility or
 *  structured data.
 *
 *  Usage:
 *    npm run seo:check          # human-readable report, non-zero exit on error
 *    npm run seo:report         # JSON to stdout (seo-report.json)
 *    node scripts/check-seo.mjs --dir out --base /testing-e-ortfoilo
 *
 *  Checks
 *  ------
 *   1. Exactly one <h1> per page, and it appears before any <h2>
 *   2. Unique <title> and unique meta description across pages
 *   3. Self-referencing, absolute canonical on every indexable page
 *   4. JSON-LD present, valid JSON, with @context/@type
 *   5. Core <head> signals: description, viewport, lang, og:*, twitter:card
 *   6. Images: alt text + explicit width/height (CLS)
 *   7. Internal links resolve to a real file (and in-page anchors exist)
 *   8. Sitemap: every URL is canonical, exists, is indexable, and every
 *      indexable page is listed
 *   9. robots.txt advertises the sitemap
 *  10. No unfilled TODO_FILL / placeholder analytics IDs leaked to production
 * ============================================================================
 */
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep, posix } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, flag("dir", "out"));
const JSON_OUTPUT = args.includes("--json");
const STRICT = args.includes("--strict");

if (!existsSync(OUT)) {
  console.error(`✖ Build output not found at ${OUT}\n  Run "npm run build" (or "npm run build:pages") first.`);
  process.exit(1);
}

/**
 * Origin and base path are read from the build itself (the homepage canonical),
 * so the script works the same for a root deploy and a GitHub Pages project
 * site without needing the environment variable set again.
 */
const readCanonical = (file) =>
  existsSync(file)
    ? (readFileSync(file, "utf8").match(/<link rel="canonical" href="([^"]*)"/i) || [])[1] || ""
    : "";

const homeUrl = (() => {
  try {
    return new URL(readCanonical(join(OUT, "index.html")) || "http://localhost/");
  } catch {
    return new URL("http://localhost/");
  }
})();
const ORIGIN = homeUrl.origin;
const BASE = (flag("base", "") || homeUrl.pathname).replace(/\/+$/, "");

const errors = [];
const warnings = [];
const notes = [];
const err = (page, message) => errors.push({ page, message });
const warn = (page, message) => warnings.push({ page, message });

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Every HTML file in the export, with its URL path. */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (entry === "_next" || entry === "images" || entry === "icons") continue;
      walk(full, acc);
    } else if (entry.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

/** File path → public URL path ("out/blog/x/index.html" → "/blog/x/"). */
function urlPathFor(file) {
  const rel = relative(OUT, file).split(sep).join(posix.sep);
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404.html";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

const first = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const isRedirectStub = (html) => /http-equiv="refresh"/i.test(html);

/** Resolve an internal href to a file inside out/. */
function resolveInternal(href) {
  let path = href.split("#")[0].split("?")[0];
  if (!path) return null;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || "/";
  if (!path.startsWith("/")) return null;
  if (/\.(xml|txt|json|webmanifest|ico|png|jpg|jpeg|svg|webp|avif|css|js|map|html)$/i.test(path)) {
    return join(OUT, path.replace(/^\//, ""));
  }
  const asDir = join(OUT, path.replace(/^\//, ""), "index.html");
  if (existsSync(asDir)) return asDir;
  const asFile = join(OUT, path.replace(/^\//, ""));
  if (existsSync(asFile)) return asFile;
  return asDir; // report the expected path when missing
}

/* -------------------------------------------------------------------------- */
/*  Collect pages                                                             */
/* -------------------------------------------------------------------------- */

const NON_ROUTE_HTML = [/^\/(404|_not-found|_next)\//, /^\/[^/]*\.html$/];

const files = walk(OUT).sort();
const pages = files
  .map((file) => {
    const html = readFileSync(file, "utf8");
    return { file, html, url: urlPathFor(file), stub: isRedirectStub(html) };
  })
  // Skip non-route HTML: RSC payload folders, the 404 page and inert static
  // files in public/ (verification stubs) that are not published pages.
  .filter(
    (page) =>
      !NON_ROUTE_HTML.some((re) => re.test(page.url)) || page.url === "/404.html",
  );

const contentPages = pages.filter((p) => !p.stub && p.url !== "/404.html");
const titles = new Map();
const descriptions = new Map();

/* -------------------------------------------------------------------------- */
/*  1–6. Per-page checks                                                      */
/* -------------------------------------------------------------------------- */

for (const page of pages) {
  const { html, url } = page;
  const head = html.split("</head>")[0] || html;

  if (page.stub) {
    // Redirect aliases must be noindex + canonical to their destination.
    if (!/<meta name="robots" content="noindex/i.test(head))
      err(url, "redirect stub is missing a noindex robots meta");
    if (!/<link rel="canonical"/i.test(head)) err(url, "redirect stub is missing a canonical link");
    continue;
  }

  const is404 = url === "/404.html" || /<title>[^<]*404/i.test(head);

  /* 1. headings */
  const h1s = html.match(/<h1[\s>]/g) || [];
  const h2s = html.match(/<h2[\s>]/g) || [];
  if (h1s.length !== 1) err(url, `expected exactly one <h1>, found ${h1s.length}`);
  const firstH2 = html.search(/<h2[\s>]/);
  const firstH1 = html.search(/<h1[\s>]/);
  if (h1s.length === 1 && firstH2 !== -1 && firstH2 < firstH1)
    err(url, "an <h2> appears before the <h1>");

  /* 2. title & description */
  const title = decode(first(head, /<title[^>]*>([\s\S]*?)<\/title>/i) || "");
  const description = decode(
    first(head, /<meta name="description" content="([^"]*)"/i) || "",
  );

  if (!title) err(url, "missing <title>");
  if (!description) err(url, "missing meta description");
  if (title.length > 70) warn(url, `title is ${title.length} chars (recommended ≤ 60–70)`);
  if (description && (description.length < 70 || description.length > 165))
    warn(url, `meta description is ${description.length} chars (recommended 120–158)`);

  if (title) {
    if (titles.has(title)) err(url, `duplicate <title> — also used by ${titles.get(title)}`);
    else titles.set(title, url);
  }
  if (description) {
    if (descriptions.has(description))
      err(url, `duplicate meta description — also used by ${descriptions.get(description)}`);
    else descriptions.set(description, url);
  }

  /* 3. canonical */
  const canonical = first(head, /<link rel="canonical" href="([^"]*)"/i);
  const selfCanonical =
    canonical && canonical.replace(/\/$/, "") === `${ORIGIN}${BASE}${url}`.replace(/\/$/, "");
  if (!canonical) {
    if (is404) warn(url, "404 page has no canonical (acceptable, noindex)");
    else err(url, "missing canonical link");
  } else {
    if (!/^https?:\/\//.test(canonical)) err(url, `canonical is not absolute: ${canonical}`);
    if (!selfCanonical && !is404)
      err(url, `canonical is not self-referencing: ${canonical} (expected …${BASE}${url})`);
  }

  const robotsMeta = first(head, /<meta name="robots" content="([^"]*)"/i) || "";
  const noindex = /noindex/i.test(robotsMeta);

  /* 4. structured data */
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (ldBlocks.length === 0) err(url, "no JSON-LD structured data found");
  const declaredTypes = new Set();
  for (const [, raw] of ldBlocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/\\u003c/g, "<"));
    } catch (e) {
      err(url, `JSON-LD does not parse: ${String(e).slice(0, 90)}`);
      continue;
    }
    const nodes = parsed["@graph"] ? parsed["@graph"] : [parsed];
    if (!parsed["@context"] && !parsed["@graph"]) err(url, "JSON-LD block has no @context");
    for (const node of nodes) {
      const t = node && node["@type"];
      if (!t) err(url, "JSON-LD node without @type");
      else [].concat(t).forEach((x) => declaredTypes.add(x));
    }
  }
  if (!declaredTypes.has("WebPage") && !declaredTypes.has("ProfilePage") && !declaredTypes.has("CollectionPage") && !declaredTypes.has("ContactPage"))
    warn(url, `no page-level schema type (found: ${[...declaredTypes].join(", ") || "none"})`);
  if (!declaredTypes.has("BreadcrumbList") && url !== "/" && !is404)
    warn(url, "no BreadcrumbList schema on a non-home page");

  /* 5. head signals */
  const checks = [
    ["viewport", /<meta name="viewport"/i],
    ["og:title", /property="og:title"/i],
    ["og:description", /property="og:description"/i],
    ["og:image", /property="og:image"/i],
    ["og:url", /property="og:url"/i],
    ["og:type", /property="og:type"/i],
    ["twitter:card", /name="twitter:card"/i],
  ];
  for (const [label, re] of checks) {
    if (!re.test(head)) {
      if (is404) warn(url, `missing ${label}`);
      else err(url, `missing required head tag: ${label}`);
    }
  }
  if (!/<html[^>]+lang="/i.test(html)) err(url, "<html> is missing a lang attribute");

  /* 6. images */
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const alt = tag.match(/\balt="([^"]*)"/);
    if (!alt || !alt[1].trim()) err(url, `image without alt text: ${tag.slice(0, 90)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag))
      warn(url, `image without explicit width/height (CLS risk): ${tag.slice(0, 80)}`);
  }

  /* 10. placeholders that must not ship */
  for (const pattern of ["TODO_FILL", "G-XXXXXXXXXX", "REPLACE_ME", "your-domain"]) {
    if (html.includes(pattern))
      warn(url, `shipped placeholder text "${pattern}" — fill it in src/lib/site.ts before launch`);
  }
}

/* -------------------------------------------------------------------------- */
/*  7. Internal links                                                         */
/* -------------------------------------------------------------------------- */

const anchorCache = new Map();
const idsFor = (file) => {
  if (!anchorCache.has(file)) {
    const html = existsSync(file) ? readFileSync(file, "utf8") : "";
    anchorCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return anchorCache.get(file);
};

for (const page of pages) {
  if (page.stub) continue;
  const hrefs = [...page.html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(href)) {
      if (href.startsWith("#") && href.length > 1) {
        if (!idsFor(page.file).has(href.slice(1)))
          err(page.url, `in-page anchor does not exist: ${href}`);
      }
      continue;
    }
    const target = resolveInternal(href);
    if (!target) continue;
    if (!existsSync(target)) {
      err(page.url, `internal link does not resolve: ${href}`);
      continue;
    }
    const hash = href.includes("#") ? href.split("#")[1] : "";
    if (hash && target.endsWith(".html")) {
      if (!idsFor(target).has(hash)) err(page.url, `anchor #${hash} not found in ${href.split("#")[0]}`);
    }
  }
  // Asset references (src/href on non-anchor tags) must exist too.
  for (const [, src] of page.html.matchAll(/<(?:img|source|script|link)\b[^>]*\b(?:src|srcSet|srcset|href)="([^"]+)"/g)) {
    for (const candidate of src.split(",")) {
      const value = candidate.trim().split(/\s+/)[0];
      if (!value || /^(https?:|data:|#)/i.test(value)) continue;
      const target = resolveInternal(value);
      if (target && !existsSync(target)) err(page.url, `asset does not exist: ${value}`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  8. Sitemap                                                                */
/* -------------------------------------------------------------------------- */

const sitemapPath = join(OUT, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  err("sitemap.xml", "sitemap.xml was not generated");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length === 0) err("sitemap.xml", "sitemap contains no URLs");

  const listed = new Set();
  for (const loc of locs) {
    if (!/^https:\/\//.test(loc)) err("sitemap.xml", `URL is not https: ${loc}`);
    const path = loc.replace(/^https?:\/\/[^/]+/, "");
    let local = path;
    if (BASE && local.startsWith(BASE)) local = local.slice(BASE.length) || "/";
    const file = local.endsWith("/")
      ? join(OUT, local.replace(/^\//, ""), "index.html")
      : join(OUT, local.replace(/^\//, ""));
    if (!existsSync(file)) err("sitemap.xml", `listed URL does not exist in the build: ${loc}`);
    else {
      const html = readFileSync(file, "utf8");
      const canonical = first(html, /<link rel="canonical" href="([^"]*)"/i);
      if (canonical && canonical.replace(/\/$/, "") !== loc.replace(/\/$/, ""))
        err("sitemap.xml", `canonical mismatch: sitemap says ${loc}, page says ${canonical}`);
      if (/<meta name="robots"[^>]*noindex/i.test(html))
        err("sitemap.xml", `listed URL is marked noindex: ${loc}`);
    }
    listed.add(local === "/" ? "/" : local.replace(/\/$/, ""));
  }

  for (const page of contentPages) {
    if (page.url === "/404.html") continue;
    if (/<meta name="robots"[^>]*noindex/i.test(page.html)) continue;
    const key = page.url === "/" ? "/" : page.url.replace(/\/$/, "");
    if (!listed.has(key)) err(page.url, "indexable page is missing from sitemap.xml");
  }
  notes.push(`${locs.length} URLs in sitemap.xml`);
}

/* -------------------------------------------------------------------------- */
/*  9. robots.txt                                                             */
/* -------------------------------------------------------------------------- */

const robotsPath = join(OUT, "robots.txt");
if (!existsSync(robotsPath)) {
  err("robots.txt", "robots.txt was not generated");
} else {
  const robots = readFileSync(robotsPath, "utf8");
  if (!/^Sitemap:\s*https?:\/\//im.test(robots)) err("robots.txt", "no absolute Sitemap: line");
  if (!/^Allow:\s*\/\s*$/im.test(robots)) err("robots.txt", "does not allow crawling of /");
  if (/Disallow:\s*\/\s*$/im.test(robots.replace(/User-Agent: (GPTBot|CCBot|anthropic-ai|ClaudeBot|Bytespider)[\s\S]*?(?=\n\n|$)/gi, "")))
    err("robots.txt", "a search engine user-agent is fully disallowed");
}

/* -------------------------------------------------------------------------- */
/*  Feed + manifest sanity                                                    */
/* -------------------------------------------------------------------------- */

for (const required of ["feed.xml", "site.webmanifest", "404.html", ".nojekyll"]) {
  if (!existsSync(join(OUT, required))) warn(required, `expected file missing from the build: ${required}`);
}

/* -------------------------------------------------------------------------- */
/*  Report                                                                    */
/* -------------------------------------------------------------------------- */

const report = {
  generatedAt: new Date().toISOString(),
  outputDir: relative(root, OUT),
  basePath: BASE || "(none)",
  pagesChecked: pages.length,
  contentPages: contentPages.length,
  errors,
  warnings,
  notes,
  ok: errors.length === 0,
};

if (JSON_OUTPUT) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const line = "─".repeat(74);
  console.log(`\n${line}\n  SEO / quality gate — ${report.pagesChecked} pages checked\n${line}`);
  if (notes.length) notes.forEach((n) => console.log(`  · ${n}`));

  if (errors.length) {
    console.log(`\n  ✖ ${errors.length} error(s):\n`);
    const grouped = new Map();
    for (const e of errors) {
      if (!grouped.has(e.page)) grouped.set(e.page, []);
      grouped.get(e.page).push(e.message);
    }
    for (const [page, messages] of grouped) {
      console.log(`  ${page}`);
      messages.forEach((m) => console.log(`     ✖ ${m}`));
    }
  }

  if (warnings.length) {
    console.log(`\n  ⚠ ${warnings.length} warning(s):\n`);
    const grouped = new Map();
    for (const w of warnings) {
      if (!grouped.has(w.page)) grouped.set(w.page, []);
      grouped.get(w.page).push(w.message);
    }
    for (const [page, messages] of grouped) {
      console.log(`  ${page}`);
      messages.slice(0, 6).forEach((m) => console.log(`     ⚠ ${m}`));
      if (messages.length > 6) console.log(`     ⚠ …and ${messages.length - 6} more`);
    }
  }

  if (!errors.length) console.log(`\n  ✓ All ${report.pagesChecked} pages passed the hard checks.`);
  console.log(`\n${line}\n`);
}

writeFileSync(join(root, "seo-report.json"), `${JSON.stringify(report, null, 2)}\n`);

// Non-zero exit on any hard error so CI and `npm run verify` fail loudly.
// `--strict` additionally fails on warnings.
process.exit(errors.length > 0 || (STRICT && warnings.length > 0) ? 1 : 0);
