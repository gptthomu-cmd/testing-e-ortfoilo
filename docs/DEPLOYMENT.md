# Deployment: GitHub Pages

The site is a static export (`output: "export"`), so deployment is "copy `out/` somewhere that
serves files over HTTPS". GitHub Pages does exactly that, for free, with automatic SSL.

---

## 1. Why the base path exists

`https://gptthomu-cmd.github.io/testing-e-ortfoilo/` is a **project** site: every URL lives
under `/testing-e-ortfoilo`. That prefix is injected at build time:

```bash
npm run build:pages      # NEXT_PUBLIC_BASE_PATH=/testing-e-ortfoilo next build
```

`npm run build` (no prefix) is the custom-domain build. Nothing else changes between the two.

---

## 2. Deploy with GitHub Actions (recommended)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. One-time setup:

1. Repository → **Settings → Pages** → **Source: GitHub Actions**.

   This one step has to be done in the browser by someone with admin rights on the repository.
   It cannot be automated: creating a Pages site for the first time requires repository admin
   permission, and neither the workflow's `GITHUB_TOKEN` nor an app installation token has it
   (`POST /repos/{owner}/{repo}/pages` returns *403 Resource not accessible by integration*).

2. Push to `main`. The workflow runs `npm ci`, type-checks, builds with the base path, runs the
   SEO gate, verifies the export, then uploads `out/` as the Pages artefact and deploys it.

   If Pages is not enabled yet, the build and verification still run and pass, and the deploy is
   **skipped with a warning** rather than failing — the run tells you exactly what to switch on.
3. Check **Settings → Pages** for the published URL, then tick **Enforce HTTPS**.

The workflow runs `npm run seo:check` before deploying, so a page with a missing canonical, a
duplicate title, a broken internal link, a missing image or invalid structured data **cannot**
reach production.

### Why CI does not regenerate images

`npm run images:build` needs ImageMagick, which **is no longer installed on the `ubuntu-latest`
runner image** — it was present on Ubuntu 22.04 but was dropped from 24.04. The deploy workflow
therefore does not run it, for a second reason as well: the assets in `public/` are committed, and
those are the exact files reviewed in a pull request. Regenerating them during deploy could ship
brand artwork nobody looked at, and output can vary between ImageMagick builds.

So the rule is: change artwork locally, run `npm run images:build`, commit the result. The
workflow still guards the outcome — the SEO gate fails if any page references an image that is
missing from the export, and the completeness step checks the favicons, brand marks, profile
image and OG cards are all present.

---

## 3. Deploy manually (no Actions)

```bash
npm run verify                      # typecheck + build + SEO gate
npx gh-pages -d out --dotfiles      # publishes out/ to the gh-pages branch
```

Or copy `out/` into a branch that Pages serves:

```bash
npm run build:pages
cd out && touch .nojekyll
git add -A && git commit -m "build" && git push origin HEAD:gh-pages --force
```

Two files matter when publishing by hand:

- **`.nojekyll`** — without it, Jekyll ignores directories beginning with `_`, and every
  `_next/` asset 404s. The build already includes it (generated into `public/`).
- **`404.html`** — GitHub Pages serves this automatically for unknown paths. Next generates it
  from `src/app/not-found.tsx`, so the 404 page is real HTML with the full site index, not a
  bare error string.

---

## 4. Custom domain (recommended, later)

A custom domain removes the path prefix *and* fixes the `robots.txt` limitation.

1. Add a `CNAME` DNS record: `www` → `gptthomu-cmd.github.io` (and an `A`/`ALIAS` for the apex).
2. Put the domain in `public/CNAME` (one line, no protocol) so each deploy keeps it, **or** set
   it in **Settings → Pages → Custom domain**.
3. Build without the base path and with the new origin:

   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
   ```

   Or edit the defaults in `src/lib/site.ts` so it is permanent.
4. Re-verify the property in Search Console, resubmit the sitemap, and update the canonical base
   in `public/redirects.json`.
5. Keep `Enforce HTTPS` on. The site has no mixed content, so nothing should break.

After the move, old prefixed URLs (`…/testing-e-ortfoilo/about/`) can be redirected with the
same stub pattern used in `public/`.

---

## 5. Root-level `robots.txt` and `sitemap.xml`

Crawlers only read `robots.txt` from the origin root. For a project site that path does not
exist, so the build ships a copy you can publish from a user-site repository
(`gptthomu-cmd.github.io`):

```
deploy/root/robots.txt     # allows crawling, points at the project sitemap
deploy/root/sitemap.xml    # optional root index of the project's sitemap
```

Publish them by creating a `gptthomu-cmd.github.io` repository containing those files at its
root. Alternatively, host the site at a custom domain, where `/robots.txt` is served by the
site itself.

---

## 6. Redirects: what is possible on static hosting

GitHub Pages cannot issue HTTP 301s. This build therefore uses the standard static pattern:

- `public/<alias>/index.html` — canonical link to the destination, `<meta http-equiv="refresh">`,
  and `<meta name="robots" content="noindex, follow">`
- `public/redirects.json` — the manifest of aliases, documented and machine-readable

Current aliases: `/nkt-charge-hub/`, `/charge-hub/`, `/projects/`, `/thomu-lab/`, `/my-ai-os/`,
`/apex-creator-os/`, `/writing/`, `/privacy/`.

Because a meta refresh is technically not a permanent redirect, search engines treat these as
soft redirects — which is why each stub also declares a canonical and is excluded from the
sitemap. If you later front the site with Cloudflare, Netlify or Vercel, replace the stubs with
real 301s generated from `public/redirects.json`; the file exists precisely so the mapping
lives in one place.

---

## 7. Caching and performance

- `/_next/static/*` is content-hashed and safe to cache forever.
- HTML is regenerated on each deploy; GitHub Pages' default caching is fine for a site this size.
- To add long-lived headers on another host, mirror the policies in `scripts/serve-static.mjs`.

---

## 8. Post-deploy checklist

```bash
npm run verify
```

1. `https://<origin>/<base>/robots.txt` → 200, contains the `Sitemap:` line.
2. `https://<origin>/<base>/sitemap.xml` → 200, 19 `<loc>` entries.
3. `https://<origin>/<base>/feed.xml` → valid RSS.
4. A deliberately wrong URL returns the custom 404 page with a real 404 status.
5. `curl -I` one HTML page and one image: both 200, served over HTTPS, correct content types.
6. Search Console: submit the sitemap, inspect two or three URLs (see `docs/SearchConsole.md`).
7. Social preview check on one article URL.
