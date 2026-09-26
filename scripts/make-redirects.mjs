#!/usr/bin/env node
/**
 * Generate the static redirect stubs (and their manifest) for alias URLs.
 *
 *   npm run redirects:build
 *
 * GitHub Pages cannot issue 301s, so each alias is a real HTML file that:
 *   • declares a canonical link to its destination (the SEO signal),
 *   • performs a meta-refresh redirect (the user-facing behaviour),
 *   • is marked `noindex, follow` and excluded from the sitemap,
 *   • uses a *relative* target so it works with or without a base path.
 *
 * Add new aliases to REDIRECTS below and commit the regenerated files.
 * `public/redirects.json` is the machine-readable version — point edge
 * redirects (Cloudflare/Netlify/Vercel) at it when you move to a host that can
 * serve real 301s.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC = join(root, "public");

/** Canonical origin + prefix this repository deploys to. */
const CANONICAL_BASE = process.env.CANONICAL_BASE || "https://gptthomu-cmd.github.io/testing-e-ortfoilo";

const REDIRECTS = [
  ["nkt-charge-hub", "/ventures/nkt-charge-hub/", "NKT Charge Hub"],
  ["charge-hub", "/ventures/nkt-charge-hub/", "NKT Charge Hub"],
  ["projects", "/work/", "Projects"],
  ["thomu-lab", "/work/thomu-lab/", "THOMU LAB"],
  ["my-ai-os", "/work/my-ai-os/", "My_AI_OS"],
  ["apex-creator-os", "/work/apex-creator-os/", "Apex Creator OS"],
  ["writing", "/blog/", "Writing"],
  ["privacy", "/privacy-policy/", "Privacy Policy"],
];

const template = ({ label, target, base }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${label}</title>
<link rel="canonical" href="${base}${target}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=..${target}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { background:#0a0a0a; color:#e8e4dc; font-family:-apple-system,"Segoe UI",Roboto,sans-serif;
         display:grid; place-items:center; min-height:100vh; margin:0; padding:2rem; }
  .box { max-width:34rem; border:1px solid #1d1d1d; border-radius:14px; padding:1.6rem; background:#101010; }
  .mono { font-family:ui-monospace,Menlo,Consolas,monospace; font-size:.78rem; letter-spacing:.08em;
          text-transform:uppercase; color:#00f0ff; }
  a { color:#7de8ff; }
</style>
</head>
<body>
  <div class="box">
    <p class="mono">Moved permanently</p>
    <h1 style="font-size:1.3rem;margin:.4rem 0 .8rem">This page now lives at ${label}</h1>
    <p>You are being redirected. If nothing happens, continue to
      <a href="..${target}">${base}${target}</a>.</p>
    <p class="mono" style="color:#6f6c67">Alias kept for old links · canonical: ${base}${target}</p>
  </div>
</body>
</html>
`;

for (const [slug, target, label] of REDIRECTS) {
  const dir = join(PUBLIC, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), template({ label, target, base: CANONICAL_BASE }));
  console.log(`  /${slug}/ → ${target}`);
}

writeFileSync(
  join(PUBLIC, "redirects.json"),
  `${JSON.stringify(
    {
      $comment:
        "Alias routes served as static redirect stubs. GitHub Pages cannot issue 301s, so each stub declares a canonical + meta refresh and is noindex. Configure real 301s at the edge from this file when you move to a host that supports them. Update canonicalBase if the domain changes.",
      canonicalBase: CANONICAL_BASE,
      redirects: REDIRECTS.map(([from, to, label]) => ({ from: `/${from}/`, to, label })),
    },
    null,
    2,
  )}\n`,
);

console.log(`\n✓ ${REDIRECTS.length} redirect stubs written to public/`);
