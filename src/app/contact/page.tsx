import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { SpecList } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, ORGANIZATION, PERSON, SITE, isFilled, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, organizationNode, personNode } from "@/lib/schema";

const PATH = "/contact/";
const TITLE = "Contact — enquiries, fault reports and press";
const DESCRIPTION =
  "How to reach George S. Thomas (Thomu) for engineering questions, NKT Charge Hub session help or fault reports, venture enquiries, corrections and press requests.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-contact.jpg",
  ogImageAlt: "Contact George S. Thomas",
  keywords: ["contact George S. Thomas", "Thomu contact", "NKT Charge Hub support"],
});

const trail = buildTrail({ name: "Contact", path: PATH });

const REASONS = [
  {
    title: "Engineered systems & homelab",
    copy: "Questions about the ZFS arrays, edge nodes, telemetry or anything documented in the project pages.",
  },
  {
    title: "Charging infrastructure",
    copy: "Session help, fault reports or questions about the NKT Charge Hub site. Include the bay number and the time so it can be matched against monitoring logs.",
  },
  {
    title: "Venture and property enquiries",
    copy: "Business enquiries about the group's ventures. Messages are routed to the right person rather than answered generically.",
  },
  {
    title: "Edits, corrections and press",
    copy: "Corrections to published articles are prioritised: a correction request that identifies a factual error will be checked and fixed.",
  },
];

export default function ContactPage() {
  const emailReady = isFilled(PERSON.email) || isFilled(ORGANIZATION.email);

  return (
    <>
      <JsonLd
        id="contact-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "ContactPage",
            primaryImage: { url: "/images/og/og-contact.jpg", caption: "Contact page" },
            aboutId: ID.person,
            mainEntityId: ID.person,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          personNode(),
          organizationNode(),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Contact"
        title="Let's build something tangible"
        lede="Open to selected collaborations, engineering questions and corrections. The fastest route to a useful reply is a specific message — what you are trying to do, and what you need from me."
        tags={["Replies within a few days", "English / Malayalam", "Kerala, India"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2 id="how-to-reach-me">How to reach me</h2>
              <p>
                This is a static site with no contact form and no tracking pixels, so email and the
                public profiles below are the ways in. Direct email is best for anything substantive.
              </p>
              <ul>
                {emailReady ? (
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                  </li>
                ) : (
                  <li>
                    <strong>Email:</strong> the public address is being configured — use{" "}
                    <a
                      href="https://www.linkedin.com/in/george-s-thomas-a64b91405/"
                      rel="me noopener"
                      target="_blank"
                    >
                      LinkedIn
                    </a>{" "}
                    in the meantime. This line disappears the moment the mailbox is live.
                  </li>
                )}
                <li>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href="https://www.linkedin.com/in/george-s-thomas-a64b91405/"
                    rel="me noopener"
                    target="_blank"
                  >
                    George S. Thomas
                  </a>{" "}
                  — professional enquiries
                </li>
                <li>
                  <strong>Instagram:</strong>{" "}
                  <a href="https://www.instagram.com/george.s.thomas/" rel="me noopener" target="_blank">
                    @george.s.thomas
                  </a>{" "}
                  — creator and visual work
                </li>
                <li>
                  <strong>GitHub:</strong>{" "}
                  <a href="https://github.com/gptthomu-cmd" rel="me noopener" target="_blank">
                    gptthomu-cmd
                  </a>{" "}
                  — code and issues
                </li>
              </ul>
              <p className="note">
                A public telephone number and street address are not published here. They will be added
                when they can be monitored properly — an unmonitored number for a charging site is
                worse than no number.
              </p>

              <h2 id="what-to-write-about">What to write about</h2>
              <p>
                To make a reply useful, say which category your message falls into and include the
                specifics: page URL, bay number, timestamp, or the decision you are trying to make.
              </p>
            </div>

            <aside>
              <SpecList
                items={[
                  { label: "Name", value: PERSON.name },
                  { label: "Role", value: PERSON.jobTitle },
                  { label: "Location", value: `${PERSON.address.addressLocality}, ${PERSON.address.addressRegion}` },
                  { label: "Organization", value: ORGANIZATION.name },
                  { label: "Public email", value: isFilled(PERSON.email) ? PERSON.email : "" },
                  { label: "Preferred channel", value: "Email or LinkedIn" },
                  { label: "Languages", value: "English, Malayalam" },
                  { label: "Response time", value: "Typically within a few days" },
                ]}
              />
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Before you write</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  <li>
                    Charging specs and tariffs:{" "}
                    <Link href="/ventures/nkt-charge-hub/">NKT Charge Hub page</Link>
                  </li>
                  <li>
                    Data handling and your rights:{" "}
                    <Link href="/privacy-policy/">Privacy Policy</Link>
                  </li>
                  <li>
                    What may be republished: <Link href="/terms/">Terms</Link>
                  </li>
                  <li>
                    Site problems, search coverage:{" "}
                    <Link href="/search-console-monitoring/">monitoring page</Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>What I can help with</h2>
          <div className="grid grid-2" style={{ marginTop: "1.5rem" }}>
            {REASONS.map((reason) => (
              <article className="card" key={reason.title}>
                <h3>{reason.title}</h3>
                <p className="muted small" style={{ marginBottom: 0 }}>
                  {reason.copy}
                </p>
              </article>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: "2rem" }}>
            {SITE.name} is published by an individual, not a company. Messages about this website may
            be published in anonymised, aggregated form when they identify a correction — never with
            your contact details. See the{" "}
            <a href={url("/privacy-policy/")}>privacy policy</a> for how correspondence is stored and
            when it is deleted.
          </p>
        </div>
      </section>
    </>
  );
}
