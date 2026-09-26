# Search Console: verification, monitoring and reporting

This is the working runbook for keeping the site visible in search. It covers ownership
verification, sitemap submission, the performance review, URL Inspection and index-coverage
monitoring. The same material is published for visitors at `/search-console-monitoring/`.

---

## 1. One-time setup

### 1.1 Add the property

1. Open [Google Search Console](https://search.google.com/search-console) → **Add property**.
2. Choose **URL prefix** and enter the exact deployed prefix:

   ```
   https://gptthomu-cmd.github.io/testing-e-ortfoilo/
   ```

   (A **Domain** property is only possible with a custom domain, and it also covers http/https
   and subdomains — prefer it once a domain is in place.)

### 1.2 Verify ownership

Two methods ship with this site. Either works; the meta tag is preferred.

**Method A — HTML meta tag (recommended)**

1. In Search Console choose the **HTML tag** verification method and copy the `content` value.
2. Set it locally in `.env.local`:

   ```bash
   NEXT_PUBLIC_GSC_VERIFICATION=the-token-from-search-console
   ```

3. Rebuild and deploy. The token is rendered into every page's `<head>`:

   ```bash
   npm run build:pages && npm run seo:check
   ```

4. Click **Verify** in Search Console.

**Method B — URL-prefix file**

The build ships an inert `/privacy.html` for verification-by-file and for programmes that
require a privacy-policy URL. It contains no analytics, no cookies and no crawlable links, and
it is marked `noindex, nofollow`. If Search Console asks for a differently-named file, drop the
supplied file into `public/` and rebuild.

### 1.3 Submit the sitemap

Search Console → **Sitemaps** → enter the path and submit:

```
sitemap.xml
```

The fully-qualified URL is `https://gptthomu-cmd.github.io/testing-e-ortfoilo/sitemap.xml`, and
`robots.txt` advertises the same location. Expect the status to move from *Couldn't fetch* →
*Success* within a day or two; the discovered-URL count should match the 19 URLs the build
generates (`npm run seo:check` prints the exact number).

> **GitHub Pages caveat.** `robots.txt` is only honoured at the origin root
> (`https://gptthomu-cmd.github.io/robots.txt`). A project site cannot serve that path. The
> sitemap still works when submitted directly. To get root-level robots and the sitemap for the
> whole origin, publish `deploy/root/robots.txt` from a `gptthomu-cmd.github.io` repository, or
> move to a custom domain (see `docs/DEPLOYMENT.md`).

---

## 2. The routine

### Weekly (10 minutes)

| Check | Location | Look for |
| --- | --- | --- |
| Security & manual actions | Overview | Any new issue — these outrank everything else |
| Coverage anomalies | **Pages** | New "Error" rows, or a jump in "Not indexed" |
| Sitemap state | **Sitemaps** | "Success", last read date within 7 days, discovered URLs ≈ expected |
| Traffic shape | **Performance** (7 days vs previous) | A cliff, not normal variance |

### Monthly (45 minutes)

1. **Performance** — switch between *Queries* and *Pages*, and compare date ranges.
   Record for each of the top 10 queries: impressions, clicks, CTR, average position.
   The useful signals for this site are:
   - branded queries (**george s thomas**, **thomu**, **nkt charge hub**) — are they winning?
   - new pages that entered the index but earn zero impressions (title/description problem)
   - pages with high impressions but CTR < 1% (the snippet is not earning the click)
2. **Pages** — triage every non-indexed URL with the order in section 4.
3. **Core Web Vitals** — confirm LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on mobile.
4. **Enhancements** — breadcrumbs, FAQ and article rich results; fix anything flagged.
5. Record the month's numbers in the reporting log (section 6) — from the tool, not from memory.

### Quarterly (2 hours)

- Content review: pages with impressions but no clicks get rewritten or merged; pages with
  neither get improved or pruned.
- Re-run `npm run seo:check` and Lighthouse on the three key templates.
- Re-verify `sameAs` profiles and the Organization/Person schema still describe reality.

---

## 3. URL Inspection workflow

Run this for **every published or materially changed URL** before moving on.

1. **Inspect the live URL** (not the sitemap entry).
2. **Confirm the crawled page matches the canonical.** If Google selected a different canonical,
   look for an internal link pointing at a variant URL — fix the link, not the report.
3. **Read the coverage state** and take the corresponding action:

   | Coverage state | Usual cause here | Action |
   | --- | --- | --- |
   | Submitted and indexed | — | Nothing |
   | Discovered – currently not indexed | New URL, weak internal linking | Add contextual internal links from 2–3 relevant pages |
   | Crawled – currently not indexed | Thin or duplicated value | Improve the page; do not resubmit unchanged |
   | Duplicate, Google chose different canonical | Alias URL linked from somewhere | Point links at the canonical; make the stub `noindex` |
   | Excluded by noindex tag | 404 page, redirect stubs, `/privacy.html` | Expected — no action |
   | Blocked by robots.txt | Should not happen (robots allows `/`) | Check `robots.txt` and the deploy |

4. **Check the rendered HTML**: `<title>`, meta description, canonical, one `<h1>`, and the
   JSON-LD blocks (site graph + page graph).
5. **Request indexing once**, after the fix is live.
6. If a URL was recently deleted, add a redirect stub rather than leaving a 404 (see
   `public/redirects.json`).

---

## 4. Index coverage triage order

1. **Errors** — server/redirect errors. Nothing else matters until these are clean.
2. **Discovered, not indexed** — linking and quality signals.
3. **Crawled, not indexed** — read the page as a stranger; if it does not answer a question
   better than what already ranks, that is the finding.
4. **Duplicate / canonical** — check the declared canonical versus the one Google reports.
5. **Excluded (noindex / not found)** — confirm each is intentional and documented here.

Expected steady state for this site: 19 submitted URLs indexed, 1 intentional 404, 8 alias
redirect stubs excluded, `/privacy.html` excluded by `noindex`.

---

## 5. Analytics and privacy

- GA4 loads **only after consent** (Consent Mode v2, `analytics_storage: denied` by default).
- IP anonymisation on; Google signals and ad personalisation off.
- Declining loads no analytics script and deletes any `_ga*` cookies this site set.
- `web_vitals` events report LCP, INP, CLS, FCP and TTFB with a good / needs-improvement / poor
  rating so the Search Console CWV report can be correlated with on-site behaviour.

---

## 6. Reporting log

Keep this table in the repository (or a private notes file) and fill it from Search Console only.

| Month | Clicks | Impressions | Avg. CTR | Avg. position | Indexed pages | Coverage errors | CWV (mobile) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09 | — | — | — | — | 19 expected | 0 expected | pass expected |
|  |  |  |  |  |  |  |  |

Rules for reporting (also stated publicly on `/search-console-monitoring/`):

1. Numbers come from the tool, or they are not stated.
2. Illustrative charts are labelled as illustrative — never presented as results.
3. A change made only to satisfy a metric, which does not improve the page for a reader, is
   reverted.

---

## 7. Optional: pull reports from the API

`scripts/gsc-report.mjs` prints a performance and coverage summary using the Search Console API
if you want the numbers in a terminal or a scheduled job:

```bash
# one-off, using a service-account key or gcloud application-default credentials
node scripts/gsc-report.mjs --site https://gptthomu-cmd.github.io/testing-e-ortfoilo/ --days 28
```

It needs the `webmasters.readonly` scope. Without credentials it exits with a clear message
rather than failing silently.
