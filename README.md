# George S. Thomas — Digital Headquarters

The personal-business website of **George S. Thomas** (Thomu) — entrepreneur, business owner and
technology builder. It presents the NKT Group business ecosystem alongside the technology systems
being built around it: THOMU LAB, Apex Creator OS and My_AI_OS.

Built as a static multi-page site: no framework, no runtime dependencies, no third-party requests.

---

## Quick start

```bash
npm install       # one dev dependency (Vite)
npm run dev       # http://localhost:5173  (all pages, e.g. /about/)
npm run build     # → dist/  (deploy this folder anywhere static)
npm run preview   # serve the production build locally
```

Node 18+ required. The build output (`dist/`) is a plain folder of files — it can be dropped on
Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any web server.

---

## Pages

Every page is a real, static, indexable HTML file at a clean URL:

| URL | Page | Purpose |
| --- | --- | --- |
| `/` | Home | The one-page headquarters: identity, business, lab, EV, wealth, technology, lifestyle, vision, contact |
| `/about/` | About | Biography, identity graph, public/private boundary, interests |
| `/nkt-group/` | NKT Group | The business ecosystem: Charge Hub, Nedumpurath Towers, NKT Vessels House |
| `/nkt-charge-hub/` | NKT Charge Hub | EV charging: location, confirmed specification, operations, FAQ |
| `/thomu-lab/` | THOMU LAB | Twelve R&D domains, private infrastructure, lab method |
| `/apex-creator-os/` | Apex Creator OS | Personal/family/business finance OS — architecture, status, limits |
| `/my-ai-os/` | My_AI_OS | Seven-layer intelligence architecture, design rules, privacy stance |
| `/technology/` | Technology | The stack, plus gaming, 3D printing and photography/creative |
| `/projects/` | Projects | Five entries with real statuses + the open-source index |
| `/lifestyle/` | THOMU MODE | Wealth systems and the future stack — every line labelled |
| `/contact/` | Contact | Contact card, what to write about, what never to send |
| `/privacy/`·`/terms/` | Legal | Plain-language privacy policy and terms of use |
| `/404.html` | Not found | Served for unknown URLs by the host |

---

## What is in here

```
index.html                  homepage: semantic markup, SEO meta, JSON-LD
about/  nkt-group/  nkt-charge-hub/  thomu-lab/  apex-creator-os/
my-ai-os/  technology/  projects/  lifestyle/  contact/  privacy/  terms/
                            one index.html per page (folder = clean URL)
404.html                    not-found page
vite.config.js              MPA entry points + the HTML partials plugin
src/
  partials/                 shared chrome, inlined at build & dev time
    head.html               meta, icons, self-hosted font preloads, stylesheet
    top.html                skip link + ambient background field
    nav.html                sticky nav + full-screen overlay menu
    footer.html             footer columns, contact, motion toggle, script tag
  main.js                   entry point — boots each feature module
  styles/
    main.css                imports the sheets below
    fonts.css               self-hosted @font-face declarations
    tokens.css              design tokens (colour, type scale, spacing) + reset
    components.css          buttons, chips, status pills, panels, reveal
    sections.css            homepage section layout
    pages.css               sub-page chrome: breadcrumbs, headers, cards, specs, prose
    motion.css              responsive breakpoints, reduced motion, a11y fallbacks
  lib/
    nav.js                  sticky nav, scroll progress, overlay menu, scroll-spy
    reveal.js               IntersectionObserver scroll reveals
    magnetic.js             magnetic hover on primary buttons (desktop only)
    heroMesh.js             ambient canvas node-network in the hero
    eco.js                  NKT ecosystem diagram (home + /nkt-group/)
    flow.js                 My_AI_OS architecture accordion (home + /my-ai-os/)
    map.js                  "The Long Game" vision map (home)
    projects.js             open-source project index (home + /projects/)
    interactions.js         pointer spotlight on cards
  data/
    content.js              all structured copy (ecosystem, AI layers, vision)
public/
  fonts/                    Sora, Inter, JetBrains Mono (woff2, latin)
  img/                      hero, EV, homelab, gaming, 3D printing, photography + OG cover
  favicon.svg, apple-touch-icon.png, icon-192/512.png, site.webmanifest
  robots.txt, sitemap.xml, llms.txt
  _headers                  caching + security headers (Netlify/Cloudflare)
  _redirects                301s and the 404 route (Netlify/Cloudflare)
docs/CONTENT.md             how to update copy, statuses, projects and pages
docs/SEARCH-CONSOLE.md      verification, indexing, monitoring playbook
```

