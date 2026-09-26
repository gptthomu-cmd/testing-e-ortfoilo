import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { VentureCard } from "@/components/Cards";
import { Picture } from "@/components/Picture";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, PERSON } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, organizationNode, itemListNode } from "@/lib/schema";

const PATH = "/ventures/";
const TITLE = "Ventures — NKT Group, Thodupuzha, Kerala";
const DESCRIPTION =
  "NKT Group (Nedumpurath Group) operates NKT Vessels House, Nedumpurath Towers and NKT Charge Hub in Thodupuzha, Kerala — retail, property and EV charging since 1947.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-ventures.jpg",
  ogImageAlt: "NKT Group ventures in Idukki district, Kerala",
  keywords: [
    "NKT Group",
    "Nedumpurath Group",
    "Thodupuzha businesses",
    "N.K.T. Vessels House",
    "Nedumpurath Towers",
    "NKT Charge Hub",
  ],
});

const trail = buildTrail({ name: "Ventures", path: PATH });

const TIMELINE = [
  {
    year: "1947",
    title: "Generational roots",
    copy: "N. K. Thomas establishes N.K.T. Vessels House in Thodupuzha, which becomes a landmark for brassware and household goods across Idukki district.",
  },
  {
    year: "2010s",
    title: "Expansion era",
    copy: "Commercial real estate and property management grow alongside retail, including Nedumpurath Towers.",
  },
  {
    year: "2026",
    title: "Green infrastructure",
    copy: "NKT Charge Hub opens as a public EV charging site with IonGrid as technology and network partner.",
  },
  {
    year: "Next",
    title: "Digital operations",
    copy: "Monitoring, telemetry and documentation move in-house so each venture can be operated from one dashboard.",
  },
];

export default function VenturesPage() {
  return (
    <>
      <JsonLd
        id="ventures-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "CollectionPage",
            primaryImage: { url: "/images/og/og-ventures.jpg", caption: "NKT Group ventures" },
            aboutId: ID.organization,
            mainEntityId: ID.organization,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          organizationNode(),
          itemListNode(
            PATH,
            "NKT Group ventures",
            ORGANIZATION.ventures.map((venture) => ({
              name: venture.name,
              path: venture.path,
              description: venture.description,
            })),
          ),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow={`${ORGANIZATION.name} · Est. ${ORGANIZATION.foundingDate}`}
        title="Four generations of enterprise in Idukki district"
        lede={ORGANIZATION.description}
        tags={["Thodupuzha, Kerala", "Retail since 1947", "Commercial property", "EV charging 2026"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {ORGANIZATION.ventures.map((venture) => (
              <VentureCard
                key={venture.path}
                name={venture.name}
                path={venture.path}
                eyebrow={venture.name === "NKT Charge Hub" ? "Infrastructure · 2026" : "Established"}
                summary={venture.description}
                status={
                  venture.name === "NKT Charge Hub"
                    ? "Public charging site"
                    : venture.name === "NKT Vessels House"
                      ? "Trading since 1947"
                      : "Property management"
                }
                statusVariant={venture.name === "NKT Charge Hub" ? "live" : "legacy"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="the-group">The group</h2>
              <p>
                <strong>{ORGANIZATION.legalName}</strong> — commonly called NKT Group — is a family
                business portfolio based in {ORGANIZATION.address.addressLocality},{" "}
                {ORGANIZATION.address.addressRegion}. It was founded in{" "}
                {ORGANIZATION.foundingDate} by {ORGANIZATION.founderName} and has operated
                continuously in the region since.
              </p>
              <p>
                The group&apos;s businesses are deliberately unglamorous and long-lived: a retail
                storefront that has traded for more than seventy-five years, commercial property that
                is leased and maintained rather than flipped, and now an infrastructure venture in
                electric mobility. What connects them is geography and patience — they are all
                anchored in the same district, and they are all operated rather than speculated on.
              </p>

              <h3 id="operations">How the group is run today</h3>
              <p>
                Day-to-day operation sits with the family, and{" "}
                <Link href="/about/">{PERSON.name}</Link> leads the technology side: telemetry,
                monitoring, documentation and the software that ties the ventures together. That
                includes the systems described in <Link href="/work/">the project pages</Link>, which
                exist partly because these businesses needed them.
              </p>

              <h2 id="local-information">Local and business information</h2>
              <p>
                Publicly listed details about the group are kept in one place so they stay accurate.
                Anything not confirmed for public use is left blank rather than guessed.
              </p>
              <ul>
                <li>
                  <strong>Locality:</strong> {ORGANIZATION.address.addressLocality},{" "}
                  {ORGANIZATION.address.addressRegion}, India
                </li>
                <li>
                  <strong>Area served:</strong> {ORGANIZATION.areaServed}
                </li>
                <li>
                  <strong>Founded:</strong> {ORGANIZATION.foundingDate} by {ORGANIZATION.founderName}
                </li>
                <li>
                  <strong>Ventures:</strong>{" "}
                  {ORGANIZATION.ventures.map((venture, index) => (
                    <span key={venture.path}>
                      {index > 0 ? ", " : ""}
                      <Link href={venture.path}>{venture.name}</Link>
                    </span>
                  ))}
                </li>
                <li>
                  <strong>Enquiries:</strong> via the <Link href="/contact/">contact page</Link>
                </li>
              </ul>
              <p className="note">
                Street addresses, telephone numbers and registration identifiers are omitted until
                they are confirmed for publication. If you need to reach a specific venture, use the{" "}
                <Link href="/contact/">contact page</Link> and your message will be routed.
              </p>

              <h2 id="timeline">Timeline</h2>
              <p>Four generations, with the technology layer arriving last:</p>
            </div>

            <aside>
              <Picture
                asset="nktGroupLogo"
                alt="NKT Group logo mark — hexagonal NKT monogram with the founding year 1947"
                sizes="(max-width: 999px) 100vw, 320px"
                width={320}
                height={320}
                style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)" }}
              />
              <p className="small muted" style={{ marginTop: "0.8rem" }}>
                The NKT Group mark, also declared as the <code>logo</code> of the{" "}
                <code>Organization</code> entity in structured data and used for brand search
                results.
              </p>
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Entity details</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Name:</strong> {ORGANIZATION.name}
                  </li>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Also known as:</strong>{" "}
                    {ORGANIZATION.alternateName.join(", ")}
                  </li>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Founded:</strong>{" "}
                    {ORGANIZATION.foundingDate}
                  </li>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Founder:</strong>{" "}
                    {ORGANIZATION.founderName}
                  </li>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Location:</strong>{" "}
                    {ORGANIZATION.address.addressLocality}, {ORGANIZATION.address.addressRegion}
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="grid grid-4" style={{ marginTop: "2rem" }}>
            {TIMELINE.map((item) => (
              <div className="card" key={item.year}>
                <div className="card-meta">
                  <span>{item.year}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="prose">
            <h2 id="continue">Continue reading</h2>
            <ul>
              <li>
                <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link> — the public charging
                site, with specifications and frequently asked questions.
              </li>
              <li>
                <Link href="/ventures/nkt-vessels-house/">NKT Vessels House</Link> — the retail origin
                of the group.
              </li>
              <li>
                <Link href="/ventures/nedumpurath-towers/">Nedumpurath Towers</Link> — commercial
                property operations.
              </li>
              <li>
                <Link href="/about/">About {PERSON.name}</Link> — who operates these ventures.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
