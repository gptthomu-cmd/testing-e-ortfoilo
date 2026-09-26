import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, SITE, url, withBasePath } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, blogNode, itemListNode } from "@/lib/schema";
import { ARTICLES_BY_DATE } from "@/content/articles";

const PATH = "/blog/";
const TITLE = "Writing — field notes from building in Kerala";
const DESCRIPTION =
  "Field notes by George S. Thomas on EV charging infrastructure in Kerala, ZFS homelab storage, creator workflows and shipping software with AI agents.";

export const metadata: Metadata = buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  ogImage: "/images/og/og-blog.jpg",
  ogImageAlt: "Field notes on infrastructure and systems by George S. Thomas",
  keywords: [
    "EV charging blog Kerala",
    "homelab blog",
    "ZFS storage",
    "AI agent workflow",
    "George S. Thomas writing",
  ],
});

const trail = buildTrail({ name: "Writing", path: PATH });

export default function BlogIndexPage() {
  const posts = ARTICLES_BY_DATE.map((article) => ({
    name: article.title,
    path: `/blog/${article.slug}/`,
    datePublished: article.date,
  }));

  return (
    <>
      <JsonLd
        id="blog-graph"
        data={graph(
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: "CollectionPage",
            primaryImage: { url: "/images/og/og-blog.jpg", caption: "Writing index" },
            aboutId: ID.person,
            mainEntityId: `${url(PATH)}#blog`,
            breadcrumbId: ID.breadcrumb(PATH),
          }),
          blogNode(PATH, posts),
          itemListNode(
            PATH,
            "Articles by George S. Thomas",
            ARTICLES_BY_DATE.map((article) => ({
              name: article.title,
              path: `/blog/${article.slug}/`,
              description: article.description,
            })),
          ),
          breadcrumbNode(PATH, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow="Writing"
        title="Field notes from building in Kerala"
        lede="Practical write-ups rather than think-pieces: what broke, what it cost, and what I would do differently. Every article carries the same author, the same editing standard and a date."
        tags={["Infrastructure", "Systems", "Engineering", "Kerala"]}
        actions={
          <a className="btn" href={withBasePath("/feed.xml")}>
            RSS feed
          </a>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {ARTICLES_BY_DATE.map((article, index) => (
              <ArticleCard key={article.slug} article={article} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="prose">
            <h2 id="about-writing">About this section</h2>
            <p>
              Articles are written by <Link href="/about/">George S. Thomas</Link> and published on
              this site with full <code>BlogPosting</code> structured data: author, publisher,
              publication date, modification date and word count. Where an article has been revised,
              the modification date reflects the revision rather than being reset to look current.
            </p>
            <p>
              Subscribe by RSS at <a href={withBasePath("/feed.xml")}>{withBasePath("/feed.xml")}</a>{" "}
              or follow the public profiles listed on the <Link href="/about/">about page</Link>.
              Corrections are welcome through the <Link href="/contact/">contact page</Link>; the
              correction and the change will be reflected in the article.
            </p>
            <h3 id="topics">Topics covered</h3>
            <ul>
              <li>
                <strong>EV charging infrastructure</strong> — operating a public site in a small
                district, from site design to fault visibility.
              </li>
              <li>
                <strong>Homelab and storage</strong> — ZFS, thermal and humidity management, power
                resilience in a monsoon climate.
              </li>
              <li>
                <strong>Creator systems</strong> — the workflow behind{" "}
                <Link href="/work/apex-creator-os/">Apex Creator OS</Link>.
              </li>
              <li>
                <strong>AI-assisted engineering</strong> — what{" "}
                <Link href="/work/my-ai-os/">My_AI_OS</Link> does well, what it does badly, and the
                gates that catch the difference.
              </li>
            </ul>
            <h3 id="editorial-policy">Editorial policy</h3>
            <p className="small muted">
              Content is informational and reflects personal experience. It is not financial, legal or
              engineering advice, and AI assistance in drafting is disclosed in the{" "}
              <Link href="/terms/">terms</Link>. Unverifiable claims are removed rather than softened.
              Site measurements referenced in articles come from Google Search Console and this
              site&apos;s own analytics — see{" "}
              <Link href="/search-console-monitoring/">search monitoring</Link> for how they are
              collected. {SITE.name} is published as an individual site, not a commercial news
              operation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