### The partials system (no plugin dependency)

Shared chrome lives once in `src/partials/` and is inlined by a ~40-line Vite plugin in
`vite.config.js`, so every page still ships as complete static HTML:

```html
<!-- page:about -->          <!-- declares the slug (top of <head>) -->
<!-- include:head -->        <!-- inlines src/partials/head.html -->
<!-- include:top -->
<!-- include:nav -->
<!-- include:footer -->      <!-- also emits the module script tag -->
```

Tokens available inside partials:

| Token | Becomes |
| --- | --- |
| `{{page}}` | the page slug (`about`, `nkt-group`, …) |
| `{{active-if:about}}` | `is-active` when the slug matches (nav highlighting) |
| `{{aria-if:about}}` | `aria-current="page"` when the slug matches |

`body[data-page="…"]` is what switches the nav between in-page section anchors (homepage) and site
navigation (everywhere else).

### Adding a page

1. Create `my-page/index.html` starting from an existing page, with `<!-- page:my-page -->` in `<head>`.
2. Register it in `pages` in `vite.config.js`.
3. Add its URL to `public/sitemap.xml`, link it from the footer (`src/partials/footer.html`), the
   overlay menu (`src/partials/nav.html`) and `public/llms.txt`.
4. Give it a unique title, meta description, canonical URL, OG/Twitter tags and a JSON-LD
   `@graph` containing at minimum `WebPage` + `BreadcrumbList`.

---

## Design intent

- **Obsidian surfaces, electric cyan/teal accents, gold for legacy.** Premium and understated —
  a founder's command centre, not a template portfolio or a crypto landing page.
- **Status honesty is a feature.** Every system carries a label and the site itself explains them
  ("How to read this site" on the homepage and /about/):

  | Label | Meaning |
  | --- | --- |
  | `Current` | In operation today |
  | `Active` | Being worked on now |
  | `Experimental` | Being tested in the lab |
  | `Planned` | Scoped, not started |
  | `Vision` | Long-term ambition |

  The lifestyle pages add two more: `Wishlist` (wanted, not owned) and `Future` (a direction, not a
  purchase). `/technology/` uses the same pills to distinguish *in use* from *exploring*.

  Nothing planned or experimental is presented as finished or operational.

- **No fabricated numbers.** No revenue, net worth, returns, testimonials, clients or awards.
  The only factual specifics published are the ones supplied: location, role, family enterprise
  operating since 1947, the NKT Charge Hub specification (90 kW DC, dual-gun CCS2, OCPP-compatible,
  operational since March 2026), the public email, and the two social profiles.
- **A strict two-layer model.** Public layer: identity, business, projects, selected interests,
  social links, public contact, selected lifestyle/future vision. Private layer: financials, bank
  information, family details, private addresses, credentials, documents, private infrastructure,
  sensitive business information. The private layer is never published — see `/about/`.

### Two deliberate editorial decisions

- **`thomudidnot`** is published as part of the identity (About page, JSON-LD `alternateName`,
  `llms.txt`) because the owner supplied it. It is described as an online handle, not as a verified
  account on any platform, and it is not added to `sameAs` until a profile can be checked.
- **The family note** ("George S. Thomas is the nephew of Mathew Kuzhalnadan") appears as text on
  the homepage and `/about/`, with an explicit disclaimer that it implies no political affiliation,
  endorsement, partnership or shared venture. It is deliberately **not** added to the JSON-LD
  `Person` node: structured data is where search engines build entity associations, and this
  relationship should stay a biographical sentence rather than become a machine-readable
  association.

---

## Performance notes

- Fonts are self-hosted `woff2`, `font-display: swap`, and preloaded — no Google Fonts request.
- Images ship in WebP with JPEG fallback via `<picture>`, with explicit `width`/`height`, and are
  lazy-loaded below the fold (the hero image is preloaded instead).
- JavaScript is a handful of small ES modules (≈7 kB gzipped). Features are additive: every page is
  fully readable and navigable with JS disabled.
- The hero canvas animation is capped at ~32 fps, pauses when off-screen or when the tab is
  hidden, and renders a single static frame for reduced-motion users.
- No analytics, tag manager, pixels, cookies or third-party requests of any kind.

## Accessibility

- Skip link, landmark structure, visible focus rings, `aria-expanded` / `aria-pressed` /
  `aria-current` states.
