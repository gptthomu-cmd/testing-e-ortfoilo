import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { SpecList, StatGrid } from "@/components/Cards";
import { Toc } from "@/components/Toc";
import { buildMetadata } from "@/lib/seo";
import { CHARGE_HUB, ID, ORGANIZATION, PERSON, url } from "@/lib/site";
import {
  graph,
  webPageNode,
  breadcrumbNode,
  chargingStationNode,
  faqNode,
  organizationNode,
} from "@/lib/schema";

const PATH = "/ventures/nkt-charge-hub/";
const TITLE = "NKT Charge Hub — EV DC fast charging, Thodupuzha";
const DESCRIPTION =
  "NKT Charge Hub is a public EV DC fast-charging site in Thodupuzha, Kerala, run by NKT Group with IonGrid as technology and network partner. Specs and FAQs.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-nkt-charge-hub.jpg",
  ogImageAlt: "NKT Charge Hub — public DC fast charging in Thodupuzha, Kerala",
  keywords: [
    "NKT Charge Hub",
    "EV charging station Thodupuzha",
    "DC fast charging Kerala",
    "EV charger Idukki",
    "IonGrid",
  ],
});

const trail = buildTrail(
  { name: "Ventures", path: "/ventures/" },
  { name: "NKT Charge Hub", path: PATH },
);

/**
 * FAQs are written so that confirmed facts are stated plainly and unconfirmed
 * ones are labelled as pending. That keeps the FAQPage structured data honest.
 */
const FAQS = [
  {
    question: "Where is NKT Charge Hub located?",
    answer:
      "The site is in Thodupuzha, in Idukki district, Kerala, India — the town where the NKT Group has operated since 1947. The full street address and a map link will be published on this page once they are confirmed for public listing; the locality coordinates are approximately 9.8959° N, 76.7184° E.",
  },
  {
    question: "Who runs NKT Charge Hub?",
    answer:
      "It is operated by NKT Group (Nedumpurath Group), with IonGrid as the technology and network partner providing the charging network and connections. Enquiries are handled through the contact page on this website.",
  },
  {
    question: "What charging hardware does the site use?",
    answer:
      "NKT Charge Hub is built around DC fast charging bays with a peak output of up to 120 kW per bay. The number of bays, connector types and per-bay power split are listed in the specifications table on this page, and any field still marked as pending has not yet been confirmed for publication.",
  },
  {
    question: "How much does a charging session cost?",
    answer:
      "Tariffs are set for the live site and are displayed at the charging bays and in the IonGrid network app. Because pricing changes with network and energy costs, this page does not restate a price: check the rate shown on the charger or in the app before starting a session.",
  },
  {
    question: "Do I need an app, RFID card or membership to charge?",
    answer:
      "Charging is delivered through the IonGrid network, so a session is started using the network's app or card. If you are unsure which method works for your vehicle, contact us through this site before travelling and we will confirm what is available at the site today.",
  },
  {
    question: "Is the charging site open 24 hours?",
    answer:
      "The site is designed for around-the-clock public use, but operational hours can change for maintenance or weather. Confirm current hours before a trip that depends on charging; any change in the default hours will be reflected in the opening-hours field on this page.",
  },
  {
    question: "Are charging sessions and payments covered by this website's privacy policy?",
    answer:
      "No. This website's privacy policy covers browsing this site and contacting us. Charging sessions, payment data and account details are handled by the charge-point network operator under its own privacy terms, which are separate.",
  },
];

const HEADINGS = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "specifications", text: "Specifications", level: 2 },
  { id: "location", text: "Location and access", level: 2 },
  { id: "using-the-site", text: "Using the site", level: 2 },
  { id: "asked", text: "Frequently asked questions", level: 2 },
  { id: "operations", text: "How the site is operated", level: 2 },
  { id: "enquiries", text: "Enquiries", level: 2 },
];

