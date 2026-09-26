# Updating the site

All copy lives in two places only:

| Where | What | File |
| --- | --- | --- |
| Markup | Section titles, body paragraphs, chips, labels | `index.html` |
| Data | Ecosystem nodes, AI layers, vision stages, project index | `src/data/content.js` |

Everything is plain HTML/CSS/JS — no CMS, no build-time data fetching.

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

The five layer titles live in `index.html` (`.flow__step`). The explanatory paragraph each one
opens is keyed by its `01`–`05` index in `src/data/content.js`:

```js
export const aiLayers = {
  '01': 'What this layer does…',
  // …
};
```

Edit the string, keep the key. Adding a sixth layer means adding both a `.flow__step` block and
a matching key.

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

Only the Instagram handle is published, because it is the only confirmed channel. When a
business email, phone number or LinkedIn profile is confirmed, add it to the
`.contactcard__main` block in `index.html` next to the existing Instagram link, and update the
note underneath so it stays accurate. Also add it to `sameAs` in the JSON-LD block in `<head>`.

---

## 7. Visual assets

| File | Used for | Notes |
| --- | --- | --- |
| `public/img/hero-atmosphere.*` | Hero background | WebP + JPEG, 1584×672 |
| `public/img/nkt-charge.*` | EV section backdrop | WebP + JPEG, 1408×768 |
| `public/img/lab-infra.*` | Homelab figure | WebP + JPEG, 1408×768 |
| `public/img/og-cover.jpg` | Social sharing card | 1200×630 |
| `public/favicon.svg`, `apple-touch-icon.png`, `icon-512.png` | Icons | |

All imagery is abstract or illustrative — no stock headshots and no photographs presented as the
premises. When swapping in a real photograph of the charging site, keep the `width`/`height`
attributes and alt text honest, and update the caption (currently "Conceptual illustration").

---

## 8. Motion & accessibility switches

- `prefers-reduced-motion` is honoured automatically.
- The footer **Reduce motion** button stores `thomu:motion` in `localStorage`.
- If you add a new animated element, test it with reduced motion on (footer toggle) — reveals
  and transitions are neutralised globally in `src/styles/motion.css`.

---

## 9. Before deploying

1. Replace `https://georgesthomas.com` with the real domain in `index.html`, `public/robots.txt`
   and `public/sitemap.xml`.
2. Run `npm run build` and deploy `dist/`.
3. Check the OG card renders by pasting the live URL into any social preview debugger.


---

## 10. SEO surface

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

### Adding an FAQ entry

Append a `Question` / `acceptedAnswer` pair to the `FAQPage` node. Keep answers to one or two
sentences, factual, and consistent with the status labels — never describe a `Planned` project as
if it were operating.

### Meta keywords

`<meta name="keywords">` does not influence Google rankings, but some other engines and internal
site-search tools still read it. Keep the list honest: including a term is a claim that the page
genuinely covers the topic. Do not add competitor names, unrelated high-traffic terms, or place
names the businesses are not actually in.