- Full keyboard operation for the ecosystem diagram, AI architecture accordion, vision map,
  filter buttons and navigation overlay (`Esc` closes it).
- `prefers-reduced-motion` is respected automatically, with an additional in-page
  **Reduce motion** toggle in the footer that remembers the choice in `localStorage`.
- Text colours were chosen to clear WCAG AA for body copy on the obsidian background.

## SEO & discoverability

**On-page, every page:** unique title, meta description, canonical URL, Open Graph + Twitter cards,
one `<h1>`, semantic section landmarks, descriptive alt text, and breadcrumbs with matching
`BreadcrumbList` structured data.

**Structured data** (JSON-LD, per page, all sharing the same `@id` graph so the entities connect):

| Node | Where |
| --- | --- |
| `Person` (with `sameAs` LinkedIn + Instagram, `email`, `alternateName` incl. `thomudidnot`) | Home, /about/, /technology/, /contact/, /nkt-group/ |
| `Organization` — NKT Group (`subOrganization` links) | Home, /nkt-group/ |
| `LocalBusiness` — NKT Charge Hub (address, `areaServed`, `additionalType`) | Home, /nkt-charge-hub/ |
| `Organization` — THOMU LAB | Home, /thomu-lab/ |
| `SoftwareApplication` — Apex Creator OS (`featureList`) | Home, /apex-creator-os/ |
| `SoftwareApplication` — My_AI_OS | Home, /my-ai-os/ |
| `WebSite` / `WebPage` / `CollectionPage` / `ContactPage` / `ImageObject` | throughout |
| `FAQPage` | Home, /nkt-charge-hub/ |
| `BreadcrumbList` | every sub-page |

`LocalBusiness` is used rather than `ElectricVehicleChargingStation` because the latter is still
only a schema.org proposal and not a valid type.

**Entity strategy:** internal links and structured data connect
George S. Thomas → NKT Group → NKT Charge Hub, and George S. Thomas → THOMU LAB → Apex Creator OS /
My_AI_OS. Nothing unrelated is associated.

**For AI assistants:** `public/llms.txt` is a plain-text summary of who George is, what operates
today, what is planned, the status vocabulary and every page URL — linked from `<head>` as an
alternate.

**Crawling:** `robots.txt` allows everything public and points at `sitemap.xml`, which lists all
fourteen indexable URLs (images included) — `404.html` is intentionally excluded and `noindex`.

**Verification, analytics and monitoring:** `docs/SEARCH-CONSOLE.md` is the full playbook —
how to verify the property, submit the sitemap, request indexing, read index-coverage and
Core Web Vitals reports, and the monitoring cadence. Two placeholders live in
`src/partials/head.html`:

| Placeholder | Purpose | Default |
| --- | --- | --- |
| `google-site-verification` (commented) | Search Console verification, shared by every page | not set |
| `window.GA_MEASUREMENT_ID` | GA4, loaded **only after the visitor accepts** | `G-XXXXXXXXXX` = off |

With the placeholder left as-is the site makes **zero** third-party requests. Set a real
Measurement ID and `src/lib/analytics.js` shows a small accept/decline card, starts Google
Consent Mode v2 in the denied state, and only loads the tag after an opt-in (remembered in
`localStorage`).

### Before going live

1. Replace the placeholder domain `https://georgesthomas.com` with the real domain in:
   every `index.html` (canonical, OG/Twitter URLs, JSON-LD `@id`s and URLs), `404.html`,
   `public/robots.txt` and `public/sitemap.xml`.
2. Configure the host to serve `404.html` for unknown URLs (Netlify/Vercel/Cloudflare do this
   automatically; GitHub Pages does it for the repo root).
3. Serve clean URLs: keep the folder structure (`/about/index.html` → `/about/`) and let the host
   handle the trailing slash. If you switch a page to `/about.html`, add a 301 redirect from
   `/about/` and update the sitemap.
4. Enable HTTPS and HSTS at the host — header rules are provided in `public/_headers`
   (Netlify/Cloudflare read it directly; copy the rules into nginx/Apache elsewhere). It also
   sets immutable caching for hashed assets, which is the single biggest Core Web Vitals win.
5. Add the Search Console verification tag (`src/partials/head.html`) and, if you want
   analytics, the GA4 Measurement ID. Then follow `docs/SEARCH-CONSOLE.md`: submit the sitemap,
   request indexing for the 13 indexable URLs, and check the structured-data report.
6. Verify the OG card in a social preview debugger.

---

© George S. Thomas · NKT Group. All rights reserved.
