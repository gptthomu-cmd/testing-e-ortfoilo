# Google Search Console — setup & monitoring playbook

Everything needed to verify the site, get it indexed, and keep an eye on it.
The code side is already in place (sitemap, robots, canonicals, structured data, 404);
this document is the Search Console side, plus the two placeholders you have to fill in.

---

## 1. Two placeholders to fill in before you start

| What | Where | Value |
| --- | --- | --- |
| Site verification tag | `src/partials/head.html` — uncomment the `google-site-verification` meta | the code Google gives you |
| GA4 Measurement ID | `src/partials/head.html` — `window.GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

Both are inert by default: no verification tag, and no request to Google until you opt in.

### Verification — pick one method

1. **HTML tag (easiest).** Search Console → *Add property* → URL prefix → *HTML tag*.
   Copy the content value, uncomment this line in `src/partials/head.html` and paste it:

   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```

   Because it lives in the shared head partial, one edit verifies **every page**. Rebuild and deploy.
2. **Domain property (recommended if you control DNS).** Choose *Domain* → add the
   `TXT` record Google shows. This covers all subdomains and protocols and survives redesigns.
3. **Google Analytics.** Works only if the GA tag is live and you use the same Google account.

> Use a **URL-prefix property** for day-to-day URL Inspection, and add a **Domain property** for
> the widest coverage. Both can exist at once.

---

## 2. First 30 minutes after the site is live

1. **Submit the sitemap.** *Sitemaps* → `https://YOURDOMAIN/sitemap.xml` → Submit.
   Expect: “Success — 14 URLs discovered” (13 pages + the home page).
2. **Request indexing for the URLs that matter most**, in this order (URL Inspection →
   *Request indexing*, one at a time; the quota is generous but not unlimited):

   ```
   /                      /nkt-charge-hub/
   /about/                /thomu-lab/
   /nkt-group/            /apex-creator-os/
   /my-ai-os/             /technology/
   /projects/             /lifestyle/
   /contact/              /privacy/  /terms/
   ```

   Leave `/404.html` out — it is `noindex` on purpose and excluded from the sitemap.
3. **Confirm each page is indexed.** URL Inspection → *Test live URL* → View crawled page.
   Check: **“URL is available to Google”**, the right canonical, and no blocking directive.
4. **Check the structured data.** *Enhancements* (or the Rich Results Test on
   `search.google.com/test/rich-results`) — you should see, with zero errors:
   `Person` / `ProfilePage`, `Organization` (with logo), `LocalBusiness` (NKT Charge Hub),
   `SoftwareApplication` ×2, `WebSite`, `WebPage`, `ImageObject`, `BreadcrumbList`, `FAQPage`.
   Warnings for optional fields are fine.
5. **Mobile usability** → “No issues”. **Core Web Vitals** → the report fills in over ~28 days.

---

## 3. Analytics (optional, consent-gated)

The site ships with **no trackers**. To switch GA4 on:

1. Create a GA4 property → get the Measurement ID (`G-…`).
2. In `src/partials/head.html`, replace `G-XXXXXXXXXX` with it.
3. Rebuild and deploy.

What happens then:

- Consent Mode v2 starts with `analytics_storage: denied` — no analytics cookies before consent.
- A small card appears in the bottom-left asking the visitor to accept or decline.
- Accepting loads the tag; declining stores the refusal in `localStorage` and the card never
  returns. No dark patterns, no pre-ticked boxes, no nagging.
- Leave the ID as the placeholder and the whole module is a no-op — the site stays tracker-free.

Because analytics would set cookies, update the note in `/privacy/` when you enable it —
the page says plainly when analytics is off, and must say so when it is on.

### Search Console + GA4

Link them (*GA4 property → Admin → Product links → Search Console links*) to see query data and
landing-page behaviour in one place.

---

## 4. Monitoring rhythm

| Cadence | Check | Where | Act if… |
| --- | --- | --- | --- |
| Weekly (first month) | Index coverage | *Pages* (Indexing) | a page shows **Crawled – currently not indexed** → improve internal links from high-value pages and re-request indexing |
| Weekly | Sitemap status | *Sitemaps* | “Couldn’t fetch” → check the URL returns 200 and `robots.txt` allows it |
| Monthly | Queries & clicks | *Performance → Search results* | a page has impressions but no clicks → rewrite its title/description |
| Monthly | Average position 5–20 (striking distance) | *Performance* | add internal links and expand that page’s weakest section |
| Monthly | Core Web Vitals (mobile) | *Experience* | LCP > 2.5 s → check the hero image and fonts; CLS > 0.1 → check image dimensions; INP > 200 ms → check third-party scripts |
| Monthly | Mobile usability | *Experience* | viewport or tap-target errors → fix in CSS |
| Quarterly | Rich results / structured data | *Enhancements* | any error → validate the JSON-LD with the Rich Results Test |
| Quarterly | Manual actions & security | *Security & Manual Actions* | anything listed → it is urgent, follow Google’s instructions |
| On every deploy | URL Inspection on changed pages | *URL Inspection* | “URL is not on Google” for an old page → re-submit the sitemap |

