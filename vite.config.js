import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * SITE_BASE  — path prefix. '/' for a custom domain or user site,
 *              '/<repo-name>/' for a GitHub Pages project site.
 * SITE_URL   — absolute origin used in canonical tags, Open Graph, JSON-LD,
 *              sitemap.xml and robots.txt.
 *
 * Both default to the production values below, so a plain `npm run build`
 * works with no environment set.
 */
const BASE = process.env.SITE_BASE || '/';
const SITE_URL = (process.env.SITE_URL || 'https://georgesthomas.com').replace(/\/+$/, '');

const PLACEHOLDER = 'https://georgesthomas.com';

/** Rewrites the placeholder origin in the HTML head and in the JSON-LD graph. */
function siteUrlPlugin() {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return SITE_URL === PLACEHOLDER ? html : html.split(PLACEHOLDER).join(SITE_URL);
    },
    closeBundle() {
      if (SITE_URL === PLACEHOLDER) return;
      // public/ files are copied verbatim, so rewrite them after the bundle closes.
      for (const file of ['sitemap.xml', 'robots.txt']) {
        const path = resolve('dist', file);
        if (!existsSync(path)) continue;
        writeFileSync(path, readFileSync(path, 'utf8').split(PLACEHOLDER).join(SITE_URL));
      }
    }
  };
}

export default defineConfig({
  base: BASE,
  plugins: [siteUrlPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allows the proxied preview host (e.g. *.e2b.app) to load the dev server
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true
  }
});
