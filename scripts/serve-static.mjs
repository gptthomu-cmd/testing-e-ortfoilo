#!/usr/bin/env node
/**
 * Local preview server for the static export.
 *
 *   npm run build:pages && npm run preview
 *
 * Mimics GitHub Pages closely enough to be useful:
 *   • serves directory-style URLs (/about/ → about/index.html)
 *   • strips the base path so /testing-e-ortfoilo/about/ works locally
 *   • serves 404.html for unknown paths, with a real 404 status
 *   • correct MIME types for .xml, .txt, .webmanifest, images
 *   • long cache headers for /_next/static (hashed assets)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, process.env.OUT_DIR || "out");
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
if (!existsSync(OUT)) {
  console.error(`✖ No build found at ${OUT}. Run "npm run build:pages" first.`);
  process.exit(1);
}

/**
 * Base path detection: explicit env/flag wins, otherwise it is read from the
 * build itself (the first /_next/ asset URL), so a prefixed export can be
 * previewed without repeating the environment variable.
 */
function detectBase() {
  const explicit = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (explicit) return explicit.replace(/\/+$/, "");
  try {
    const html = readFileSync(join(OUT, "index.html"), "utf8");
    const match = html.match(/href="(\/[^"]*?)\/_next\//);
    return match ? match[1].replace(/\/+$/, "") : "";
  } catch {
    return "";
  }
}

const BASE = detectBase();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function tryFiles(paths) {
  for (const path of paths) {
    try {
      const stats = await stat(path);
      if (stats.isFile()) return path;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname);

  // Strip the deployment prefix so the same build works at the root locally.
  if (BASE && pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length) || "/";
  if (pathname.includes("..")) {
    res.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = pathname.replace(/^\//, "");
  const candidates = [
    join(OUT, relativePath),
    join(OUT, relativePath, "index.html"),
    join(OUT, `${relativePath}.html`),
  ];

  const file = await tryFiles(candidates);

  if (!file) {
    const notFound = join(OUT, "404.html");
    const body = existsSync(notFound) ? await readFile(notFound) : "404 Not Found";
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(body);
    console.log(`404 ${pathname}`);
    return;
  }

  const ext = extname(file);
  const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
  headers["Cache-Control"] = file.includes(`${sep}_next${sep}`)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=60";

  res.writeHead(200, headers);
  res.end(await readFile(file));
  if (process.env.QUIET !== "1") console.log(`200 ${pathname} → ${file.replace(root, ".")}`);
});

const sep = "/";

server.listen(PORT, HOST, () => {
  console.log(`\n  Static preview running on http://${HOST}:${PORT}${BASE}/\n  Serving: ${OUT}\n`);
});