### Index-coverage states you may see (and what they mean)

| State | Meaning | Action |
| --- | --- | --- |
| *Indexed* / *Submitted and indexed* | live | none |
| *Crawled – currently not indexed* | Google looked, decided it added nothing yet | add internal links, deepen the page, re-request |
| *Discovered – currently not indexed* | found but never crawled | usually resolves itself; request indexing |
| *Excluded by ‘noindex’ tag* | intentional (`/404.html`) | none |
| *Alternate page with canonical* | duplicate URL resolving to a canonical | expected if you ever serve `/about` and `/about/`; keep only one in the sitemap |
| *Redirect* | covered by `public/_redirects` | none |

---

## 5. Other free checks worth running

- **Rich Results Test** — `search.google.com/test/rich-results` (paste each URL once).
- **Schema Markup Validator** — `validator.schema.org` (catches things the Rich Results Test ignores).
- **PageSpeed Insights** — `pagespeed.web.dev` (field data after 28 days; lab data immediately).
- **Social preview debuggers** — LinkedIn Post Inspector, and the Open Graph preview in most chat apps.
- **Bing Webmaster Tools** — imports the whole property from Search Console in one click, and Bing
  still reads `<meta name="keywords">`, which only the home page carries.

---

## 6. What is already implemented in code

| Checklist item | Status |
| --- | --- |
| XML sitemap (`/sitemap.xml`, 14 URLs + image entries) | ✅ |
| Robots.txt (allows all, points at the sitemap) | ✅ |
| Canonical URLs on every page | ✅ |
| `Person` schema + `sameAs` (LinkedIn, Instagram, email) | ✅ — identity image is the GST monogram; swap in a real portrait when you have one |
| `ProfilePage` for `/about/` | ✅ |
| `Organization` schema for NKT Group (with logo) | ✅ |
| `BreadcrumbList` on every sub-page (visible breadcrumbs too) | ✅ |
| `WebSite` + `WebPage` (and `CollectionPage` / `ContactPage`) | ✅ |
| `LocalBusiness` for NKT Charge Hub + `FAQPage` | ✅ |
| `Article` / `BlogPosting` | ⏸ — no articles exist; template in §7 |
| `ImageObject` + `primaryImageOfPage` on every page | ✅ |
| Optimised images (WebP + JPEG, dimensions, lazy loading, preloaded hero) | ✅ |
| Open Graph + Twitter cards (per page, with alt text) | ✅ |
| Google Analytics | ⏸ — consent-gated, off by default (§3) |
| Core Web Vitals (no third-party requests, cached assets via `public/_headers`) | ✅ |
| Mobile-first responsive | ✅ |
| HTTPS / HSTS | 🔧 host-level — headers provided in `public/_headers` |
| Clean URLs (`/about/`), 404 page, redirect rules | ✅ + `public/_redirects` |
| Unique title + meta description (≤155 chars) per page | ✅ |
| H1 → H2 → H3 hierarchy, no skipped levels | ✅ |
| Internal linking (every page ≤2 clicks from home) | ✅ |
| Privacy Policy, Terms, cookie/consent controls | ✅ (consent appears only when analytics is on) |
| Favicon, apple-touch-icon, 192/512 icons, webmanifest | ✅ |

✅ in code · ⏸ waiting on content or your ID · 🔧 needs host configuration

---

## 7. Article / BlogPosting template (when you publish)

No articles exist, so no `BlogPosting` markup is emitted — inventing one would be worse than
leaving it out. When you publish, copy this into the page's JSON-LD `@graph`
(keep the shared `@id`s so the graph stays connected):

```json
{
  "@type": "BlogPosting",
  "@id": "https://YOURDOMAIN/blog/my-first-post/#article",
  "url": "https://YOURDOMAIN/blog/my-first-post/",
  "headline": "A headline under 110 characters",
  "description": "One or two sentences.",
  "image": { "@id": "https://YOURDOMAIN/blog/my-first-post/#primaryimage" },
  "datePublished": "2026-10-01T09:00:00+05:30",
  "dateModified": "2026-10-01T09:00:00+05:30",
  "author": { "@id": "https://YOURDOMAIN/#person" },
  "publisher": { "@id": "https://YOURDOMAIN/#person" },
  "mainEntityOfPage": { "@id": "https://YOURDOMAIN/blog/my-first-post/#webpage" },
  "isPartOf": { "@id": "https://YOURDOMAIN/#website" },
  "inLanguage": "en",
  "articleSection": "THOMU LAB"
}
```

Then: add the post to `sitemap.xml`, link it from `/projects/` or `/thomu-lab/`, add a
`BreadcrumbList` (Home › Blog › Post), and request indexing. If you add a blog index at `/blog/`,
add it to the nav partial and the sitemap too.