export default function ChargeHubPage() {
  const pending = {
    streetAddress: true,
    tariff: true,
    hours: true,
    connectors: true,
    payment: true,
  };

  return (
    <>
      <JsonLd
        id="charge-hub-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "WebPage",
            primaryImage: {
              url: "/images/og/og-nkt-charge-hub.jpg",
              caption: "NKT Charge Hub — public DC fast charging in Thodupuzha",
            },
            aboutId: ID.chargingStation,
            mainEntityId: ID.chargingStation,
            breadcrumbId: ID.breadcrumb(PATH),
            keywords: ["NKT Charge Hub", "EV charging", "DC fast charging", "Thodupuzha", "Kerala"],
          }),
          chargingStationNode(),
          organizationNode(),
          faqNode(PATH, FAQS),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow={`Infrastructure · Opened ${CHARGE_HUB.opened} · ${ORGANIZATION.name}`}
        title="NKT Charge Hub — public DC fast charging in Thodupuzha"
        lede={CHARGE_HUB.description}
        tags={[
          "Public charging",
          "DC fast charging",
          "Thodupuzha, Kerala",
          `Network partner: ${CHARGE_HUB.networkPartner}`,
        ]}
        actions={
          <>
            <Link className="btn btn-primary" href="/contact/">
              Ask about a session
            </Link>
            <Link className="btn" href="/blog/why-thodupuzha-needed-a-public-dc-fast-charger/">
              Why we built it
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="overview">Overview</h2>
              <p>
                NKT Charge Hub is a public electric-vehicle charging site in Thodupuzha, operated by{" "}
                <Link href="/ventures/">NKT Group</Link> and supported by{" "}
                <strong>{CHARGE_HUB.networkPartner}</strong> as technology and network partner. It
                opened in {CHARGE_HUB.opened} as the group&apos;s move into green infrastructure —
                the fourth generation of a business that started in retail in 1947.
              </p>
              <p>
                The motivation was simple and local. Charging in Kerala grew along highway corridors
                while the towns in between were skipped, and Thodupuzha — where a lot of driving
                actually starts and ends — was one of them. A public DC fast charger in town means a
                driver without a home charger can still own an EV, and a visitor passing through can
                top up without a detour. The longer version of that argument is in{" "}
                <Link href="/blog/why-thodupuzha-needed-a-public-dc-fast-charger/">
                  this article
                </Link>
                .
              </p>

              <StatGrid
                items={[
                  { label: "Peak power per bay", value: `${CHARGE_HUB.maxPowerKw} kW` },
                  { label: "Charge bays", value: pending.connectors ? "2 planned" : String(CHARGE_HUB.bays) },
                  { label: "Charging type", value: "DC fast" },
                  { label: "Opened", value: CHARGE_HUB.opened },
                ]}
              />

              <h2 id="specifications">Specifications</h2>
              <p>
                Anything not confirmed for publication is listed as pending rather than estimated.
                That is a deliberate choice: a wrong charging specification wastes a driver&apos;s
                time, which is worse than an obviously empty field.
              </p>
            </div>

            <aside>
              <Toc headings={HEADINGS} />
            </aside>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <SpecList
              items={[
                { label: "Operating organization", value: ORGANIZATION.legalName },
                { label: "Network partner", value: CHARGE_HUB.networkPartner },
                { label: "Charging type", value: "DC fast charging" },
                { label: "Peak power", value: `${CHARGE_HUB.maxPowerKw} kW per bay` },
                { label: "Bays", value: `${CHARGE_HUB.bays} bays` },
                { label: "Connector types", value: CHARGE_HUB.connectorTypes.join(", ") },
                { label: "Opening hours", value: CHARGE_HUB.openingHours },
                { label: "Payment accepted", value: CHARGE_HUB.paymentAccepted },
                { label: "Tariff", value: "" },
                { label: "Street address", value: "" },
                { label: "Map", value: CHARGE_HUB.mapUrl },
                { label: "Accessibility", value: "" },
              ]}
            />
            <p className="note" style={{ marginTop: "1rem" }}>
              Fields shown as <em>To be confirmed</em> are not yet published. Contact us through the{" "}
              <Link href="/contact/">contact page</Link> if you need one of them before you travel —
              you will get a direct answer rather than a guess.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="prose">
            <h2 id="location">Location and access</h2>
            <p>
              The site is in {ORGANIZATION.address.addressLocality}, {ORGANIZATION.address.addressRegion}{" "}
              — roughly {ORGANIZATION.geo.latitude}° N, {ORGANIZATION.geo.longitude}° E. It sits
              within the group&apos;s existing presence in the town, which is what made the
              electrical work feasible in the first place.
            </p>
            <h3 id="getting-there">Getting there</h3>
            <ul>
              <li>
                <strong>By road:</strong> Thodupuzha is on the route between the Kochi–Kottayam belt
                and the high ranges of Idukki district, so the site works for both local drivers and
                anyone passing through.
              </li>
              <li>
                <strong>Parking:</strong> bays are accessible directly from the forecourt; approach
                is designed for first-time users who have never charged publicly before.
              </li>
              <li>
                <strong>Map link:</strong> published once the pin is verified — see the pending note
                above.
              </li>
            </ul>
            <h3 id="local-context">Local context</h3>
            <p>
              Thodupuzha is a midlands town in Idukki district: warm and humid for most of the year,
              with a heavy monsoon. That matters for charging hardware, which is outdoor power
              electronics. Cooling, ingress protection, insect ingress and surge behaviour are the
              practical engineering concerns, and they are the reason monitoring matters as much as
              the chargers themselves — see{" "}
              <Link href="/work/thomu-lab/">THOMU LAB</Link>.
            </p>

            <h2 id="using-the-site">Using the site</h2>
            <ol>
              <li>
                <strong>Park with the bay in reach.</strong> Cable length and parking position matter
                more than people expect; take a moment before plugging in.
              </li>
              <li>
                <strong>Start the session on the network.</strong> Charging runs through{" "}
                {CHARGE_HUB.networkPartner} — see the network app or the instructions on the charger.
              </li>
              <li>
                <strong>Plug in and confirm the handshake.</strong> Wait for the vehicle and charger
                to agree on a power level before walking away.
              </li>
              <li>
                <strong>Leave the bay clear when you are done.</strong> Charging bays are shared
                infrastructure; occupying one after a session finishes is the most common complaint
                at public sites.
              </li>
              <li>
                <strong>Report a fault.</strong> If a bay fails, tell us through the{" "}
                <Link href="/contact/">contact page</Link> with the time and the bay number. Fault
                reports are how monitoring gaps get found.
              </li>
            </ol>

            <h2 id="asked">Frequently asked questions</h2>
            {FAQS.map((faq) => (
              <section key={faq.question}>
                <h3 id={`faq-${faq.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`}>
                  {faq.question}
                </h3>
                <p>{faq.answer}</p>
              </section>
            ))}

            <h2 id="operations">How the site is operated</h2>
            <p>
              Infrastructure is only as good as its maintenance. The operating model here is built
              around visibility: the site is watched continuously, faults are tracked rather than
              reported anecdotally, and the physical installation gets scheduled inspection instead
              of emergency attention. The monitoring half of that is documented in{" "}
              <Link href="/work/thomu-lab/">THOMU LAB</Link>, and the search-side reporting that
              covers this page is documented in{" "}
              <Link href="/search-console-monitoring/">search monitoring</Link>.
            </p>
            <p>
              Where the site relies on partners — the charging network, the electrical contractor, the
              equipment vendor — responsibility is kept explicit: the partner owns what they operate,
              the group owns the customer experience at the site.
            </p>

            <h2 id="enquiries">Enquiries</h2>
            <p>
              For directions, session help, fault reports, partnership or press enquiries, use the{" "}
              <Link href="/contact/">contact page</Link>. For anything about this website&apos;s data
              handling, see the <Link href="/privacy-policy/">privacy policy</Link>; for terms
              governing information published about the site, see the{" "}
              <Link href="/terms/">terms and disclaimer</Link>.
            </p>
            <p className="small muted">
              This page is published by {PERSON.name} on behalf of {ORGANIZATION.legalName}. Details
              of the charging site may change without notice; the live situation at the site governs.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
