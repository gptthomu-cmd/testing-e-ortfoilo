# George S. Thomas — Digital Headquarters

The personal-business website of **George S. Thomas** (Thomu) — entrepreneur, business owner and
technology builder. It presents the NKT Group business ecosystem alongside the technology systems
being built around it: THOMU LAB, Apex Creator OS and My_AI_OS.

Built as a static site: no framework, no runtime dependencies, no third-party requests.

---

## Quick start

```bash
npm install       # one dev dependency (Vite)
npm run dev       # http://localhost:5173
npm run build     # → dist/  (deploy this folder anywhere static)
npm run preview   # serve the production build locally
```

Node 18+ required. The build output (`dist/`) is a plain folder of files — it can be dropped on
Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any web server.

---

## What is in here

```
index.html                  the whole page: semantic markup, SEO meta, JSON-LD
src/
  main.js                   entry point — boots each feature module
  styles/
    main.css                imports the four sheets below
    fonts.css               self-hosted @font-face declarations
    tokens.css              design tokens (colour, type scale, spacing) + reset
    components.css          buttons, chips, status pills, panels, reveal
    sections.css            layout + styling for every section
    motion.css              responsive breakpoints, reduced motion, a11y fallbacks
  lib/
    nav.js                  sticky nav, scroll progress, overlay menu, scroll-spy
    reveal.js               IntersectionObserver scroll reveals
    magnetic.js             magnetic hover on primary buttons (desktop only)
    heroMesh.js             ambient canvas node-network in the hero
    eco.js                  NKT ecosystem diagram
    flow.js                 My_AI_OS architecture accordion
    map.js                  "The Long Game" vision map
    projects.js             open-source project index (empty by default)
    interactions.js         pointer spotlight on cards
  data/
    content.js              all structured copy (ecosystem, AI layers, vision)
public/
  fonts/                    Sora, Inter, JetBrains Mono (woff2, latin)
  img/                      hero, EV, homelab visuals + OG cover
  favicon.svg, apple-touch-icon.png, icon-512.png, site.webmanifest
  robots.txt, sitemap.xml
docs/CONTENT.md             how to update copy, statuses and projects
```

---

## Design intent

- **Obsidian surfaces, electric cyan/teal accents, gold for legacy.** Premium and understated —
  a founder's command centre, not a template portfolio or a crypto landing page.
- **Status honesty is a feature.** Every system carries one of five labels and the site itself
  explains them in the "How to read this site" panel:

  | Label | Meaning |
  | --- | --- |
  | `Current` | In operation today |
  | `Active` | Being worked on now |
  | `Experimental` | Being tested in the lab |
  | `Planned` | Scoped, not started |
  | `Vision` | Long-term ambition |

  Nothing planned or experimental is presented as finished or operational.

- **No fabricated numbers.** No revenue, net worth, returns, testimonials, clients or awards.
  The only factual specifics on the page are the ones supplied (location, role, family heritage
  since 1947, EV charging specification, Instagram handle).

  The heritage detail and the NKT Group brand mark were carried over from the parallel Next.js
  build that previously lived on `main`, so the earlier research was not lost. Two facts that build
  states but this one does not: a technology/network partner for NKT Charge Hub, and a specific bay
  count. They are omitted here pending confirmation — add them to the NKT and EV sections when
  verified.

---

## Performance notes

- Fonts are self-hosted `woff2`, `font-display: swap`, and preloaded — no Google Fonts request.
- Images ship in WebP with JPEG fallback via `<picture>`, with explicit `width`/`height`.
- JavaScript is a handful of small ES modules (≈7 kB gzipped in the production build).
  Features are additive: the page is fully readable with JS disabled.
- The hero canvas animation is capped at ~32 fps, pauses when off-screen or when the tab is
  hidden, and renders a single static frame for reduced-motion users.

## Accessibility

- Skip link, landmark structure, visible focus rings, `aria-expanded` / `aria-pressed` states.
- Full keyboard operation for the ecosystem diagram, AI architecture accordion, vision map,
  filter buttons and navigation overlay (`Esc` closes it).
- `prefers-reduced-motion` is respected automatically, with an additional in-page
  **Reduce motion** toggle in the footer that remembers the choice in `localStorage`.
- Text colours were chosen to clear WCAG AA for body copy on the obsidian background.

## SEO & discoverability

**On-page:** title, meta description, meta keywords, geo meta (`IN-KL` / Thodupuzha),
Open Graph + Twitter cards, canonical URL, generated 1200×630 social cover, `sitemap.xml`
(with image extension) and `robots.txt`.

**Structured data** (`index.html`, a single JSON-LD `@graph`):

| Node | Purpose |
| --- | --- |
| `Person` | George S. Thomas — alternate names `Thomu` / `George Thomas`, role, location, occupations, `knowsAbout` |
| `Organization` | NKT Group, with `subOrganization` links |
| `LocalBusiness` | NKT Charge Hub — street address, `areaServed`, `additionalType` for EV charging |
| `Organization` | THOMU LAB |
| `SoftwareApplication` | Apex Creator OS (planned) |
| `SoftwareApplication` | My_AI_OS (experimental) |
| `WebSite` | Site entity, publisher and `about` |
| `FAQPage` | Six definitional questions (who is George, what is NKT Group, what is NKT Charge Hub, THOMU LAB, the two OS projects, location) |

`LocalBusiness` is used rather than `ElectricVehicleChargingStation` because the latter is still only
a schema.org proposal and not a valid type.

**For AI assistants:** `public/llms.txt` is a plain-text summary of who George is, what operates
today, what is planned, and the status vocabulary — linked from `<head>` as an alternate. Every node
in the site (not just the homepage) is reachable at its `#anchor`, and those anchors are listed in
`llms.txt` and the sitemap.

### Keyword coverage

Keywords are woven into real sentences — hero roles, the About biography, THOMU LAB, Wealth, EV and
Vision copy — rather than collected in blocks. Two deliberate omissions:

- **`thomudidnot`** is intentionally not used anywhere except the meta keywords list. It appears to
  be a handle rather than a name, and no public profile could be verified. If it is a real account,
  add it to `sameAs` in the JSON-LD and to `llms.txt` — a handle only counts as an identity signal
  once it is verifiable somewhere public.
- **Luxury lifestyle terms** (supercars, watches, premium cards, private banking) appear only in the
  "Lifestyle & craft" panel, framed as a standard being built toward with an explicit note that
  nothing there is a claim of current ownership. Publishing them as possessions would contradict the
  site's no-fabrication rule.

**Before going live:** replace the placeholder domain `https://georgesthomas.com` in
`index.html` (canonical, OG/Twitter URLs, JSON-LD) and in `public/robots.txt` /
`public/sitemap.xml` with the real domain.

---

© George S. Thomas · NKT Group. All rights reserved.
