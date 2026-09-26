/**
 * Editorial content for /blog/<slug>/ pages.
 *
 * Each post carries a unique title/description, real dates (used by Article
 * schema, Open Graph article tags and sitemap `lastmod`) and an H2/H3 outline.
 * Two posts are sample content published to prove the pipeline end to end —
 * replace or extend them as you write.
 */

export type Article = {
  slug: string;
  title: string;
  /** SEO <title> (the layout adds " | George S. Thomas"). */
  seoTitle: string;
  /** Unique meta description, 120–158 characters. */
  description: string;
  /** Snippet shown on the blog index. */
  dek: string;
  date: string;
  updated?: string;
  readingTime: string;
  tags: string[];
  category: string;
  keywords: string[];
  /** 1200×630 social/hero card. */
  image: string;
  imageAlt: string;
  /** Optional in-article figure (optimised by `npm run images:optimize`). */
  figure?: { src: string; alt: string; caption: string };
  body: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "why-thodupuzha-needed-a-public-dc-fast-charger",
    title: "Why Thodupuzha needed a public DC fast charger",
    seoTitle: "Why Thodupuzha needed a public DC fast charger",
    description:
      "Kerala's EV growth is real but uneven. Notes on why a public DC fast-charging bay in Thodupuzha matters, and what it takes to keep one running.",
    dek: "Highway corridors in Kerala got chargers first. The towns in between got skipped — and that is where a lot of driving actually happens.",
    date: "2026-08-18",
    updated: "2026-09-12",
    readingTime: "6 min read",
    tags: ["EV charging", "Infrastructure", "Kerala", "NKT Charge Hub"],
    category: "Infrastructure",
    keywords: [
      "EV charging Thodupuzha",
      "DC fast charger Kerala",
      "Idukki EV charging",
      "public charging infrastructure India",
    ],
    image: "/images/og/og-thodupuzha-dc-fast-charger.jpg",
    imageAlt: "Technical illustration of a DC fast-charging bay connected to a grid substation",
    figure: {
      src: "/images/generated/charging-bay-diagram.svg",
      alt: "Block diagram of a public charging bay: grid supply, charge controller, power modules, bay",
      caption:
        "A public charging bay is an electrical project with a software skin, not the other way around.",
    },
    body: `
<p class="article-lede">Most conversations about EV charging in India start with the highway. That is understandable — the anxiety is range anxiety, and the fix is a fast charger every hundred kilometres on a long drive. But the trips that make up the majority of kilometres driven around here are not highway trips. They are the twelve-kilometre school run, the market round trip, the hospital visit to a larger town. Those trips get skipped by charging networks because the land is expensive relative to traffic, and because a town of forty thousand people does not look like a market on a spreadsheet.</p>

<h2 id="the-gap">The gap between highway corridors and real driving</h2>
<p>When public charging is planned around corridors, the map develops a hole in the middle. A driver in Thodupuzha heading toward Kochi or Kottayam can plan around chargers on the route. A driver who simply lives here and wants to top up without installing a home charger has no such plan. For anyone in an apartment, that is the entire problem: the car is fine, the charger is missing.</p>
<p>The fix does not have to be exotic. A pair of reliable DC bays in a town centre, well-lit and properly maintained, changes what is possible for local drivers — and it also changes whether an EV is a sensible choice for the next person who is deciding.</p>

<h3 id="why-dc">Why DC and not another AC pillar</h3>
<p>AC charging is cheap to install and perfect for overnight. A public AC pillar, though, assumes a customer who will stay parked for three hours — which is a hotel, or an office, or a home. A shop front is not that. Twenty to forty minutes of DC charging fits the way people actually use a town centre: park, run errands, come back.</p>

<h2 id="what-it-takes">What it actually takes to run a public charger</h2>
<p>The hardware is one line item. The rest is the part that decides whether the bay is usable in month six:</p>
<ul>
  <li><strong>Electrical capacity.</strong> A high-power bay is a load study before it is a purchase order. Peak demand, sanctioned load and transformer headroom all have to line up.</li>
  <li><strong>Site design.</strong> Cable reach, bay length, drainage, lighting and how a driver approaches at night, because people charge in the dark.</li>
  <li><strong>Connectivity with a fallback.</strong> Chargers authenticate against a network. When the uplink drops, the site has to keep behaving predictably instead of bricking.</li>
  <li><strong>Monitoring you own.</strong> If the only signal that a bay is down is a customer phone call, you are not operating a network, you are hosting complaints. This is the layer I build in <a href="/work/thomu-lab/">THOMU LAB</a>.</li>
  <li><strong>Support hours.</strong> Just enough human availability to walk a stranger through a first charge.</li>
</ul>

<h3 id="uptime">Uptime is an operations practice, not a spec sheet</h3>
<p>Every operator quotes an uptime number. The number that matters is what your own telemetry says on a rainy Tuesday, including the sessions that failed and the payment that did not complete. So the first thing we built was not a dashboard for customers — it was a dashboard for us.</p>

<h2 id="nkt-charge-hub">Where NKT Charge Hub fits</h2>
<p><a href="/ventures/nkt-charge-hub/">NKT Charge Hub</a> is our answer to the local gap: a public charging site in Thodupuzha run by NKT Group, with IonGrid as the technology and network partner. Opening it taught a few things that no amount of reading would have:</p>
<ol>
  <li><strong>Education is part of the service.</strong> A meaningful share of first-time users have never charged on a public network. Two minutes of guidance prevents a failed session and a bad review.</li>
  <li><strong>Connector reality beats connector ambition.</strong> What is on the cars in your district matters more than what is on the roadmap globally.</li>
  <li><strong>The site is a business location.</strong> Being where people already stop is worth more than being on a fast road with nothing around it.</li>
  <li><strong>Maintenance is scheduled, not reactive.</strong> Dust, monsoon damp and insects are real failure modes for outdoor power electronics.</li>
</ol>

<h2 id="what-next">What comes next</h2>
<p>Reliability first, then reach. The sequencing matters: a second site is easy to fund and hard to support if the first one is not calmly running itself. Concrete details of the operating site — location, hours and how to find it — live on the <a href="/ventures/nkt-charge-hub/">NKT Charge Hub page</a>, and anything that is still unconfirmed is deliberately absent rather than estimated.</p>
<p class="note">This is an operational perspective from one small site in one district of Kerala, not a market forecast.</p>
`,
  },
  {
    slug: "zfs-homelab-in-kerala-humidity",
    title: "Running a ZFS homelab through a Kerala monsoon",
    seoTitle: "Running a ZFS homelab through a Kerala monsoon",
    description:
      "Practical notes from two years of running a ZFS storage pool in a hot, humid climate: thermal design, power cuts, scrubs and the backups that matter.",
    dek: "Humidity, load shedding and a hot room are not edge cases here. Build the storage array for them, or the array will teach you the hard way.",
    date: "2026-09-05",
    readingTime: "7 min read",
    tags: ["Homelab", "ZFS", "Storage", "Power"],
    category: "Systems",
    keywords: [
      "ZFS homelab",
      "NAS for humid climate",
      "ZFS scrub schedule",
      "UPS for NAS India",
      "homelab Kerala",
    ],
    image: "/images/og/og-zfs-homelab-monsoon.jpg",
    imageAlt: "Technical illustration of a rack: storage array, UPS, edge nodes and network switch",
    figure: {
      src: "/images/generated/rack-diagram.svg",
      alt: "Diagram of a homelab rack showing power, storage, compute and network layers",
      caption:
        "Layer the rack by failure domain: power, storage, compute, network — and give each layer its own alarm.",
    },
    body: `
<p class="article-lede">Advice about homelab storage is usually written for a cool, dry room with stable mains power. My rack lives in Kerala, where the air is unkind to electronics for four months a year and the grid has opinions. Two years of running a ZFS pool in that environment produced a short list of things that actually matter.</p>

<h2 id="heat-and-humidity">Heat and humidity are the real specification</h2>
<p>Disks do not fail because a datasheet said so. They fail because they sat at the top of their temperature range for a year in air that was carrying moisture. Three changes made the most difference:</p>
<ul>
  <li><strong>Airflow over sticker temperature.</strong> A case that keeps drives a few degrees cooler is worth more than one with a better CPU. Front-to-back flow, no recirculation, filters cleaned on a schedule.</li>
  <li><strong>Monitor humidity, not just temperature.</strong> A cheap sensor wired into the rack graph is the difference between noticing a problem and discovering corrosion.</li>
  <li><strong>Accept the dry-season cost.</strong> Dehumidification in the room is cheaper than replacing a disk set.</li>
</ul>

<h3 id="thermal">A thermal bug that cost a disk</h3>
<p>One drive spent six months idling warmer than its peers because of a cable bundle blocking a third of its intake. SMART reported nothing until it reported everything. The lesson was not about SMART; it was that per-drive temperature should be charted and compared against the pool median, not just threshold-checked.</p>

<h2 id="power">Design for the power cut you will actually get</h2>
<p>Short cuts are frequent, and the dangerous ones are the two-second events that make a UPS panic rather than the ten-minute ones that make it useful.</p>
<ol>
  <li><strong>Size the UPS for orderly shutdown,</strong> not for riding out the afternoon.</li>
  <li><strong>Make the NUT (or equivalent) hookup boring and tested.</strong> An untested shutdown script is a rumour.</li>
  <li><strong>Protect the disks, not the rack.</strong> If power is finite, spend it on a clean flush and a clean stop.</li>
  <li><strong>Expect unclean stops anyway.</strong> ZFS will do the right thing on the next import, provided the hardware is not lying about flushes — which is the real argument for a controller that respects write barriers.</li>
</ol>

<h2 id="scrubs">Scrubs, snapshots and the schedule that survives real life</h2>
<p>ZFS gives you data integrity tooling for free and then leaves the discipline to you:</p>
<ul>
  <li><strong>Monthly full scrub</strong> with alerting on any non-zero error count, plus a check that the scrub actually completed.</li>
  <li><strong>Snapshots before every change.</strong> Cheap, instant, and the only rollback that has ever saved me.</li>
  <li><strong>Off-rack replication.</strong> The rule people learn at their own expense: a pool is not a backup.</li>
  <li><strong>Quarterly restore test.</strong> A backup that has never been restored is a belief system.</li>
</ul>

<h3 id="lessons">What the pool is actually for</h3>
<p>Camera footage, project archives, telemetry history and configuration backups — including the monitoring stack that watches the <a href="/ventures/nkt-charge-hub/">charging site</a>. That last one changed my priorities: once a business depends on the lab, "my hobby NAS" is no longer an acceptable description, and slow, documented maintenance beats clever configuration.</p>

<h2 id="checklist">A short checklist</h2>
<ol>
  <li>Chart per-drive temperature and compare against the pool median.</li>
  <li>Log humidity in the rack room.</li>
  <li>Test the UPS shutdown path on a schedule, not on the day it is needed.</li>
  <li>Keep snapshots small and frequent; replica off-rack.</li>
  <li>Write the runbook while the system is healthy.</li>
  <li>Restore something real every quarter.</li>
</ol>
<p>The rest of the lab — edge nodes, sensors and agent tooling — is described on the <a href="/work/thomu-lab/">THOMU LAB project page</a>.</p>
`,
  },
  {
    slug: "shipping-with-ai-agents-review-gates",
    title: "Shipping with AI agents: the review gates that do the work",
    seoTitle: "Shipping with AI agents: the review gates",
    description:
      "Agentic coding fails quietly, not loudly. A practical set of review gates — type checks, builds, link checks, schema validation — that make AI output trustworthy.",
    dek: "The hard part of building with AI agents is not generating code. It is catching the confident, plausible, wrong parts before anyone else does.",
    date: "2026-09-21",
    readingTime: "5 min read",
    tags: ["AI", "Engineering", "Workflow", "My_AI_OS"],
    category: "Engineering",
    keywords: [
      "AI agent workflow",
      "agentic coding review",
      "automated quality gates",
      "SEO validation script",
      "AI code review",
    ],
    image: "/images/og/og-shipping-with-ai-agents.jpg",
    imageAlt: "Diagram of a build pipeline with agent stages and automated review gates",
    body: `
<p class="article-lede">Ask an agent to add a feature and you will usually get something that looks finished. The failure mode is never a syntax error — it is an invented configuration key, a schema property that does not exist, a metric nobody measured, or a link to a page that was never built. Everything compiles. Nothing is true.</p>

<h2 id="failure-mode">The failure mode, precisely</h2>
<p>Model output is optimised to be plausible. In a codebase, plausibility is cheap: a fabricated file path reads exactly like a real one. So the defence is not better prompting, it is making the repository the judge.</p>

<h3 id="gates">Four gates that catch almost everything</h3>
<ol>
  <li><strong>Type check.</strong> <code>tsc --noEmit</code> over the whole project. Cheap, fast, and it kills invented APIs immediately.</li>
  <li><strong>Build.</strong> A production build finds routes that do not compile, imports that do not resolve and pages that export the wrong thing.</li>
  <li><strong>Content invariants.</strong> A script that reads the built output and asserts the rules you care about. For this site: one H1 per page, unique titles and descriptions, canonical present, JSON-LD parses, internal links resolve, sitemap matches the routes that exist.</li>
  <li><strong>Human read.</strong> The shortest step and the one that catches the subtle lie — a claim that is technically well-formed but not true.</li>
</ol>

<h2 id="content-invariants">Writing invariants that are worth having</h2>
<p>An invariant is only useful if failing it is unambiguous. Examples that earn their place:</p>
<ul>
  <li>Every indexable page has exactly one <code>&lt;h1&gt;</code> and it appears before any <code>&lt;h2&gt;</code>.</li>
  <li>No two pages share a title or a meta description.</li>
  <li>Every <code>&lt;img&gt;</code> has non-empty alt text and explicit width/height.</li>
  <li>Every internal link resolves to a file that exists in the build output.</li>
  <li>Every structured-data block parses as JSON and declares <code>@type</code>.</li>
  <li>Every URL in the sitemap is canonical and returns 200.</li>
</ul>
<p>None of these need a framework. A hundred lines of Node reading the build directory will do it, and it runs in seconds.</p>

<h3 id="honesty">The gate that is hard to automate</h3>
<p>Facts. "12,000 sessions served" cannot be type-checked. The only durable fix is a rule about where content comes from: claims must trace to a source, and unknown values stay empty. On this site that rule is visible in the markup — some fields are intentionally blank because nobody has confirmed them yet. A visible gap is a smaller problem than an invented number.</p>

<h2 id="workflow">The workflow that survived contact</h2>
<ol>
  <li>Scope the change in one paragraph, in a file, before any code exists.</li>
  <li>One agent, one branch, one reviewable diff.</li>
  <li>Run the gates before reading the diff, so the diff you read is already plausible-clean.</li>
  <li>Read the diff for truth, not for syntax.</li>
  <li>Commit with a message that explains the decision, not the keystrokes.</li>
</ol>

<h2 id="takeaway">The takeaway</h2>
<p>Agents did not remove the need for engineering judgement here. They moved it: from typing to specifying, and from debugging to verification. If you take one thing from this, take the automated content-invariants step — it converts a whole category of confident nonsense into a failing test, which is the only kind of problem that is easy to fix.</p>
<p>More on the surrounding system is on the <a href="/work/my-ai-os/">My_AI_OS project page</a>.</p>
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Newest first — used by the blog index, the RSS feed and the sitemap. */
export const ARTICLES_BY_DATE = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));

/** RSS 2.0 feed built from the posts, served at /feed.xml. */
export function buildRssFeed(siteUrl: string, siteName: string, description: string): string {
  const items = ARTICLES_BY_DATE.map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${siteUrl}/blog/${a.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/blog/${a.slug}/</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(`${a.date}T06:30:00+05:30`).toUTCString()}</pubDate>
${a.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`,
  ).join("\n");

  const latest = ARTICLES_BY_DATE[0]?.date || "2026-09-21";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} — Writing</title>
    <link>${siteUrl}/blog/</link>
    <description>${escapeXml(description)}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date(`${latest}T06:30:00+05:30`).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
