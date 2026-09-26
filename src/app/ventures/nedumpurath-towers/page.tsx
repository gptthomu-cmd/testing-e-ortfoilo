import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { SpecList, StatGrid } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, organizationNode } from "@/lib/schema";

const PATH = "/ventures/nedumpurath-towers/";
const TITLE = "Nedumpurath Towers — commercial property, Kerala";
const DESCRIPTION =
  "Nedumpurath Towers is the commercial property vertical of the NKT Group in Thodupuzha, Kerala — four leased units providing commercial space in Idukki district.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-nedumpurath-towers.jpg",
  ogImageAlt: "Nedumpurath Towers — commercial property in Thodupuzha",
  keywords: [
    "Nedumpurath Towers",
    "commercial property Thodupuzha",
    "commercial space Idukki",
    "NKT Group real estate",
  ],
});

const trail = buildTrail(
  { name: "Ventures", path: "/ventures/" },
  { name: "Nedumpurath Towers", path: PATH },
);

export default function TowersPage() {
  return (
    <>
      <JsonLd
        id="towers-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "WebPage",
            primaryImage: {
              url: "/images/og/og-nedumpurath-towers.jpg",
              caption: "Nedumpurath Towers",
            },
            aboutId: `${url(PATH)}#organization`,
            mainEntityId: `${url(PATH)}#organization`,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          {
            "@type": ["Organization", "RealEstateAgent"],
            "@id": `${url(PATH)}#organization`,
            name: "Nedumpurath Towers",
            legalName: "Nedumpurath Towers",
            description:
              "Commercial property management vertical of the NKT Group in Thodupuzha, Kerala.",
            parentOrganization: { "@id": ID.organization },
            url: url(PATH),
            logo: { "@id": ID.logo },
            employee: { "@id": ID.person },
            address: {
              "@type": "PostalAddress",
              addressLocality: ORGANIZATION.address.addressLocality,
              addressRegion: ORGANIZATION.address.addressRegion,
              addressCountry: "IN",
            },
            areaServed: { "@type": "AdministrativeArea", name: ORGANIZATION.areaServed },
            knowsAbout: ["Commercial leasing", "Property management", "Commercial real estate"],
          },
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Venture · Real estate management"
        title="Nedumpurath Towers"
        lede="The group's commercial property operation in Thodupuzha: space that is leased, maintained and operated over the long term rather than traded."
        tags={["Commercial property", "Property management", "Thodupuzha", "Idukki district"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="what-it-is">What this venture does</h2>
              <p>
                Nedumpurath Towers is the commercial property arm of the{" "}
                <Link href="/ventures/">NKT Group</Link>. The group owns and manages commercial space
                in Thodupuzha, leasing it to local businesses and maintaining the building stock
                behind it. It anchors the family&apos;s presence in the regional real-estate sector
                alongside the group&apos;s retail heritage at{" "}
                <Link href="/ventures/nkt-vessels-house/">NKT Vessels House</Link>.
              </p>
              <p>
                Property is a patient business, and that suits the group. Rather than acquire and
                exit, the model is to hold, improve and operate: keep the buildings in good condition,
                keep tenants for long terms, and let the asset compound quietly in a district where
                there is genuine demand for reliable commercial space.
              </p>

              <StatGrid
                items={[
                  { label: "Established vertical", value: "2010s" },
                  { label: "Leased units", value: "4" },
                  { label: "Locality", value: "Thodupuzha" },
                  { label: "Model", value: "Own & operate" },
                ]}
              />

              <h2 id="operations">How the property operation runs</h2>
              <ul>
                <li>
                  <strong>Long-term tenancy over churn.</strong> Stability benefits both the tenant
                  and the building.
                </li>
                <li>
                  <strong>Maintenance is scheduled.</strong> Structural, electrical and water systems
                  get planned attention instead of reactive repairs, which keeps tenants in place.
                </li>
                <li>
                  <strong>One operating view.</strong> Maintenance schedules, tenancy dates and
                  utility records are being consolidated digitally — the same approach as the
                  operations documented in <Link href="/work/thomu-lab/">THOMU LAB</Link>.
                </li>
                <li>
                  <strong>Compliance kept current.</strong> Statutory and safety requirements are
                  tracked rather than remembered.
                </li>
              </ul>

              <h2 id="availability">Space availability and enquiries</h2>
              <p>
                Availability changes with tenancy, and this page does not advertise specific units or
                rates. If you are looking for commercial space in Thodupuzha, or you are an existing
                tenant with a maintenance request, use the <Link href="/contact/">contact page</Link>{" "}
                and the enquiry will be routed to the right person.
              </p>
              <p className="note">
                Nothing on this page is an offer, a lease advertisement or a commitment to availability
                — see the <Link href="/terms/">terms and disclaimer</Link>.
              </p>

              <h2 id="the-buildings">About the buildings</h2>
              <p>
                The towers sit within Thodupuzha town, in Idukki district. Detailed information —
                exact address, unit specifications, floor areas, occupier names — is deliberately
                excluded from this page: publishing it would expose tenants and mislead anyone
                reading a snapshot as a current vacancy list. Publicly listed locality details appear
                in the panel beside this text and are mirrored in the{" "}
                <code>Organization</code> structured data for the group.
              </p>
            </div>

            <aside>
              <SpecList
                items={[
                  { label: "Venture type", value: "Commercial property management" },
                  { label: "Parent group", value: ORGANIZATION.name },
                  { label: "Locality", value: ORGANIZATION.address.addressLocality },
                  { label: "District", value: "Idukki, Kerala" },
                  { label: "Country", value: "India" },
                  { label: "Units", value: "4 leased" },
                  { label: "Operating since", value: "2010s" },
                  { label: "Street address", value: "" },
                  { label: "Public telephone", value: "" },
                ]}
              />
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Related pages</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    <Link href="/ventures/">Ventures overview</Link>
                  </li>
                  <li>
                    <Link href="/ventures/nkt-charge-hub/">
                      NKT Charge Hub — charging on the group&apos;s footprint
                    </Link>
                  </li>
                  <li>
                    <Link href="/ventures/nkt-vessels-house/">NKT Vessels House</Link>
                  </li>
                  <li>
                    <Link href="/contact/">Contact</Link>
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
