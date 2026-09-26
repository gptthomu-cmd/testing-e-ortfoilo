/**
 * Renders a LegalDocument (privacy policy, terms, cookie controls) with
 * breadcrumbs, an on-page index and per-section anchors.
 *
 * The cookie page injects the live <ConsentControls /> where its content has the
 * literal `<!--cookie-controls-->` marker, so the documented behaviour and the
 * actual controls are always the same code path.
 */
import { Fragment } from "react";
import Link from "next/link";

import { Breadcrumbs, buildTrail, type Crumb } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { Toc } from "./Toc";
import { PageHero } from "./PageHero";
import { ConsentControls } from "./Consent";
import { prepareHtml } from "@/lib/content";
import { ID, PERSON } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode } from "@/lib/schema";
import type { LegalDocument } from "@/content/legal";

export function LegalDocumentPage({
  doc,
  breadcrumbLabel,
}: {
  doc: LegalDocument;
  breadcrumbLabel?: string;
}) {
  const trail: Crumb[] = buildTrail({ name: breadcrumbLabel || doc.title, path: doc.path });
  const headings = doc.sections.map((section) => ({
    id: section.id,
    text: section.heading,
    level: 2,
  }));

  return (
    <>
      <JsonLd
        id={`${doc.slug}-graph`}
        data={graph(
          webPageNode({
            path: doc.path,
            name: doc.seoTitle,
            description: doc.description,
            type: "WebPage",
            primaryImage: {
              url: `/images/og/og-${doc.slug}.jpg`,
              caption: `${doc.title} — ${PERSON.name}`,
            },
            breadcrumbId: ID.breadcrumb(doc.path),
            dateModified: doc.updated,
            keywords: doc.keywords,
          }),
          breadcrumbNode(doc.path, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Legal"
        title={doc.title}
        lede={doc.intro}
        tags={[`Last updated ${new Date(doc.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              {doc.sections.map((section) => (
                <Fragment key={section.id}>
                  <h2 id={section.id}>{section.heading}</h2>
                  {/* The `<!--cookie-controls-->` marker is replaced with the live
                      consent UI, so the page always shows real controls. */}
                  {section.html.split("<!--cookie-controls-->").map((chunk, index, chunks) => (
                    <Fragment key={`${section.id}-${index}`}>
                      {chunk.trim() ? (
                        <div dangerouslySetInnerHTML={{ __html: prepareHtml(chunk) }} />
                      ) : null}
                      {index < chunks.length - 1 ? <ConsentControls /> : null}
                    </Fragment>
                  ))}
                </Fragment>
              ))}

              <p className="small muted">
                This document forms part of the public record for {PERSON.name}. Related pages:{" "}
                <Link href="/privacy-policy/">Privacy Policy</Link>,{" "}
                <Link href="/terms/">Terms &amp; Disclaimer</Link> and the{" "}
                <Link href="/cookies/">Cookie &amp; Privacy Controls</Link>.
              </p>
            </div>

            <aside>
              <Toc headings={headings} label="Contents" />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
