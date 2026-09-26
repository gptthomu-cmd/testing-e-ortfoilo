import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Picture } from "@/components/Picture";
import { ArticleCard, ProjectCard, StatGrid, VentureCard } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, PERSON, SITE, url, CHARGE_HUB } from "@/lib/site";
import { graph, webPageNode, personNode, itemListNode } from "@/lib/schema";
import { PROJECTS } from "@/content/projects";
import { ARTICLES_BY_DATE } from "@/content/articles";

const PATH = "/";
const TITLE = "George S. Thomas (Thomu) — operator and builder in Kerala";
const DESCRIPTION =
  "George S. Thomas (Thomu) operates the Nedumpurath Group (NKT Group) in Thodupuzha, Kerala, and builds NKT Charge Hub, THOMU LAB, Apex Creator OS and My_AI_OS.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "George S. Thomas",
    "Thomu",
    "NKT Group Kerala",
    "NKT Charge Hub",
    "EV charging Thodupuzha",
    "portfolio Kerala",
  ],
  ogImage: "/images/og/og-default.jpg",
  ogImageAlt: "George S. Thomas — operator, builder and digital architect in Thodupuzha, Kerala",
  titleAbsolute: true,
});

export default function HomePage() {
  const featured = PROJECTS;
  const latest = ARTICLES_BY_DATE.slice(0, 3);

  return (
    <>
      <JsonLd
        id="home-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "WebPage",
            primaryImage: {
              url: "/images/og/og-default.jpg",
              caption: "George S. Thomas — operator, builder, digital architect",
            },
            aboutId: ID.person,
            mainEntityId: ID.person,
            keywords: SITE.keywords,
          }),
          itemListNode(PATH, "Featured projects and ventures", [
            ...featured.map((p) => ({ name: p.name, path: `/work/${p.slug}/`, description: p.tagline })),
            ...ORGANIZATION.ventures.map((v) => ({ name: v.name, path: v.path, description: v.description })),
          ]),
        )}
      />

      <section className="page-hero hero-grid-bg">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Thodupuzha · Idukki · Kerala</p>
              <h1>George S. Thomas (Thomu) — operator, builder and digital architect in Kerala</h1>
              <p className="lede">
                I run my family&apos;s business group by day and build infrastructure the rest of the
                time: a public EV charging site, a homelab that watches it, AI tooling that helps me
                ship, and the systems that connect all three. This site is the public record of that
                work.
              </p>
              <div className="btn-row">
                <Link className="btn btn-primary" href="/work/">
                  See the projects
                </Link>
                <Link className="btn" href="/ventures/nkt-charge-hub/">
                  NKT Charge Hub
                </Link>
                <Link className="btn" href="/about/">
                  About me
                </Link>
              </div>
              <div className="tag-row" style={{ marginTop: "1.8rem" }}>
                <span className="tag tag-accent">Est. 1947 family enterprise</span>
                <span className="tag">EV charging</span>
                <span className="tag">Homelab &amp; edge</span>
                <span className="tag">AI tooling</span>
                <span className="tag">Creator systems</span>
              </div>
            </div>

            <div>
              <Picture
                asset="profilePortrait"
                alt={`Identity card for ${PERSON.name}, ${PERSON.jobTitle}`}
                priority
                sizes="(max-width: 999px) 100vw, 380px"
                width={380}
                height={380}
                style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)" }}
              />
              <p className="small muted" style={{ marginTop: "0.7rem" }}>
                Identity mark — a real photograph replaces this placeholder once it is ready. The{" "}
                <Link href="/images/brand/monogram.svg">monogram</Link> is the site&apos;s icon set.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Verified facts, not adjectives</p>
          <h2>At a glance</h2>
          <p className="lede" style={{ marginBottom: "2rem" }}>
            Everything stated here can be checked elsewhere on this site. Where a number is not yet
            confirmed — charging tariffs, for example — it is left out rather than estimated.
          </p>
          <StatGrid
            items={[
              { label: "Family enterprise since", value: "1947" },
              { label: "Generations operating", value: "4" },
              { label: "Group ventures", value: "3" },
              { label: "Documented build projects", value: "3" },
            ]}
          />
          <div className="grid grid-3" style={{ marginTop: "2rem" }}>
            <article className="card">
              <h3>I operate</h3>
              <p className="muted small">
                The <Link href="/ventures/">NKT Group</Link> — a family business portfolio in
                Thodupuzha spanning retail trade, commercial property and, since 2026, a public EV
                charging network.
              </p>
            </article>
            <article className="card">
              <h3>I build</h3>
              <p className="muted small">
                Storage and edge systems in <Link href="/work/thomu-lab/">THOMU LAB</Link>, creator
                workflows in <Link href="/work/apex-creator-os/">Apex Creator OS</Link>, and an AI
                orchestration layer in <Link href="/work/my-ai-os/">My_AI_OS</Link>.
              </p>
            </article>
            <article className="card">
              <h3>I document</h3>
              <p className="muted small">
                Field notes in the <Link href="/blog/">writing section</Link> and a public{" "}
                <Link href="/search-console-monitoring/">search monitoring playbook</Link> for how
                this site is measured.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Projects</p>
          <h2>Systems I have built and can explain</h2>
          <p className="lede" style={{ marginBottom: "2rem" }}>
            Each project page covers what the system does, how it is put together and what is still
            unfinished. Pick one to read the engineering, or{" "}
            <Link href="/work/">browse all projects</Link>.
          </p>
          <div className="grid grid-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Organization</p>
          <h2>{ORGANIZATION.name} ventures in Idukki district</h2>
          <p className="lede" style={{ marginBottom: "2rem" }}>
            {ORGANIZATION.description} The newest venture,{" "}
            <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link>, is a public charging site
            with {CHARGE_HUB.bays} DC fast-charging bays, supported by{" "}
            {CHARGE_HUB.networkPartner} as technology and network partner.
          </p>
          <div className="grid grid-3">
            {ORGANIZATION.ventures.map((venture) => (
              <VentureCard
                key={venture.path}
                name={venture.name}
                path={venture.path}
                eyebrow={venture.name === "NKT Charge Hub" ? "Infrastructure · 2026" : "Established"}
                summary={venture.description}
                status={venture.name === "NKT Charge Hub" ? "Opened 2026" : "Operating"}
                statusVariant={venture.name === "NKT Charge Hub" ? "live" : "ongoing"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Writing</p>
          <h2>Field notes from building in Kerala</h2>
          <p className="lede" style={{ marginBottom: "2rem" }}>
            Practical write-ups on charging infrastructure, storage systems and working with AI
            agents. All of it on the <Link href="/blog/">blog index</Link>, with{" "}
            <a href="/feed.xml">RSS</a> available.
          </p>
          <div className="grid grid-3">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">This site</p>
              <h2>Who publishes it, and where the information comes from</h2>
              <p>
                Published by <strong>{PERSON.name}</strong> as an individual, from{" "}
                {PERSON.locationLabel}. Content describes businesses and projects operated by the{" "}
                <Link href="/ventures/">NKT Group</Link>. Nothing here is an offer, a quotation or
                professional advice — see the <Link href="/terms/">terms and disclaimer</Link>.
              </p>
              <p>
                Pages are written or reviewed by me personally, with AI assistance used for drafting
                and scaffolding and disclosed on the <Link href="/terms/">terms page</Link>.
                Corrections are welcome via the <Link href="/contact/">contact page</Link>.
              </p>
              <ul className="small muted">
                <li>
                  <strong style={{ color: "var(--ink)" }}>Location:</strong>{" "}
                  {PERSON.locationLabel}
                </li>
                <li>
                  <strong style={{ color: "var(--ink)" }}>Organization:</strong>{" "}
                  {ORGANIZATION.legalName}, operating since {ORGANIZATION.foundingDate}
                </li>
                <li>
                  <strong style={{ color: "var(--ink)" }}>Public profiles:</strong>{" "}
                  <a href="https://github.com/gptthomu-cmd" rel="me noopener" target="_blank">
                    GitHub
                  </a>
                  {" · "}
                  <a
                    href="https://www.instagram.com/george.s.thomas/"
                    rel="me noopener"
                    target="_blank"
                  >
                    Instagram
                  </a>
                  {" · "}
                  <a
                    href="https://www.linkedin.com/in/george-s-thomas-a64b91405/"
                    rel="me noopener"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>Site index</h3>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    <Link href="/about/">About George S. Thomas</Link>
                  </li>
                  <li>
                    <Link href="/work/">Projects</Link>: <Link href="/work/thomu-lab/">THOMU LAB</Link>,{" "}
                    <Link href="/work/apex-creator-os/">Apex Creator OS</Link>,{" "}
                    <Link href="/work/my-ai-os/">My_AI_OS</Link>
                  </li>
                  <li>
                    <Link href="/ventures/">Ventures</Link>:{" "}
                    <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link>,{" "}
                    <Link href="/ventures/nkt-vessels-house/">NKT Vessels House</Link>,{" "}
                    <Link href="/ventures/nedumpurath-towers/">Nedumpurath Towers</Link>
                  </li>
                  <li>
                    <Link href="/blog/">Writing</Link> ·{" "}
                    <Link href="/search-console-monitoring/">Search monitoring</Link> ·{" "}
                    <Link href="/contact/">Contact</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy/">Privacy Policy</Link> ·{" "}
                    <Link href="/terms/">Terms</Link> · <Link href="/cookies/">Cookies</Link> ·{" "}
                    <Link href="/sitemap.xml">XML sitemap</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Let&apos;s build something tangible</h2>
          <p className="lede">
            Open to selected collaborations on charging infrastructure, systems work and editorial
            projects. Start with the <Link href="/contact/">contact page</Link>.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/contact/">
              Get in touch
            </Link>
            <a className="btn" href={url("/feed.xml")}>
              Subscribe via RSS
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
