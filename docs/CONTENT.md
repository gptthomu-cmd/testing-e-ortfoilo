# Updating the site

Copy lives in three places:

| Where | What | File |
| --- | --- | --- |
| Markup | Section titles, body paragraphs, chips, labels | `index.html` (home) and `<page>/index.html` (sub-pages) |
| Data | Ecosystem nodes, AI layers, vision stages, project index | `src/data/content.js` |
| Chrome | Head meta, nav, footer, background, script tag | `src/partials/*.html` |

Everything is plain HTML/CSS/JS — no CMS, no build-time data fetching. Nav and footer are written
once as partials and inlined into every page by the plugin in `vite.config.js`, so edit them there
rather than per page.

---

## 1. The status vocabulary

Every claim on the site carries one of five statuses. Keep using them consistently; the
"At a glance / How to read this site" panel in the About section promises visitors this.

| Class | Label | Use it for |
| --- | --- | --- |
| `status--current` | Current | Exists and operates today |
| `status--active` | Active | Being worked on right now |
| `status--experimental` | Experimental | Being tested, not dependable yet |
| `status--planned` | Planned | Scoped but not started |
| `status--vision` | Vision | Long-term ambition |
| `status--wishlist` | Wishlist | Wanted, not owned (lifestyle pages) |
| `status--future` | Future | A direction, not a purchase (lifestyle pages) |

```html
<span class="status status--current">Current</span>
```

**Rule:** never label something `current` until it is genuinely operating. The credibility of the
whole page rests on this.

---

## 2. NKT Group ecosystem

### Adding or editing an entity node

1. **Button** in `index.html`, inside `.eco__row`:

```html
<button class="eco__node eco__node--child" type="button"
        aria-describedby="eco-panel" data-eco-node="myentity" aria-pressed="false">
  <span class="eco__node-kicker">Short category</span>
  <span class="eco__node-title">Entity Name</span>
  <span class="status status--current">Current</span>
</button>
```

2. **Panel content** in `src/data/content.js`, under `ecosystem`:

```js
myentity: {
  title: 'Entity Name',
  status: 'current',                 // current | active | experimental | planned | vision
  body: ['First paragraph.', 'Second paragraph.'],
  tags: ['Tag one', 'Tag two'],
  location: 'Town, State'            // optional — renders with a pin icon
}
```

Anything longer than four cards in `.eco__row` will wrap automatically; the grid is
`repeat(3, 1fr)` from 720px up and stacked on phones.

---

## 3. My_AI_OS architecture layers

The seven layers — Data, Knowledge, Memory, Intelligence, Models, Agents, Actions — are written as
`.flow__step` blocks in **both** `index.html` and `my-ai-os/index.html`. The explanatory paragraph
each one opens is keyed by its `01`–`07` index in `src/data/content.js`:

```js
export const aiLayers = {
  '01': 'What this layer does…',
  // …
};
```

Edit the string, keep the key. Adding or removing a layer means editing **both** markup files and
the data file — if they drift, the accordion silently falls back to the short hint text.

---

## 4. The Long Game (vision map)

Same pattern: stage names in `src/data/content.js` under `visionNodes`, matching the
`data-map-node` attributes in `index.html`. Supported keys: `life`, `wealth`, `nkt`, `apex`,
`aios`, `lab`, `infra`, `ventures`.

```js
aios: {
  title: 'My_AI_OS',
  status: 'experimental',
  body: 'One or two sentences.',
  points: ['Bullet one', 'Bullet two', 'Bullet three']
}
```

---

## 5. Open-source projects

The project index is **intentionally empty** — the site ships with an honest empty state rather
than invented repositories.

To publish a project, add objects to `projects` in `src/data/content.js`:

```js
export const projects = [
  {
    name: 'apex-ledger',
    world: 'wealth',                 // personal | wealth | business | lab
    purpose: 'One sentence on the problem it solves.',
    status: 'Active',                // Completed | Active | Experimental | Planned | Wishlist | Superseded
    github: 'https://github.com/<account>/<repo>'
  }
];
```

- `world` filters must match the filter buttons in `index.html`
  (`personal`, `wealth`, `business`, `lab`).
- Omit `github` while a repository is private — the card renders without a link instead of
  pointing somewhere that does not exist.
- Once the array is non-empty, the filter bar reappears automatically and the empty state hides.

---

## 6. Contact details

Three public channels are published, and only these three:

| Channel | Value |
| --- | --- |
| Email | `gdrivegeorge@gmail.com` (portfolio & business contact) |
| LinkedIn | https://www.linkedin.com/in/george-s-thomas-a64b91405 |
| Instagram | https://www.instagram.com/george.s.thomas/ |

They appear in the homepage contact section, `/contact/`, the footer, the overlay menu and the
`sameAs` array of the `Person` JSON-LD. When any of them changes, update **all** of those places —
plus `public/llms.txt` — or the identity signals start disagreeing with each other.

Rules that must not be broken:

- Never publish a second email address, a phone number or a private address.
- The email is a **contact address only**. It is never evidence of ownership of any financial,
  business or service account.
