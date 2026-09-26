import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { Toc } from "@/components/Toc";
import { SpecList } from "@/components/Cards";
import { BarChart, LineChart } from "@/components/Chart";
import { buildMetadata } from "@/lib/seo";
import { ID, ENDPOINTS, PERSON, SITE, SITE_ROOT, isFilled, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, faqNode } from "@/lib/schema";

const PATH = "/search-console-monitoring/";
const TITLE = "Search Console monitoring playbook";
const DESCRIPTION =
  "The search monitoring playbook for this site: Search Console performance reviews, URL Inspection checks, index coverage monitoring and Core Web Vitals.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-default.jpg",
  ogImageAlt: "Search Console monitoring playbook",
  keywords: [
    "Search Console monitoring",
    "URL inspection",
    "index coverage",
    "Core Web Vitals",
    "XML sitemap",
    "canonical URLs",
  ],
});

const trail = buildTrail({ name: "Search monitoring", path: PATH });

const CONTENTS = [
  { id: "what-is-monitored", text: "What is monitored", level: 2 },
  { id: "verification", text: "Ownership verification", level: 2 },
  { id: "sitemap", text: "Sitemap and robots", level: 2 },
  { id: "canonicals", text: "Canonical URLs", level: 2 },
  { id: "performance", text: "Performance monitoring", level: 2 },
  { id: "url-inspection", text: "URL Inspection workflow", level: 2 },
  { id: "coverage", text: "Index coverage monitoring", level: 2 },
  { id: "vitals", text: "Core Web Vitals", level: 2 },
  { id: "cadence", text: "Review cadence", level: 2 },
  { id: "reporting", text: "Reporting honestly", level: 2 },
];

const FAQS = [
  {
    question: "How is this site verified in Google Search Console?",
    answer:
      "Ownership is proven with the HTML meta-tag method: a verification token is placed in the site's metadata and rendered into the <head> of every page. The token is supplied through an environment variable, so no secret is committed to the repository.",
  },
  {
    question: "Which URL is submitted to Google as the sitemap?",
    answer:
      "The XML sitemap at /sitemap.xml, referenced from /robots.txt as well. On a GitHub Pages project site the files resolve under the deployment prefix, so submitted sitemap and robots URLs include the prefix; the sitemap lists fully-qualified canonical URLs.",
  },
  {
    question: "How often is search performance reviewed?",
    answer:
      "Weekly for anything anomalous — coverage errors, security issues, sudden traffic changes — and monthly for the routine performance review of queries, pages, countries and devices. There is a written checklist so a review cannot quietly skip a section.",
  },
  {
    question: "What happens when a page is not indexed?",
    answer:
      "The URL Inspection tool is used to fetch the live URL, confirm the canonical Google chose, and read the reported crawl and indexing status. Depending on the reason, the fix is either a sitemap/internal-link change, a content-quality change, or a canonical fix — never a blind re-submission.",
  },
  {
    question: "Is analytics data tied to individuals?",
    answer:
      "No. Google Analytics 4 loads only after explicit consent, with IP anonymisation and advertising features disabled. Search Console reports aggregated search data and does not track visitors on the site at all.",
  },
];

