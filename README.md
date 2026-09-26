# George S. Thomas — portfolio, ventures and project site

A static, SEO-complete personal site for **George S. Thomas (Thomu)** — operator of the
Nedumpurath Group (NKT Group) in Thodupuzha, Kerala — including the venture pages, the
project pages, legal pages, and the full technical-search surface (structured data,
sitemap, robots, Open Graph, analytics with consent, Core Web Vitals discipline).

- **Stack:** Next.js (App Router) with `output: "export"` — pre-rendered HTML, no server runtime
- **Hosting target:** GitHub Pages (`https://gptthomu-cmd.github.io/testing-e-ortfoilo/`)
- **Build output:** `out/` — static files, HTTPS by default on Pages
- **Quality gate:** `npm run seo:check` fails the build if SEO/accessibility invariants break

---

## 1. Quick start

```bash
npm install

npm run dev          # local dev server on http://localhost:3000
npm run typecheck    # TypeScript, no emit
npm run build:pages  # production build with the /testing-e-ortfoilo base path
npm run seo:check    # audit out/ (titles, canonicals, schema, links, sitemap)
npm run preview      # serve out/ locally at http://localhost:4173/testing-e-ortfoilo/

npm run verify       # typecheck + build + seo:check (use before every push)
npm run images:build # regenerate favicons, responsive images and OG cards
```

`npm run build` (without `:pages`) builds for a root domain — use it when the site moves to a
custom domain, and set `NEXT_PUBLIC_SITE_URL` accordingly.

---

## 2. What is implemented

### Identity and assets

| Item | Where | Notes |
| --- | --- | --- |
| Organization logo | `public/images/brand/nkt-group-logo-*.png/svg` | Referenced from `Organization` schema `logo` |
| Profile / identity image | `public/images/profile/george-s-thomas-*.{avif,webp,jpg}` | 320/480/960px responsive variants; **placeholder — replace with a real portrait** |
| Favicon | `public/favicon.ico`, `apple-touch-icon.png`, `public/icons/maskable-512.png` | Multi-size ICO + PWA icons |
| Web app manifest | `public/site.webmanifest` | Relative paths so it survives any base path |
| Author information | `src/components/AuthorCard.tsx`, `/about/` | Visible author block on every article and project page |
| Local / business information | `/ventures/`, `/ventures/*` | Locality, district, area served, opening information — unknown fields render as "To be confirmed" rather than being invented |

### Search infrastructure

| Requirement | Implementation |
| --- | --- |
| Google Search Console verification | Meta tag injected from `NEXT_PUBLIC_GSC_VERIFICATION` (`src/app/layout.tsx`); fallback URL-prefix file at `/privacy.html` |
| XML sitemap | `/sitemap.xml` — generated from `src/lib/routes.ts`, canonical URLs + `lastmod` |
| Robots.txt | `/robots.txt` — permissive, advertises sitemap; root-site copy in `deploy/root/` |
| Canonical URLs | Self-referencing canonical on every page, built from the same value used by OG, schema `@id` and the sitemap |
| Person / ProfilePage schema | `/about/` (`ProfilePage` + `Person` with `knowsAbout`, `sameAs`, `worksFor`, `address`) |
| Organization schema | Site-wide graph (`Organization` + `LocalBusiness`) for NKT Group, with `subOrganization` for each venture |
| Breadcrumb schema | `BreadcrumbList` on every page except home, mirroring the visible trail |
| WebSite schema | Site-wide graph, `publisher` → Organization, `about` → Person |
| WebPage schema | Every page, typed (`WebPage`, `ProfilePage`, `CollectionPage`, `ContactPage`, `FAQPage`) |
| Article / BlogPosting schema | Every article: author, publisher, `datePublished`, `dateModified`, `wordCount`, `articleSection` |
| Image metadata + optimisation | AVIF/WebP/fallback variants, explicit width/height, alt text on every image, `Picture` component |
| Open Graph + social metadata | Per-page OG/Twitter cards (19 generated 1200×630 cards), `og:image:alt`, `summary_large_image` |
| Google Analytics | GA4 with Consent Mode v2, **loaded only after consent**, IP anonymisation, advertising features off |
| Core Web Vitals | Static HTML, system fonts, CSS-only nav, explicit image dimensions, tiny client bundle; `web_vitals` GA4 events + targets documented |
| Mobile-first responsive design | Mobile-first CSS with `clamp()` type scale; verified layout at 320 → 1440px |
| HTTPS / SSL | Enforced by GitHub Pages (`Enforce HTTPS`); no mixed content anywhere |
| Fast page loading | Pre-rendered HTML, hashed assets with immutable caching, no webfont round trip, no chart/UI libraries |
| Clean SEO URLs | Trailing-slash directory URLs, lowercase, hyphenated, stable |
| Unique titles + descriptions | Enforced by `npm run seo:check` (build fails on duplicates) |
| H1/H2/H3 structure | Exactly one H1 per page, ordered headings, enforced by the checker |
| Internal linking | Footer hub, inline contextual links, TOC, related posts, site index on the 404 page |
| 404 + redirects | `src/app/not-found.tsx` → `out/404.html`; 8 alias redirect stubs with canonical + noindex (`public/redirects.json`) |
| `sameAs` social profiles | `SOCIALS` in `src/lib/site.ts` → Person/Organization `sameAs` + footer rel="me" links |