- `mailto:` links only — no forms, no trackers, no autoresponders that store data.

### The family note

The sentence "George S. Thomas is the nephew of Mathew Kuzhalnadan" appears in the About section of
`index.html` and on `/about/`, always with the disclaimer that it implies no political affiliation,
endorsement, partnership or shared venture. Keep it short and secondary. It is intentionally **not**
in the JSON-LD, so search engines do not build an entity association from it.

---

## 7. Adding or editing a page

1. `mkdir my-page && cp about/index.html my-page/index.html`, then set `<!-- page:my-page -->` at
   the top of `<head>` and rewrite the content.
2. Register the file in the `pages` object in `vite.config.js` — otherwise it is not built.
3. Add the URL to `public/sitemap.xml`, `public/llms.txt`, `src/partials/footer.html` and the
   overlay menu in `src/partials/nav.html`.
4. Write the JSON-LD `@graph`: `WebPage` (+ `breadcrumb`) and `BreadcrumbList` at minimum. Reuse the
   shared `@id`s (`#person`, `#nktgroup`, `#nkchargehub`, `#thomulab`, `#apexcreatoros`, `#myaios`,
   `#website`) so the entity graph stays connected across pages.
5. Check `<h1>` is unique, the meta description is under ~160 characters, and every internal link
   resolves.

Sub-page components live in `src/styles/pages.css`: `.crumbs`, `.pagehead`, `.card`, `.grid`,
`.spec`, `.callout`, `.rail`, `.tree`, `.mode` / `.wishrow` (THOMU MODE), `.projrow`, `.prose`,
`.split`, `.cta`, `.notfound`.

## 8. Visual assets

| File | Used for | Notes |
| --- | --- | --- |
| `public/img/hero-atmosphere.*` | Hero background | WebP + JPEG, 1584×672 |
| `public/img/nkt-charge.*` | EV section backdrop | WebP + JPEG, 1408×768 |
| `public/img/lab-infra.*` | Homelab figure | WebP + JPEG, 1408×768 |
| `public/img/gaming-setup.*` | `/technology/#gaming` | WebP + JPEG, 1408×768 |
| `public/img/3d-printing.*` | `/technology/#3d-printing` | WebP + JPEG, 1408×768 |
| `public/img/photography.*` | `/technology/#photography` | WebP + JPEG, 1408×768 |
| `public/img/og-cover.jpg` | Social sharing card | 1200×630 |
| `public/favicon.svg`, `apple-touch-icon.png`, `icon-512.png` | Icons | |

All imagery is abstract or illustrative — no stock headshots and no photographs presented as the
premises. When swapping in a real photograph of the charging site, keep the `width`/`height`
attributes and alt text honest, and update the caption (currently "Conceptual illustration").

---

## 9. Motion & accessibility switches

- `prefers-reduced-motion` is honoured automatically.
- The footer **Reduce motion** button stores `thomu:motion` in `localStorage`.
- If you add a new animated element, test it with reduced motion on (footer toggle) — reveals
  and transitions are neutralised globally in `src/styles/motion.css`.

---

## 10. Before deploying

0. Set the two placeholders in `src/partials/head.html`: the Search Console
   `google-site-verification` code and, if you want analytics, the GA4 Measurement ID. Both are
   inert by default — see `docs/SEARCH-CONSOLE.md`.
1. Replace `https://georgesthomas.com` with the real domain in **every** HTML file
   (`index.html`, `404.html` and each `*/index.html` — canonical, OG/Twitter URLs and JSON-LD
   `@id`s), plus `public/robots.txt` and `public/sitemap.xml`. A project-wide search-and-replace
   is the safe way to do it.
2. Run `npm run build` and deploy `dist/`.
3. Check the OG card renders by pasting the live URL into any social preview debugger.


---

## 11. SEO surface

Three places carry the search/AI-discoverability layer, and all three should be kept in sync:

| File | Contains |
| --- | --- |
| `index.html` `<head>` | title, description, keywords, geo meta, OG/Twitter cards, canonical |
| `index.html` JSON-LD `@graph` | Person, Organization, LocalBusiness, two SoftwareApplication, WebSite, FAQPage |
| `public/llms.txt` | plain-text summary aimed at AI assistants and crawlers |
| `public/sitemap.xml`, `public/robots.txt` | crawling |

### Adding a social or contact profile

1. Add the URL to `sameAs` in the `Person` node in `index.html`.
2. Add it to the **Contact** section in `index.html`.
3. Add it to the **Contact** heading in `public/llms.txt`.

Do all three or the identity signals disagree with each other.

### Analytics & verification

- `src/partials/head.html` holds both placeholders (Search Console tag, GA4 ID). They are shared by
  every page, so one edit covers the site.
- `src/lib/analytics.js` is a no-op until a real `G-…` ID is set *and* the visitor accepts. Do not
  hard-code a tag elsewhere — that would bypass the consent gate and make `/privacy/` inaccurate.
- If you enable analytics, update the "Analytics" section of `/privacy/` in the same commit.

### Per-page SEO

