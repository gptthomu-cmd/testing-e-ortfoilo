import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { graph, webPageNode } from "@/lib/schema";

export const metadata: Metadata = {
  ...buildMetadata({
    path: "/404/",
    title: "Page not found (404)",
    description:
      "That page does not exist on this site. Use the links below to find the project, venture or article you were looking for.",
    ogImage: "/images/og/og-404.jpg",
    noindex: true,
    titleAbsolute: true,
  }),
};

/** Most-requested destinations, so a 404 still gets a visitor where they wanted. */
const SUGGESTIONS = [
  { label: "Home", href: "/", note: "Start here" },
  { label: "About George S. Thomas", href: "/about/", note: "Profile and background" },
  { label: "Projects", href: "/work/", note: "THOMU LAB, Apex Creator OS, My_AI_OS" },
  { label: "Ventures", href: "/ventures/", note: "NKT Group and its businesses" },
  { label: "NKT Charge Hub", href: "/ventures/nkt-charge-hub/", note: "Charging site details" },
  { label: "Writing", href: "/blog/", note: "Articles and field notes" },
  { label: "Contact", href: "/contact/", note: "How to get in touch" },
  { label: "Privacy Policy", href: "/privacy-policy/", note: "Data handling" },
  { label: "Terms & Disclaimer", href: "/terms/", note: "Use of this site" },
  { label: "Cookie controls", href: "/cookies/", note: "Change your consent" },
  { label: "Sitemap", href: "/sitemap.xml", note: "Every indexable URL" },
];

export default function NotFound() {
  return (
    <>
      <JsonLd
        id="notfound-graph"
        data={graph(
          webPageNode({
            path: "/404/",
            name: "Page not found",
            description: "A 404 page listing every main section of the site.",
          }),
        )}
      />

      <section className="page-hero hero-grid-bg">
        <div className="wrap">
          <p className="eyebrow">Error 404</p>
          <h1>That page moved, or never existed</h1>
          <p className="lede">
            The URL you asked for is not on this site. Nothing is broken on your side — either the
            link is out of date or the address has a typo. Everything published here is reachable from
            the list below.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/">
              Back to the homepage
            </Link>
            <Link className="btn" href="/sitemap.xml">
              Open the XML sitemap
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Find what you were looking for</h2>
          <p className="lede" style={{ marginBottom: "2rem" }}>
            Every main section of {SITE.name}, in one place.
          </p>

          <table className="index-table">
            <caption className="small muted" style={{ textAlign: "left", paddingBottom: "0.8rem" }}>
              Sitelinks for a 404 — the same destinations as the sitemap, in human order.
            </caption>
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">What it covers</th>
                <th scope="col">URL</th>
              </tr>
            </thead>
            <tbody>
              {SUGGESTIONS.map((item) => (
                <tr key={item.href}>
                  <td>
                    <Link href={item.href}>{item.label}</Link>
                  </td>
                  <td className="muted">{item.note}</td>
                  <td>
                    <code>{item.href}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="small muted" style={{ marginTop: "2rem" }}>
            If a link on this site sent you here, that is a bug worth reporting — please use the{" "}
            <Link href="/contact/">contact page</Link> and include the URL you followed.
          </p>
        </div>
      </section>
    </>
  );
}
