import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

/** Every public HTML entry point. Keys are only build labels; the URLs come
 *  from the folder structure (about/index.html → /about/). */
const pages = {
  home: resolve(root, 'index.html'),
  about: resolve(root, 'about/index.html'),
  nktGroup: resolve(root, 'nkt-group/index.html'),
  nktChargeHub: resolve(root, 'nkt-charge-hub/index.html'),
  thomuLab: resolve(root, 'thomu-lab/index.html'),
  apexCreatorOs: resolve(root, 'apex-creator-os/index.html'),
  myAiOs: resolve(root, 'my-ai-os/index.html'),
  technology: resolve(root, 'technology/index.html'),
  projects: resolve(root, 'projects/index.html'),
  blog: resolve(root, 'blog/index.html'),
  blogPost: resolve(root, 'blog/building-nkt-charge-hub/index.html'),
  lifestyle: resolve(root, 'lifestyle/index.html'),
  contact: resolve(root, 'contact/index.html'),
  privacy: resolve(root, 'privacy/index.html'),
  terms: resolve(root, 'terms/index.html'),
  sitemap: resolve(root, 'sitemap/index.html'),
  notFound: resolve(root, '404.html')
};

const PARTIALS = resolve(root, 'src/partials');

/**
 * A ~40-line HTML include system, so the nav/footer/head chrome is written
 * once and still ships as real, static, indexable HTML. No plugin dependency.
 *
 *   <!-- page:about -->               declares the page slug (top of file)
 *   <!-- include:nav -->              inlines src/partials/nav.html
 *   {{page}}                          → the slug
 *   {{active-if:about}}               → "is-active"  when the slug matches
 *   {{aria-if:about}}                 → 'aria-current="page"' when it matches
 */
function htmlPartials() {
  const cache = new Map();

  const load = (name) => {
    if (!cache.has(name)) {
      cache.set(name, readFileSync(resolve(PARTIALS, `${name}.html`), 'utf8'));
    }
    return cache.get(name);
  };

  return {
    name: 'thomu:html-partials',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const slug = html.match(/<!--\s*page:([a-z0-9-]+)\s*-->/)?.[1] ?? 'home';

        // includes (one level of nesting: partials may include partials)
        for (let pass = 0; pass < 3; pass += 1) {
          html = html.replace(/<!--\s*include:([a-z0-9-]+)\s*-->/g, (m, name) => {
            try {
              return load(name);
            } catch {
              console.warn(`[partials] missing partial: ${name}`);
              return '';
            }
          });
        }

        return html
          .replace(/<!--\s*page:[a-z0-9-]+\s*-->/g, '')
          .replace(/\{\{page\}\}/g, slug)
          .replace(/\{\{active-if:([a-z0-9,-]+)\}\}/g, (m, keys) =>
            keys.split(',').includes(slug) ? 'is-active' : ''
          )
          .replace(/\{\{aria-if:([a-z0-9,-]+)\}\}/g, (m, keys) =>
            keys.split(',').includes(slug) ? 'aria-current="page"' : ''
          )
          // tidy the empty attributes left behind by non-matching tokens
          .replace(/\sclass=""/g, '')
          .replace(/\s+aria-current=""(?=\s)/g, '')
          .replace(/\s+aria-current=""/g, '')
          // an emptied token leaves a double space between attributes
          .replace(/(<[a-z][^<>]*)\s{2,}/g, '$1 ');
      }
    }
  };
}

/**
 * Security headers — with a Content-Security-Policy whose script hashes are
 * computed from the HTML that was actually built.
 *
 * The site is static, so a strict policy is realistic: nothing third-party is
 * in the page, and analytics stay off until you consent. Allowing
 * 'unsafe-inline' for scripts would make the policy decorative, so instead
 * every inline script (the JSON-LD, the two small bootstrap snippets) is
 * hashed at build time. Edit an inline script and the next build writes a new
 * hash; nothing is allowed unless this build produced it.
 *
 * public/_headers carries a `# [security]` marker in each rule; this plugin
 * replaces every marker with the full security block.
 */
function securityHeaders() {
  const walk = (dir) =>
    readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });

  const inlineHashes = (html) => {
    const hashes = new Set();
    for (const match of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      const body = match[1];
      if (!body.trim()) continue; // empty blocks cannot run anything
      hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
    }
    return hashes;
  };

  const csp = (hashes) =>
    [
      "default-src 'self'",
      `script-src 'self'${hashes.map((hash) => ` ${hash}`).join('')} https://www.googletagmanager.com`,
      // inline style="…" on the decorative layers; CSS itself is bundled
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "media-src 'self'",
      "manifest-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests'
    ].join('; ');

  return {
    name: 'thomu:security-headers',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const out = resolve(root, 'dist');
      let headers;
      try {
        headers = readFileSync(resolve(out, '_headers'), 'utf8');
      } catch {
        console.warn('[security] dist/_headers not found — security block not written');
        return;
      }

      const hashes = new Set();
      const pages = walk(out).filter((file) => file.endsWith('.html'));
      for (const file of pages) {
        for (const hash of inlineHashes(readFileSync(file, 'utf8'))) hashes.add(hash);
      }

      const block = [
        'X-Content-Type-Options: nosniff',
        'Referrer-Policy: strict-origin-when-cross-origin',
        'X-Frame-Options: SAMEORIGIN',
        'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
        'Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), xr-spatial-tracking=()',
        'Cross-Origin-Opener-Policy: same-origin',
        'Cross-Origin-Resource-Policy: same-origin',
        `Content-Security-Policy: ${csp([...hashes].sort())}`
      ]
        .map((line) => `  ${line}`)
        .join('\n');

      const rules = (headers.match(/^  # \[security\]$/gm) ?? []).length;
      if (!rules) {
        console.warn('[security] no # [security] marker found in _headers');
        return;
      }

      writeFileSync(resolve(out, '_headers'), headers.replace(/^  # \[security\]$/gm, block));
      console.log(
        `[security] CSP with ${hashes.size} script hash(es) applied to ${rules} header rule(s)`
      );
    }
  };
}

export default defineConfig({
  // Static, dependency-free site — the source tree is the app.
  plugins: [htmlPartials(), securityHeaders()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true,
    rollupOptions: { input: pages }
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
