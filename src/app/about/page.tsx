import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { Picture } from "@/components/Picture";
import { SameAsList, AuthorCard } from "@/components/AuthorCard";
import { SpecList } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, PERSON, SAME_AS, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, personNode, organizationNode } from "@/lib/schema";

const PATH = "/about/";
const TITLE = "About George S. Thomas — operator and builder";
const DESCRIPTION =
  "George S. Thomas (Thomu) is a student and operator of the Nedumpurath Group (NKT Group) in Thodupuzha, Kerala, building EV charging, homelab and AI systems.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-about.jpg",
  ogImageAlt: "About George S. Thomas — operator of the Nedumpurath Group",
  keywords: [
    "George S. Thomas profile",
    "Thomu Kerala",
    "Nedumpurath Group operator",
    "who is George Nedumpurath",
  ],
});

const trail = buildTrail({ name: "About", path: PATH });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        id="about-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            // ProfilePage is the schema.org type Google expects for a page about a person.
            type: "ProfilePage",
            primaryImage: {
              url: "/images/og/og-about.jpg",
              caption: `Profile of ${PERSON.name}`,
            },
            aboutId: ID.person,
            mainEntityId: ID.person,
            breadcrumbId: ID.breadcrumb(PATH),
            keywords: PERSON.knowsAbout,
          }),
          personNode({ profilePagePath: PATH }),
          organizationNode(),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Profile"
        title="About George S. Thomas"
        lede="I am George S. Thomas — Thomu to most people — a student and operator based in Thodupuzha, Idukki district, Kerala. I run a family business group and build the technical systems around it."
        tags={["Operator", "Builder", "Kerala, India", "Since 1947 family enterprise"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="background">Background</h2>
              <p>
                I grew up inside a business rather than reading about them. The{" "}
                <Link href="/ventures/">Nedumpurath Group</Link> — known as NKT Group — was started
                by my great-grandfather N. K. Thomas in 1947 as a brassware and household trade in
                Thodupuzha, and it has stayed in the family through four generations. My working life
                started there, in stockrooms, ledgers and eventually spreadsheets and dashboards.
              </p>
              <p>
                Alongside that, I am building toward a career in video, filmmaking and technical
                work. The overlap is less strange than it sounds: both are about systems that either
                hold up under load or do not.
              </p>

              <h2 id="what-i-operate">What I operate</h2>
              <p>
                I work across the group&apos;s ventures, with responsibility for day-to-day
                operations and the technology underneath them: {ORGANIZATION.ventures.length} lines of
                business spanning legacy retail, commercial property and a new public EV charging
                site.
              </p>
              <ul>
                <li>
                  <Link href="/ventures/nkt-vessels-house/">NKT Vessels House</Link> — the 1947
                  retail origin of the group, still trading in Thodupuzha.
                </li>
                <li>
                  <Link href="/ventures/nedumpurath-towers/">Nedumpurath Towers</Link> — the
                  group&apos;s commercial property vertical.
                </li>
                <li>
                  <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link> — a public EV charging
                  site launched in 2026, supported by IonGrid as technology and network partner.
                </li>
              </ul>

              <h2 id="what-i-build">What I build</h2>
              <p>
                Everything technical on this site I build myself, with AI assistance in the loop:
              </p>
              <ul>
                <li>
                  <Link href="/work/thomu-lab/">THOMU LAB</Link> — storage arrays, edge nodes and
                  telemetry that keep an eye on the charging site and archive everything else.
                </li>
                <li>
                  <Link href="/work/apex-creator-os/">Apex Creator OS</Link> — the repeatable
                  shoot-to-publish workflow behind my video work.
                </li>
                <li>
                  <Link href="/work/my-ai-os/">My_AI_OS</Link> — the agent orchestration layer and
                  review gates that let one person ship software that behaves.
                </li>
              </ul>

              <h2 id="how-i-work">How I work</h2>
              <p>
                Three habits show up in everything above. First: build for the monsoon — assume the
                power will blink, the humidity will win, and the uplink will drop. Second: monitor
                what you own — if you cannot see the state of a system, you do not operate it, you
                inherit it. Third: write it down — a system that only exists in your head is a
                liability to whoever comes next, including future you.
              </p>
              <p>
                I also use AI tooling heavily and say so. Drafts, scaffolding and research get
                assisted; judgement, verification and responsibility stay with me. Anything I cannot
                verify is left out rather than guessed, which is why some details on this site read
                as pending.
              </p>

              <h2 id="areas">Areas of knowledge</h2>
              <p>
                The topics I can speak about with first-hand experience, and which the structured
                data on this page declares as <code>knowsAbout</code>:
              </p>
              <ul>
                {PERSON.knowsAbout.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>

              <h2 id="location">Where I work from</h2>
              <p>
                {PERSON.locationLabel}. Thodupuzha sits in the midlands of Idukki district — humid,
                green, monsoon-heavy and increasingly well connected. It is an unusual place to run
                infrastructure experiments and a very useful one: if a system survives a Kerala
                monsoon with an unreliable grid, it will survive a lot.
              </p>

              <h2 id="identity-images">Identity and images on this site</h2>
              <p>
                The portrait on this page is a generated identity card, not a photograph, and it says
                so on its face. It will be replaced with a real portrait. The{" "}
                <Link href="/images/brand/monogram.svg">monogram</Link> serves as the site icon, the{" "}
                <a href={url("/images/brand/nkt-group-logo-512.png")}>NKT Group logo</a> is used for
                the organization entity, and every image carries explicit dimensions and alt text so
                nothing shifts while the page loads.
              </p>

              <h2 id="profiles">Verifiable profiles</h2>
              <p>
                These are the accounts that belong to me and are declared as{" "}
                <code>sameAs</code> in this page&apos;s structured data:
              </p>
              <SameAsList />

              <h2 id="contact-me">Contact</h2>
              <p>
                The <Link href="/contact/">contact page</Link> lists the ways to reach me and what I
                typically respond to. For anything about this site&apos;s data handling or your
                rights, see the <Link href="/privacy-policy/">privacy policy</Link>.
              </p>
            </div>

            <aside>
              <Picture
                asset="profilePortrait"
                alt={`Identity card for ${PERSON.name}, ${PERSON.jobTitle}`}
                priority
                sizes="(max-width: 999px) 100vw, 320px"
                width={320}
                height={320}
                style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)" }}
              />
              <div style={{ marginTop: "1.4rem" }}>
                <SpecList
                  items={[
                    { label: "Name", value: PERSON.name },
                    { label: "Also known as", value: PERSON.alternateName.join(", ") },
                    { label: "Role", value: PERSON.jobTitle },
                    { label: "Based in", value: `${PERSON.address.addressLocality}, ${PERSON.address.addressRegion}` },
                    { label: "Country", value: "India" },
                    { label: "Organization", value: ORGANIZATION.name },
                    { label: "Languages", value: "English, Malayalam" },
                    { label: "Public email", value: "See contact page" },
                  ]}
                />
              </div>
              <p className="small muted" style={{ marginTop: "1rem" }}>
                Same details as the <code>Person</code> and <code>ProfilePage</code> JSON-LD on this
                page — visible copy and machine-readable data are kept in sync deliberately.
              </p>
            </aside>
          </div>

          <AuthorCard />
        </div>
      </section>
    </>
  );
}
