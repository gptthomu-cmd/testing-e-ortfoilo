import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { ProjectCard } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, itemListNode } from "@/lib/schema";
import { PROJECTS } from "@/content/projects";

const PATH = "/work/";
const TITLE = "Projects — THOMU LAB, Apex Creator OS, My_AI_OS";
const DESCRIPTION =
  "Engineering project pages for THOMU LAB homelab systems, the Apex Creator OS video workflow and My_AI_OS AI agent orchestration — built and documented in Kerala.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-work.jpg",
  ogImageAlt: "THOMU LAB, Apex Creator OS and My_AI_OS project pages",
  keywords: [
    "THOMU LAB",
    "Apex Creator OS",
    "My_AI_OS",
    "homelab projects",
    "AI agent orchestration",
    "creator workflow",
  ],
});

const trail = buildTrail({ name: "Work", path: PATH });

export default function WorkIndexPage() {
  return (
    <>
      <JsonLd
        id="work-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "CollectionPage",
            primaryImage: { url: "/images/og/og-work.jpg", caption: "Project index" },
            aboutId: ID.person,
            mainEntityId: `${url(PATH)}#itemlist`,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          itemListNode(
            PATH,
            "Engineering projects by George S. Thomas",
            PROJECTS.map((project) => ({
              name: project.name,
              path: `/work/${project.slug}/`,
              description: project.summary,
            })),
          ),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Projects"
        title="Systems I build, documented properly"
        lede="Three projects, each with a page that explains the problem, the architecture, the trade-offs and what is still unfinished. No screenshots of things that do not exist."
        tags={["Homelab & edge", "Creator systems", "AI tooling"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="prose">
            <h2 id="how-these-pages-are-written">How these project pages are written</h2>
            <p>
              Each page follows the same structure so it can be compared with the others: what the
              system is, how it is put together, the principles that keep it honest, and what is
              next. Where a detail is not yet decided or not yet safe to publish — a tariff, a
              capacity figure, a customer name — the page says so instead of inventing something
              plausible.
            </p>
            <p>
              That restraint is deliberate. A fabricated metric on a project page is worse than an
              empty one, because it survives into every downstream summary, quotation and pitch that
              cites it.
            </p>

            <h2 id="related">Related pages</h2>
            <ul>
              <li>
                <Link href="/ventures/">Ventures</Link> — the businesses these systems support,
                including <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link>.
              </li>
              <li>
                <Link href="/blog/">Writing</Link> — field notes on the same systems, including{" "}
                <Link href="/blog/zfs-homelab-in-kerala-humidity/">
                  running a ZFS homelab through a monsoon
                </Link>
                .
              </li>
              <li>
                <Link href="/about/">About</Link> — who builds and maintains these systems.
              </li>
              <li>
                <Link href="/search-console-monitoring/">Search monitoring</Link> — how this site&apos;s
                performance is watched and reported.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
