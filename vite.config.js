import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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
  lifestyle: resolve(root, 'lifestyle/index.html'),
  contact: resolve(root, 'contact/index.html'),
  privacy: resolve(root, 'privacy/index.html'),
  terms: resolve(root, 'terms/index.html'),
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
          .replace(/\{\{active-if:([a-z0-9-]+)\}\}/g, (m, key) => (key === slug ? 'is-active' : ''))
          .replace(/\{\{aria-if:([a-z0-9-]+)\}\}/g, (m, key) =>
            key === slug ? 'aria-current="page"' : ''
          )
          // tidy the empty attributes left behind by non-matching tokens
          .replace(/\sclass=""/g, '')
          .replace(/\saria-current=""(?=\s|>)/g, '');
      }
    }
  };
}

export default defineConfig({
  // Static, dependency-free site — the source tree is the app.
  plugins: [htmlPartials()],
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