export default function MonitoringPage() {
  return (
    <>
      <JsonLd
        id="monitoring-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "WebPage",
            primaryImage: { url: "/images/og/og-default.jpg", caption: "Search monitoring" },
            aboutId: ID.website,
            mainEntityId: `${url(PATH)}#faq`,
            breadcrumbId: ID.breadcrumb(PATH),
            keywords: [
              "Search Console monitoring",
              "URL inspection",
              "index coverage",
              "Core Web Vitals",
              "XML sitemap",
            ],
          }),
          breadcrumbNode(PATH, trail),
          faqNode(PATH, FAQS),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="SEO operations"
        title="How this site is measured, indexed and monitored"
        lede="Publishing a site is the easy part. This page documents the monitoring behind it: how ownership is verified, what is submitted to search engines, how coverage is watched, and how the numbers are reported without dressing them up."
        tags={[
          "Google Search Console",
          "Index coverage",
          "URL Inspection",
          "Core Web Vitals",
          "Structured data",
        ]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="what-is-monitored">What is monitored</h2>
              <p>
                Three systems do the work. Google Search Console reports how Google sees the site.
                Google Analytics 4 reports what visitors do on it, and only once they have consented.
                The build itself is checked by <code>npm run seo:check</code>, a script that fails the
                build if a page breaks an SEO invariant — a missing canonical, a duplicate title, a
                broken internal link or invalid structured data.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th>Tool</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Crawl and index status per URL</td>
                    <td>Search Console — URL Inspection</td>
                    <td>On publish, and on any change</td>
                  </tr>
                  <tr>
                    <td>Coverage: valid, excluded, error</td>
                    <td>Search Console — Pages report</td>
                    <td>Weekly</td>
                  </tr>
                  <tr>
                    <td>Queries, impressions, CTR, position</td>
                    <td>Search Console — Performance</td>
                    <td>Monthly, weekly when something moves</td>
                  </tr>
                  <tr>
                    <td>Core Web Vitals field data</td>
                    <td>Search Console — Core Web Vitals</td>
                    <td>Monthly</td>
                  </tr>
                  <tr>
                    <td>Site health, security, manual actions</td>
                    <td>Search Console — overview</td>
                    <td>Weekly glance</td>
                  </tr>
                  <tr>
                    <td>On-site behaviour (consented)</td>
                    <td>Google Analytics 4</td>
                    <td>Continuous</td>
                  </tr>
                  <tr>
                    <td>Build-time SEO invariants</td>
                    <td>
                      <code>npm run seo:check</code>
                    </td>
                    <td>Every build</td>
                  </tr>
                </tbody>
              </table>

              <h2 id="verification">Ownership verification</h2>
              <p>
                The property is verified with the HTML meta-tag method, so no DNS access and no file
                uploads are needed. The token is read from{" "}
                <code>NEXT_PUBLIC_GSC_VERIFICATION</code> at build time and injected into the{" "}
                <code>&lt;head&gt;</code> of every page.
              </p>
              <SpecList
                items={[
                  {
                    label: "Verification status",
                    value: isFilled(process.env.NEXT_PUBLIC_GSC_VERIFICATION || "")
                      ? "Token configured"
                      : "Awaiting token (see README)",
                  },
                  { label: "Method", value: "HTML meta tag" },
                  { label: "Applies to", value: "All pages via root metadata" },
                  { label: "Second method (fallback)", value: "URL-prefix file at /privacy.html" },
                  { label: "Sitemap submitted", value: `${ENDPOINTS.sitemap} → Pages → Sitemaps` },
                ]}
              />
              <p className="note">
                A URL-prefix property can also be verified by hosting a file at a fixed path. This
                build ships an inert <code>/privacy.html</code> stub for exactly that purpose — it
                contains no analytics, no content and is excluded from the sitemap and marked{" "}
                <code>noindex</code>.
              </p>

              <h2 id="sitemap">Sitemap and robots</h2>
              <p>
                The XML sitemap is generated from the same data as the pages, so it cannot drift: every
                indexable route appears with its canonical URL and a <code>lastmod</code> date from
                that page&apos;s own metadata. The sitemap is emitted at{" "}
                <a href={ENDPOINTS.sitemap}>
                  <code>{SITE_ROOT}
                    {ENDPOINTS.sitemap}
                  </code>
                </a>{" "}
                and declared in <code>robots.txt</code>.
              </p>
              <ul>
                <li>
                  <strong>Included:</strong> every canonical, indexable page — home, about, projects,
                  ventures, blog articles and the legal documents.
                </li>
                <li>
                  <strong>Excluded:</strong> the 404 page, redirect stubs and anything carrying{" "}
                  <code>noindex</code>.
                </li>
                <li>
                  <strong>robots.txt</strong> disallows nothing that is worth indexing, allows
                  well-behaved crawlers, and points at the sitemap. It is deliberately short: a
                  restrictive robots file is one of the easiest ways to break a small site.
                </li>
                <li>
                  <strong>RSS</strong> at <a href={ENDPOINTS.rss}>
                    <code>{ENDPOINTS.rss}</code>
                  </a>{" "}
                  gives feed readers and indexers a second discovery path for new articles.
                </li>
              </ul>

              <h2 id="canonicals">Canonical URLs</h2>
              <p>
                Every page declares a self-referencing canonical, built from the same{" "}
                <code>path</code> value used for its Open Graph URL, its structured data{" "}
                <code>@id</code> and its sitemap entry. Because all four come from one source, a
                canonical that disagrees with the sitemap is not possible without failing the build.
              </p>
              <p>
                Canonicals use the deployed absolute URL including any path prefix, always with a
                trailing slash on directory-style routes, and never include tracking parameters.
                Alternate URLs — legacy paths and redirect stubs — point their canonical at the
                destination rather than competing with it.
              </p>

              <h2 id="performance">Performance monitoring</h2>
              <p>
                The Search Console Performance report is reviewed on two axes: queries (what people
                searched) and pages (what Google served). The useful signal for a personal site is not
                the total clicks — it is the ratio of impressions to clicks on branded queries, and
                whether new pages enter the index with impressions attached.
              </p>
              <LineChart
                caption="Illustrative shape of the monthly review: impressions, clicks and average position tracked together so a ranking change can be told apart from a demand change. Populate from Search Console — the numbers on this page are never invented."
                series={[
                  { name: "Impressions (×100)", points: [12, 18, 24, 30, 41, 48], colour: "var(--accent)" },
                  { name: "Clicks", points: [3, 5, 7, 9, 14, 17], colour: "var(--green)" },
                  { name: "Avg. position (inverted, ×10)", points: [42, 38, 33, 29, 24, 21], colour: "var(--amber)" },
                ]}
              />
              <p className="small muted">
                The chart above is explicitly labelled illustrative: it shows the shape of the review,
                not measured results. Real figures are pasted in only when they come from the Search
                Console export, because a plausible-looking line is exactly the kind of invented data
                this site avoids.
              </p>

              <h2 id="url-inspection">URL Inspection workflow</h2>
              <p>
                Every time a page is published or materially changed, it goes through the same five
                steps in the URL Inspection tool:
              </p>
              <ol>
                <li>
                  <strong>Inspect the live URL</strong>, not the sitemap entry, so the check reflects
                  what is actually deployed.
                </li>
                <li>
                  <strong>Confirm the crawled page matches the canonical.</strong> If Google chose a
                  different canonical, the reason is almost always an internal link pointing at a
                  variant URL — the fix is in the site, not in the report.
                </li>
                <li>
                  <strong>Read the coverage state</strong> — indexed, discovered but not indexed,
                  crawled but not indexed, excluded. Each has a different cause and a different fix.
                </li>
                <li>
                  <strong>Check the rendered HTML</strong> for the essentials: title, description,
                  canonical link, one H1, and the JSON-LD blocks present and valid.
                </li>
                <li>
                  <strong>Request indexing only after the fix is live</strong>, once. Repeated
                  re-submission does not accelerate crawling and hides whether the change worked.
                </li>
              </ol>

              <h2 id="coverage">Index coverage monitoring</h2>
              <p>
                The Pages report is the early-warning system. For a site this size, the expected
                healthy state is boring: every submitted URL indexed, no errors, and a small,
                explainable set of exclusions.
              </p>
              <BarChart
                caption="Illustrative coverage snapshot by status. The real review compares submitted URLs against indexed URLs and explains every gap before the number is reported."
                data={[
                  { label: "Indexed", value: 17 },
                  { label: "Excluded", value: 4 },
                  { label: "Not found (404)", value: 1 },
                  { label: "Errors", value: 0 },
                ]}
              />
              <h3 id="coverage-triage">Triage order</h3>
              <ol>
                <li>
                  <strong>Errors first.</strong> Server errors and redirect errors break crawling and
                  outrank every other decision.
                </li>
                <li>
                  <strong>Discover but not indexed.</strong> Usually crawl-budget or quality signals:
                  strengthen internal links to the URL and improve the page before re-checking.
                </li>
                <li>
                  <strong>Crawled but not indexed.</strong> Read the page as a stranger would; if it
                  does not answer a question better than what already ranks, that is the problem.
                </li>
                <li>
                  <strong>Duplicate, canonical, alternate.</strong> Confirm the canonical Google
                  reports matches the one the page declares; if not, fix the linking pattern.
                </li>
                <li>
                  <strong>Excluded by noindex.</strong> Expected for the 404 page and the verification
                  stub — record it as intentional so it never shows up as an unexplained anomaly.
                </li>
              </ol>

              <h2 id="vitals">Core Web Vitals</h2>
              <p>
                This site is built to be fast by construction rather than patched afterwards: static
                HTML with no server runtime, system fonts so there is no third-party font round trip,
                CSS-only navigation so the header works before hydration, explicit image dimensions
                and responsive sources to prevent layout shift, and a single small client bundle for
                consent and analytics.
              </p>
              <p>
                Field data comes from the Core Web Vitals report in Search Console and the{" "}
                <code>web_vitals</code> Google Analytics event emitted for LCP, INP, CLS, FCP and TTFB,
                each labelled good, needs-improvement or poor against Google&apos;s thresholds.
                Lab data is checked with Lighthouse during development.
              </p>
              <SpecList
                items={[
                  { label: "LCP target", value: "≤ 2.5 s" },
                  { label: "INP target", value: "≤ 200 ms" },
                  { label: "CLS target", value: "≤ 0.1" },
                  { label: "TTFB target", value: "≤ 800 ms (static hosting)" },
                  { label: "Field source", value: "Search Console + GA4 web_vitals event" },
                  { label: "Consent impact", value: "Analytics cannot slow first paint — it loads after consent" },
                ]}
              />

              <h2 id="cadence">Review cadence</h2>
              <ul>
                <li>
                  <strong>Every publish:</strong> run the build-time SEO check, inspect the new URL,
                  confirm it appears in the sitemap.
                </li>
                <li>
                  <strong>Weekly:</strong> glance at Search Console overview — security, manual
                  actions, coverage anomalies.
                </li>
                <li>
                  <strong>Monthly:</strong> full performance review (queries, pages, countries,
                  devices), coverage triage, Core Web Vitals.
                </li>
                <li>
                  <strong>Quarterly:</strong> content review — which pages earned impressions and
                  which should be merged, updated or removed.
                </li>
              </ul>

              <h2 id="reporting">Reporting honestly</h2>
              <p>
                Monitoring only has value if it is reported truthfully. Two rules apply to everything
                published from this process:
              </p>
              <ol>
                <li>
                  <strong>Numbers come from the tool, or they are not stated.</strong> Where a figure
                  is illustrative, it is labelled as illustrative next to the chart — never presented
                  as a result.
                </li>
                <li>
                  <strong>Fixes are recorded with the reason.</strong> A change made to satisfy a
                  metric that does not improve the page for a reader is a step backwards, and it gets
                  reverted.
                </li>
              </ol>
              <p>
                Questions about the setup, or a report of a page that is not behaving, can go through
                the <Link href="/contact/">contact page</Link>. Data handling for measurement is
                described in the <Link href="/privacy-policy/">privacy policy</Link>, and the controls
                for analytics consent are on the <Link href="/cookies/">cookie page</Link>.
              </p>
              <p className="small muted">
                Reviewed and maintained by {PERSON.name}. This page describes the monitoring of{" "}
                {SITE.name} only; it is not a general SEO guide and it is not advice for other sites.
              </p>
            </div>

            <aside>
              <Toc headings={CONTENTS} />
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Machine endpoints</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    <a href={ENDPOINTS.sitemap}>{ENDPOINTS.sitemap}</a> — XML sitemap
                  </li>
                  <li>
                    <a href={ENDPOINTS.robots}>{ENDPOINTS.robots}</a> — crawler rules
                  </li>
                  <li>
                    <a href={ENDPOINTS.rss}>{ENDPOINTS.rss}</a> — RSS 2.0 feed
                  </li>
                  <li>
                    <a href={ENDPOINTS.manifest}>{ENDPOINTS.manifest}</a> — web app manifest
                  </li>
                </ul>
              </div>
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Frequently asked</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  {FAQS.map((faq) => (
                    <li key={faq.question}>{faq.question}</li>
                  ))}
                </ul>
                <p className="small muted" style={{ marginTop: "0.9rem", marginBottom: 0 }}>
                  Full answers are in this page&apos;s <code>FAQPage</code> structured data.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