### Structured-data entities

- **Person** — George S. Thomas (`#person`), with `alternateName`, `jobTitle`, `knowsAbout`, `worksFor`, `homeLocation`, `sameAs`
- **ProfilePage** — `/about/`
- **Organization / LocalBusiness** — NKT Group (`#organization`), founding date, founder, address, `areaServed`, `subOrganization`
- **LocalBusiness / AutomotiveBusiness** — NKT Charge Hub (`#chargingstation`) with `Offer` → `Service`, amenities, opening hours
- **FAQPage** — charging FAQs and the monitoring playbook FAQs
- **SoftwareApplication / Project** — THOMU LAB, Apex Creator OS, My_AI_OS
- **Blog + BlogPosting** — `/blog/` and each article
- **ItemList, BreadcrumbList, WebSite, WebPage, ImageObject, PostalAddress, GeoCoordinates**

---

## 3. Fill these in before launch

Everything below is deliberately empty or marked `TODO_FILL` so that a placeholder can never be
presented as a fact. `src/lib/site.ts` is the single source of truth — edit it once and the
change propagates to metadata, schema, sitemap and the footer.

| Field | Notes |
| --- | --- |
| `PERSON.email`, `ORGANIZATION.email` | Real, monitored inboxes. Left empty on purpose — the contact page falls back to LinkedIn until they exist |
| `VERIFICATION.google` | Search Console verification token (or set `NEXT_PUBLIC_GSC_VERIFICATION`) |
| `ANALYTICS.measurementId` | GA4 ID (or set `NEXT_PUBLIC_GA_MEASUREMENT_ID`) |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | Only if the site moves to a custom domain |
| `SOCIALS` | Add the YouTube channel (and X/Twitter) URLs — they feed `sameAs` |
| `PERSON.address.postalCode`, `ORGANIZATION.address` | Confirm the PIN and any street address you are willing to publish |
| `CHARGE_HUB.*` | Confirm bays, connectors, tariff, hours, payment methods, map link |
| `assets/masters/profile-identity.png` | Replace the generated identity card with a real photograph |

Run `npm run seo:check` after editing: it warns if placeholder text (`TODO_FILL`, `G-XXXXXXXXXX`)
still reaches the built HTML.

---

## 4. Project structure

```
assets/
  images.json          source spec for the image pipeline
  og-cards.json        one social card per page
  masters/             generated or hand-supplied master artwork
  README.md            how to replace artwork and regenerate
deploy/root/           ready-to-publish robots.txt + sitemap.xml for a root/user site
docs/
  DEPLOYMENT.md        GitHub Pages setup, custom domain, redirects, HTTPS
  SearchConsole.md     verification, sitemap submission, monitoring workflow
public/                favicon, icons, generated images, redirect stubs, .nojekyll
scripts/
  generate-images.mjs  builds all raster assets (ImageMagick required)
  check-seo.mjs        the SEO/quality gate
  serve-static.mjs     local preview server for out/
  gsc-report.mjs       optional: pull performance/coverage summaries via the GSC API
src/
  app/                 routes (pages, sitemap, robots, feed)
  components/          presentational + interactive components
  content/             projects, articles, legal documents (typed content)
  lib/                 site config, schema builders, SEO helpers, route registry
```

---

## 5. Content edits

- **New article:** add an object to `ARTICLES` in `src/content/articles.ts` (unique `title`,
  `description`, real `date`, H2s with `id` attributes). The sitemap, feed, blog index and
  structured data all pick it up automatically — then re-run `npm run seo:check`.
- **New project:** add to `PROJECTS` in `src/content/projects.ts`. Route, sitemap entry, project
  cards and `SoftwareApplication`/`Project` schema follow from the same object.
- **New page:** create `src/app/<path>/page.tsx`, use `buildMetadata()` from `src/lib/seo.ts`,
  emit a per-page `JsonLd` graph, and add the route to `src/lib/routes.ts` so it lands in the
  sitemap. The checker will fail if you forget the canonical, the H1 or the sitemap entry.
- **Redirect an old URL:** add an entry to the `REDIRECTS` map in `scripts/make-redirects.mjs`
  style list (or copy an existing stub in `public/`) and register it in `public/redirects.json`.

---

## 6. Verification checklist

```bash
npm run verify
```

Then, in production:

1. Confirm `https://<domain>/sitemap.xml` and `/robots.txt` return 200.
2. Submit the sitemap in Search Console and inspect 2–3 URLs (see `docs/SearchConsole.md`).
3. Run Lighthouse on `/`, `/ventures/nkt-charge-hub/` and one article — expect ≥95 on
   Performance, Accessibility, Best Practices and SEO.
4. Validate structured data with the [Rich Results Test](https://search.google.com/test/rich-results).
5. Check the social card previews with the Facebook Sharing Debugger / X Card Validator.

---

## 7. Licence and ownership

Content and brand assets © George S. Thomas. Third-party names (IonGrid, DaVinci Resolve,
Premiere Pro, Sony, Raspberry Pi, Google) belong to their respective owners and are used for
identification only — see `/terms/` for the full disclaimer.