Each page carries its own title, description, canonical, OG/Twitter tags and JSON-LD. The home page
is the only one with a `meta keywords` list; sub-pages earn their rankings from real headings and
copy instead. When you add an FAQ block in visible copy, mirror it as an `FAQPage` node
(`/nkt-charge-hub/` does exactly this).

### Adding an FAQ entry

Append a `Question` / `acceptedAnswer` pair to the `FAQPage` node. Keep answers to one or two
sentences, factual, and consistent with the status labels — never describe a `Planned` project as
if it were operating.

### Meta keywords

`<meta name="keywords">` does not influence Google rankings, but some other engines and internal
site-search tools still read it. Keep the list honest: including a term is a claim that the page
genuinely covers the topic. Do not add competitor names, unrelated high-traffic terms, or place
names the businesses are not actually in.

---

## 12. Writing (the blog)

Two files make up the writing section:

| File | What it is |
| --- | --- |
| `blog/index.html` | The index. Lists every post and links the RSS feed. |
| `blog/<slug>/index.html` | One page per post. |
| `public/blog/feed.xml` | RSS 2.0 feed — must be updated by hand with each new post. |

### Adding a post

1. Copy `blog/building-nkt-charge-hub/index.html` to `blog/my-post-slug/index.html` and set
   `<!-- page:blog-post -->` at the top of `<head>` (this keeps the "Writing" nav item highlighted).
2. Register it in `pages` in `vite.config.js` — an unregistered page is not built.
3. Rewrite: `<title>`, meta description, canonical, `article:*` tags, and the JSON-LD
   `BlogPosting` (`datePublished`, `dateModified`, `headline`, `timeRequired`, `keywords`).
   Keep the shared `@id`s (`#person`, `#website`, `#nkchargehub`, `#thomulab`) so the graph stays
   connected.
4. Add a `.postcard` to the index (copy the existing one), add the URL to `public/sitemap.xml`,
   add an `<item>` to `public/blog/feed.xml`, and list it under "Writing" in `public/llms.txt`.
5. Update the `blogPost` array in the index's JSON-LD, and the "Latest post" link in
   `src/partials/nav.html` if it should point at the new one.

`dateModified` must change whenever you edit a post — that date is what shows readers (and search
engines) that a correction was made.

### Editorial rules for posts

- **No invented numbers.** The first post states plainly which figures are deliberately not
  published. Keep doing that: if a number is not confirmed, say it is not published rather than
  estimating.
- **No firsts, no superlatives, no named partners or customers** unless they can be verified.
- Write in the first person about work that actually happened. If a section is speculation, label it.
- Images are illustrative: caption them as concepts if they are not photographs of the real thing.
- Corrections are edits with a new `dateModified`, not silent rewrites.

---

## 13. The sitemap page and the machine-readable files

`/sitemap/` is a human-readable list of every page plus every machine file. It exists because a
footer is good for people who know what they are looking for and bad for everyone else — and
because "more than one way to find a page" is an accessibility requirement, not a nicety.

**When you add a page**, add it to the right group in `sitemap/index.html` as well as to the
footer and `sitemap.xml`. The groups are: Identity & work, NKT Group, THOMU LAB, Legal, and
"For crawlers, apps & AI".

### The files behind the site

| File | What it is | Maintenance |
|---|---|---|
| `public/sitemap.xml` | Every indexable URL with `lastmod`, `changefreq`, `priority`; images carry `image:image` | Add an entry for every new page; update `lastmod` when a page genuinely changes |
| `public/robots.txt` | Crawler policy, with AI search and training bots named explicitly | Only if you decide to block something |
| `public/llms.txt` | Plain-text map of the site for language models | Update when a page is added or a fact changes |
| `public/humans.txt` | Who built the site, what it is made of, what it refuses to do | Update the "Last update" line when you touch it |
| `public/.well-known/security.txt` | RFC 9116 security contact | **`Expires:` must stay in the future** — refresh it yearly or it is ignored |
| `public/blog/feed.xml` | RSS 2.0 feed for new writing | Add an `<item>` per post |
| `public/_headers` | Cache + security rules (security block expanded at build time) | Rarely; see `docs/SECURITY.md` |
| `public/_redirects` | 301s and the 404 route | When a URL changes |

### AI crawlers

`robots.txt` currently allows both kinds of bot:

- **Retrieval bots** (OAI-SearchBot, ChatGPT-User, Claude-SearchBot / Claude-User,
  PerplexityBot / Perplexity-User) fetch a page to answer a question, with a citation. Always
  allow these — they are how the site gets quoted.
- **Training crawlers** (GPTBot, ClaudeBot, CCBot) crawl to train models. Blocking them does
  **not** remove you from AI answers; it is a reach decision, not a ranking one.

To opt out of training, change the three `Allow: /` lines under "AI training crawlers" to
`Disallow: /` and leave the retrieval bots alone.

### After any build

The CSP in `dist/_headers` is regenerated from your HTML, so it never goes stale as long as you
deploy `dist/`. If a browser console reports a blocked inline script after you hand-edit HTML,
run `npm run build` and redeploy — the new hash is in that build.
