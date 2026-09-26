/**
 * Project content for /work/<slug>/ pages.
 *
 * Bodies are authored as HTML so they can carry real headings (H2/H3), internal
 * links and lists — all of which the SEO checker inspects. Headings must have
 * explicit `id` attributes so the on-page navigation and `heading` anchors work.
 */

export type Project = {
  slug: string;
  name: string;
  /** Short label used in cards and breadcrumbs. */
  kicker: string;
  tagline: string;
  /** 120–158 character summary used as the unique meta description. */
  summary: string;
  status: string;
  year: string;
  stack: string[];
  /** schema.org type used for this project's structured data. */
  schemaType: "SoftwareApplication" | "Project" | "WebApplication";
  applicationCategory?: string;
  operatingSystem?: string;
  codeRepository?: string;
  keywords: string[];
  ogImage: string;
  /** Page body — H2/H3 headings, internal links and lists. */
  body: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "thomu-lab",
    name: "THOMU LAB",
    kicker: "Research & build lab",
    tagline: "A private engineering lab in Thodupuzha for storage, edge and energy systems.",
    summary:
      "THOMU LAB is the personal research lab behind NKT Charge Hub telemetry: ZFS storage arrays, Raspberry Pi edge nodes and local AI agents in Kerala.",
    status: "Active — ongoing builds",
    year: "2025 — present",
    stack: [
      "ZFS",
      "Debian",
      "Raspberry Pi 5",
      "MQTT",
      "Docker",
      "Tailscale",
      "Grafana",
      "OCPP 1.6J",
    ],
    schemaType: "Project",
    keywords: [
      "THOMU LAB",
      "homelab Kerala",
      "ZFS storage array",
      "Raspberry Pi edge telemetry",
      "EV charger monitoring",
      "local AI agents",
    ],
    ogImage: "/images/og/og-thomu-lab.jpg",
    body: `
<p class="article-lede">THOMU LAB is where the experiments happen before they touch a live business. It is a physical rack in Thodupuzha plus the software around it: storage arrays that have to survive Kerala humidity and monsoon power cuts, edge nodes that talk to charging hardware, and local AI agents that help me build software faster.</p>

<h2 id="what-it-is">What THOMU LAB actually is</h2>
<p>The lab is deliberately unglamorous. It is a single rack with redundant power, a primary storage array, a pair of edge nodes, and a set of scripts. What makes it useful is not the hardware — it is that every experiment has a real consumer. When I learn something in the lab, it lands in one of three places: the <a href="/ventures/nkt-charge-hub/">NKT Charge Hub</a> forecourt, a creator workflow, or a piece of software I am building.</p>

<h3 id="storage-layer">The storage layer</h3>
<p>A multi-bay ZFS pool is the backbone. ZFS was chosen for the properties that matter in a tropical climate and an unreliable grid: checksummed writes, cheap snapshots, and scrubbing that tells you when a disk is quietly lying to you. The pool holds raw camera footage, charge-station logs and configuration backups.</p>
<ul>
  <li><strong>Integrity first:</strong> checksums on every block, scheduled scrubs and email alerts on any non-zero error count.</li>
  <li><strong>Snapshots over sync:</strong> point-in-time snapshots before every risky change, replicated off-rack on a schedule.</li>
  <li><strong>Power honesty:</strong> the array reports its own health to the dashboard, so a failing PSU is visible before it becomes a dead pool.</li>
</ul>

<h3 id="edge-layer">The edge layer</h3>
<p>Raspberry Pi class machines sit between the physical world and the dashboard. One node reads charge-point telemetry and site conditions; another is a jump host for remote maintenance. They publish over MQTT, buffer locally when the link drops, and reconcile when it returns. Designing for the offline case first is the whole trick — a charging site that reports nothing because the internet blinked is worse than useless.</p>

<h3 id="software-layer">The software layer</h3>
<p>Everything above is glued together with containers, a private mesh network for remote access, and dashboards that are read from a phone at 11 pm. The same environment runs local AI agents that scaffold code, write documentation and check my work — the workflow described in <a href="/work/my-ai-os/">My_AI_OS</a>.</p>

<h2 id="principles">Design principles</h2>
<ol>
  <li><strong>Build for the monsoon.</strong> Assume power cuts, humidity and a flaky uplink. Redundancy is not paranoia here, it is the baseline.</li>
  <li><strong>One source of truth.</strong> Telemetry lands in one place; dashboards never own state.</li>
  <li><strong>Document as you go.</strong> A lab you cannot hand over is a hobby. Every build gets a runbook with the exact commands that brought it up.</li>
  <li><strong>Ship something real.</strong> If an experiment cannot be traced to a live site or a shipped artefact within a quarter, it gets cut.</li>
</ol>

<h2 id="why-it-matters">Why a lab matters for an EV charging business</h2>
<p>Charging infrastructure is a physical business with a software problem inside it. A charger that is online but mis-reporting looks identical to a charger that is offline, and the customer only sees the consequence. Owning the monitoring layer — rather than renting it entirely from a vendor — is how a small operator keeps the ability to answer the question <em>"is bay two healthy right now?"</em> without waiting on a support ticket.</p>
<p>The lab is also where the boring competencies live: structured cabling, UPS sizing, thermal management, log retention. None of it is exciting. All of it is the difference between a pilot and a service.</p>

<h2 id="next">What is next</h2>
<p>The next cycle is about tightening the loop between the forecourt and the dashboard: better anomaly detection on charging sessions, a cleaner public status view, and a documented handover pack so the systems survive me being unavailable. Details of what is publicly verifiable are on the <a href="/ventures/nkt-charge-hub/">NKT Charge Hub page</a>.</p>

<p class="note">This page describes a personal engineering lab. No client data, customer data or partner-confidential information is published here.</p>
`,
  },
  {
    slug: "apex-creator-os",
    name: "Apex Creator OS",
    kicker: "Creator system",
    tagline: "The operating system I run behind every video: ingest, edit, grade, publish, archive.",
    summary:
      "Apex Creator OS is a repeatable creator workflow for shoot-to-publish video production: proxy ingest, DaVinci Resolve finishing, delivery presets and cold archive.",
    status: "In use — v1 running",
    year: "2025 — present",
    stack: [
      "DaVinci Resolve",
      "Premiere Pro",
      "Sony α mirrorless",
      "Drone capture",
      "H.264/H.265 proxies",
      "LUT pipeline",
      "ZFS archive",
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Windows, macOS",
    keywords: [
      "Apex Creator OS",
      "video editing workflow Kerala",
      "DaVinci Resolve workflow",
      "creator operating system",
      "proxy ingest",
      "Sony alpha color grading",
    ],
    ogImage: "/images/og/og-apex-creator-os.jpg",
    body: `
<p class="article-lede">Apex Creator OS is not a product you install. It is the system I follow so that a shoot becomes a published video without the usual chaos: one folder convention, one proxy pipeline, one grading decision, one set of delivery presets, one archive rule.</p>

<h2 id="problem">The problem it solves</h2>
<p>Editing fatigue is rarely creative. It is administrative. Files named <code>final_final_v2.mp4</code>, colour that drifts between clips because each one was graded from scratch, exports that need redoing because the aspect ratio was wrong, and footage that lives only on one drive until the drive dies. Apex Creator OS replaces those decisions with defaults.</p>

<h2 id="pipeline">The pipeline</h2>

<h3 id="stage-1-capture">Stage 1 — Capture with a preset</h3>
<p>Every shoot uses the same picture profile and white balance discipline so footage from different days still cuts together. Camera bodies live in a humidity-controlled dry cabinet — a non-negotiable in Kerala, where fungal growth on lens elements is a real risk rather than a theoretical one.</p>

<h3 id="stage-2-ingest">Stage 2 — Ingest and proxy</h3>
<ul>
  <li>Footage is copied to the working pool, then verified by checksum before the card is formatted.</li>
  <li>Proxies are generated automatically, so the timeline stays responsive on a laptop.</li>
  <li>Project folder structure and naming are fixed; nothing is decided twice.</li>
</ul>

<h3 id="stage-3-assembly">Stage 3 — Assembly and pacing</h3>
<p>Story first, effects last. Vertical and long-form are cut from the same timeline using different framing guides, so one shoot produces both formats without a second edit.</p>

<h3 id="stage-4-finishing">Stage 4 — Finishing</h3>
<p>Colour is handled through a consistent node order: balance, then look, then delivery-safe trim. Audio gets a fixed chain with loudness targets set per platform, because "it sounded right on my headphones" is not a delivery standard.</p>

<h3 id="stage-5-delivery">Stage 5 — Delivery presets</h3>
<p>Each destination has one preset — social vertical, social landscape, and an archival master. Export settings are never re-derived from memory.</p>

<h3 id="stage-6-archive">Stage 6 — Archive</h3>
<p>Raw footage moves to the ZFS archive with a snapshot and an off-rack replica. Project files and the final master stay on the fast pool. See <a href="/work/thomu-lab/">THOMU LAB</a> for the storage side of that arrangement.</p>

<h2 id="principles">Rules that keep it honest</h2>
<ol>
  <li><strong>One decision, once.</strong> Codec, frame rate, loudness and aspect get decided at setup time, not at export time.</li>
  <li><strong>Nothing is finished until it is archived.</strong> A published file with no archive is a future reshoot.</li>
  <li><strong>Fit the format, not the trend.</strong> Pacing is derived from where the video will be watched.</li>
  <li><strong>Reuse beats invent.</strong> A template that ships is worth more than a plugin that does not.</li>
</ol>

<h2 id="status">Current status and what is next</h2>
<p>Version 1 of the system is running on real work: brand pieces, product footage and short-form edits. The next iteration adds automated proxy queueing, a shot-log that links footage to the timeline, and a review step that tracks client feedback outside of chat threads.</p>
<p>Practical notes from running this pipeline are published on the <a href="/blog/">blog</a>.</p>
`,
  },
  {
    slug: "my-ai-os",
    name: "My_AI_OS",
    kicker: "AI workflow",
    tagline: "A personal AI operating system: agents, memory and guardrails for building software solo.",
    summary:
      "My_AI_OS is my personal AI orchestration layer — agent roles, a memory vault, prompt patterns and review gates for building and shipping software solo.",
    status: "Active — daily driver",
    year: "2026 — present",
    stack: [
      "Agent orchestration",
      "Model Context Protocol",
      "Local models",
      "Vector search",
      "Git hooks",
      "TypeScript",
      "Python",
    ],
    schemaType: "SoftwareApplication",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, Linux, macOS",
    keywords: [
      "My_AI_OS",
      "AI agent orchestration",
      "AI operating system",
      "personal AI workflow",
      "MCP",
      "agentic coding",
    ],
    ogImage: "/images/og/og-my-ai-os.jpg",
    body: `
<p class="article-lede">My_AI_OS is the layer I build with, not a thing I sell. It exists because working solo means every role in a project — architect, implementer, reviewer, writer — has to be played by the same person, and the bottleneck is context switching rather than raw hours.</p>

<h2 id="the-shape">The shape of it</h2>
<p>Four parts, in order of how much they matter:</p>
<ol>
  <li><strong>Agent roles.</strong> Distinct, narrow agents for scoping, implementation, review and documentation. Narrow agents with clean context beat one general assistant with a sprawling thread.</li>
  <li><strong>A memory vault.</strong> Plain files in version control: decisions, conventions, glossary terms and rejected approaches. Retrieval over invention — an agent should read the house style, not guess it.</li>
  <li><strong>Tool access.</strong> Agents touch the filesystem, the shell and the repository through tightly scoped interfaces, with explicit allow-lists per role.</li>
  <li><strong>Review gates.</strong> Nothing merges because an agent said it works. Type checks, builds, an automated SEO/quality gate and a human read are the price of admission.</li>
</ol>

<h2 id="why">Why it is worth the setup cost</h2>
<p>Because the failure mode of agentic development is not bad output — it is confident bad output. A model that invents a metric, a schema property or a file path produces work that looks finished. The guardrails are the product:</p>
<ul>
  <li><strong>Verification over vibes:</strong> every claim about the codebase must be re-checkable by a script.</li>
  <li><strong>Small blast radius:</strong> one agent, one branch, one reviewable diff.</li>
  <li><strong>Deterministic checks:</strong> build, type check, link check and structured-data validation all run without a human in the loop.</li>
  <li><strong>Provenance:</strong> generated content is reviewed and owned by me — see the <a href="/terms/">terms and disclaimer</a>.</li>
</ul>

<h2 id="in-practice">How it shows up in practice</h2>
<p>This website is a worked example. The <a href="/work/">project pages</a> were authored with agents handling scaffolding, copy drafts and SEO plumbing, then reviewed, corrected and rewritten by me. Where a fact was unverifiable it was left out rather than filled in — which is why some fields on this site are deliberately empty.</p>
<p>The same pattern runs the <a href="/ventures/nkt-charge-hub/">Charge Hub</a> monitoring scripts and the reporting that goes with them, and it feeds the creator pipeline in <a href="/work/apex-creator-os/">Apex Creator OS</a>.</p>

<h2 id="limits">Known limits</h2>
<p>Honest list, because this space produces a lot of theatre:</p>
<ul>
  <li>Agents do not understand the business. They understand the repository. Strategy and priority stay human.</li>
  <li>Context windows still lose fights with large codebases; retrieval quality is the limiting factor.</li>
  <li>Anything involving money, legal commitments or customer communication stays out of scope for automation.</li>
  <li>Local hardware is a real constraint for anything beyond small models.</li>
</ul>

<h2 id="next">Next</h2>
<p>Tighter evaluation harnesses so a prompt change can be measured rather than felt, a proper changelog per agent role, and cleaner handover: if I stop, the system should still be legible to whoever picks it up — the same standard I apply to <a href="/work/thomu-lab/">THOMU LAB</a>.</p>
`,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
