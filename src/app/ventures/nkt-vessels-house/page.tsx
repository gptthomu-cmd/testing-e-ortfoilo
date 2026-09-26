import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { SpecList } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, organizationNode } from "@/lib/schema";

const PATH = "/ventures/nkt-vessels-house/";
const TITLE = "NKT Vessels House — retail trade since 1947";
const DESCRIPTION =
  "N.K.T. Vessels House is the 1947 retail origin of the NKT Group in Thodupuzha, Kerala — brassware and household trade that grew into four generations of enterprise.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-nkt-vessels-house.jpg",
  ogImageAlt: "NKT Vessels House — retail trade in Thodupuzha since 1947",
  keywords: [
    "NKT Vessels House",
    "N.K.T. Vessels House Thodupuzha",
    "brassware Kerala",
    "household trade Idukki",
  ],
});

const trail = buildTrail(
  { name: "Ventures", path: "/ventures/" },
  { name: "NKT Vessels House", path: PATH },
);

export default function VesselsHousePage() {
  return (
    <>
      <JsonLd
        id="vessels-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "WebPage",
            primaryImage: {
              url: "/images/og/og-nkt-vessels-house.jpg",
              caption: "NKT Vessels House",
            },
            aboutId: `${url(PATH)}#organization`,
            mainEntityId: `${url(PATH)}#organization`,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          {
            ...organizationNode(),
            "@id": `${url(PATH)}#organization`,
            "@type": ["Organization", "Store"],
            name: "N.K.T. Vessels House",
            legalName: "N.K.T. Vessels House",
            foundingDate: "1947",
            founder: { "@type": "Person", name: ORGANIZATION.founderName },
            parentOrganization: { "@id": ID.organization },
            url: url(PATH),
            description:
              "Legacy retail business established in 1947 in Thodupuzha, Kerala, trading in brassware and household goods.",
            logo: { "@id": ID.logo },
            address: {
              "@type": "PostalAddress",
              addressLocality: ORGANIZATION.address.addressLocality,
              addressRegion: ORGANIZATION.address.addressRegion,
              addressCountry: "IN",
            },
            areaServed: { "@type": "AdministrativeArea", name: ORGANIZATION.areaServed },
            employee: { "@id": ID.person },
          },
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Venture · Established 1947"
        title="NKT Vessels House"
        lede="The storefront where the family business began: brassware and household goods, traded in Thodupuzha since 1947, and still the group's retail anchor."
        tags={["Retail", "Since 1947", "Thodupuzha", "Idukki district"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="origins">Origins</h2>
              <p>
                In 1947, {ORGANIZATION.founderName} established N.K.T. Vessels House in Thodupuzha
                — a retail store trading brassware and household goods. In post-independence Kerala
                that trade was essential rather than decorative: vessels, cookware and everyday
                household items were bought once and used for decades, and the shop that stocked them
                reliably became a place people returned to for a generation.
              </p>
              <p>
                That storefront became the commercial foundation for everything the{" "}
                <Link href="/ventures/">NKT Group</Link> does today. The group&apos;s name is carried
                from those initials, and the retail business has continued without interruption for
                more than seventy-five years — through currency changes, supply disruptions,
                regulation and the shift to organised retail.
              </p>

              <h2 id="today">The business today</h2>
              <p>
                NKT Vessels House continues to trade in Thodupuzha as the group&apos;s retail
                operation, specialising in vessel and household trade. Its role inside the group is
                both commercial and structural: it holds the physical footprint and the customer
                relationships that later ventures — including{" "}
                <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link> — have been built on.
              </p>
              <h3 id="why-it-matters">Why a 1947 shop still matters</h3>
              <ul>
                <li>
                  <strong>Trust compounds.</strong> A business that has served the same district for
                  four generations starts from a different baseline than a new entrant.
                </li>
                <li>
                  <strong>Physical presence is infrastructure.</strong> A long-established storefront
                  is a location, a relationship with local regulations, and a reason customers pass
                  by.
                </li>
                <li>
                  <strong>Operating discipline transfers.</strong> Retail teaches stock control,
                  margins and customer service — the same skills that running a charging site depends
                  on.
                </li>
              </ul>

              <h2 id="documentation">What is published here, and what is not</h2>
              <p>
                This page is a factual, non-promotional record of the venture for the group&apos;s
                public presence. It intentionally does not include pricing, catalogue details,
                internal contact numbers or anything else that would age badly or expose the business
                to unnecessary contact. For anything commercial, use the{" "}
                <Link href="/contact/">contact page</Link> and the enquiry will be routed.
              </p>
              <p className="note">
                Nothing on this page is an offer, advertisement or invitation to purchase — see the{" "}
                <Link href="/terms/">terms and disclaimer</Link>.
              </p>
            </div>

            <aside>
              <SpecList
                items={[
                  { label: "Legal name", value: "N.K.T. Vessels House" },
                  { label: "Established", value: "1947" },
                  { label: "Founder", value: ORGANIZATION.founderName },
                  { label: "Sector", value: "Retail — vessel and household trade" },
                  { label: "Locality", value: ORGANIZATION.address.addressLocality },
                  { label: "District", value: "Idukki, Kerala" },
                  { label: "Parent group", value: ORGANIZATION.name },
                  { label: "Trading status", value: "Continuing" },
                  { label: "Street address", value: "" },
                  { label: "Public telephone", value: "" },
                ]}
              />
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Related pages</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    <Link href="/ventures/">All ventures</Link> — the group overview and timeline
                  </li>
                  <li>
                    <Link href="/ventures/nedumpurath-towers/">Nedumpurath Towers</Link> — commercial
                    property
                  </li>
                  <li>
                    <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub</Link> — charging
                    infrastructure
                  </li>
                  <li>
                    <Link href="/about/">About {ORGANIZATION.founderName.split(" ")[0]}&apos;s
                    great-grandson</Link> — who runs the group today
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
