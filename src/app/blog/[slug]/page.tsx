import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { Toc } from "@/components/Toc";
import { AuthorCard } from "@/components/AuthorCard";
import { Picture } from "@/components/Picture";
import { buildMetadata } from "@/lib/seo";
import { ID, PERSON, ORGANIZATION, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, articleNode, personNode } from "@/lib/schema";
import { ARTICLES, ARTICLES_BY_DATE, getArticle } from "@/content/articles";
import { prepareHtml, extractHeadings, wordCount, readingTime } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return buildMetadata({
    path: `/blog/${article.slug}/`,
    title: article.seoTitle,
    description: article.description,
    ogImage: article.image,
    ogImageAlt: article.imageAlt,
    type: "article",
    publishedTime: `${article.date}T06:30:00+05:30`,
    modifiedTime: `${article.updated || article.date}T06:30:00+05:30`,
    authors: [url("/about/")],
    section: article.category,
    tags: [...article.tags],
    keywords: article.keywords,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/blog/${article.slug}/`;
  const trail = buildTrail(
    { name: "Writing", path: "/blog/" },
    { name: article.title, path },
  );
  const body = prepareHtml(article.body);
  const headings = extractHeadings(body);
  const words = wordCount(body);

  const index = ARTICLES_BY_DATE.findIndex((a) => a.slug === article.slug);
  const newer = index > 0 ? ARTICLES_BY_DATE[index - 1] : undefined;
  const older = index < ARTICLES_BY_DATE.length - 1 ? ARTICLES_BY_DATE[index + 1] : undefined;
  const related = ARTICLES_BY_DATE.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  ).slice(0, 2);
  const fallbackRelated = ARTICLES_BY_DATE.filter((a) => a.slug !== article.slug).slice(0, 2);
  const relatedPosts = related.length > 0 ? related : fallbackRelated;

  const published = new Date(article.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const updated = article.updated
    ? new Date(article.updated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <>
      <JsonLd
        id="article-graph"
        data={graph(
          webPageNode({
            path,
            name: article.seoTitle,
            description: article.description,
            type: "WebPage",
            primaryImage: {
              url: article.image,
              caption: article.imageAlt,
            },
            aboutId: ID.person,
            mainEntityId: `${url(path)}#article`,
            breadcrumbId: ID.breadcrumb(path),
            datePublished: article.date,
            dateModified: article.updated || article.date,
            keywords: article.keywords,
          }),
          articleNode({
            path,
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            dateModified: article.updated || article.date,
            image: article.image,
            imageCaption: article.imageAlt,
            wordCount: words,
            articleSection: article.category,
            keywords: article.keywords,
          }),
          breadcrumbNode(path, trail),
          personNode(),
        )}
      />
      <Breadcrumbs trail={trail} />

      <article>
        <section className="page-hero">
          <div className="wrap">
            <p className="eyebrow">
              {article.category} · {readingTime(body)}
            </p>
            <h1>{article.title}</h1>
            <p className="lede">{article.dek}</p>
            <div className="article-meta" style={{ marginTop: "1.4rem" }}>
              <span>
                By <Link href="/about/">{PERSON.name}</Link>
              </span>
              <time dateTime={article.date}>Published {published}</time>
              {updated ? <time dateTime={article.updated}>Updated {updated}</time> : null}
              <span>{words.toLocaleString("en-IN")} words</span>
            </div>
            <div className="tag-row" style={{ marginTop: "1rem" }}>
              {article.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="split">
              <div>
                <figure style={{ marginTop: 0 }}>
                  <Picture
                    src={article.image}
                    alt={article.imageAlt}
                    width={1200}
                    height={630}
                    priority
                    style={{ borderRadius: "var(--radius)", border: "1px solid var(--line)" }}
                  />
                  <figcaption>{article.imageAlt}</figcaption>
                </figure>

                <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />

                {article.figure ? (
                  <figure>
                    <Picture
                      src={article.figure.src}
                      alt={article.figure.alt}
                      width={1200}
                      height={620}
                    />
                    <figcaption>{article.figure.caption}</figcaption>
                  </figure>
                ) : null}
              </div>

              <aside>
                <Toc headings={headings} />
                <div className="card" style={{ marginTop: "1.5rem" }}>
                  <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Keep reading</h2>
                  <ul className="small" style={{ marginBottom: 0 }}>
                    {relatedPosts.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/blog/">All writing</Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            <AuthorCard />

            <nav
              aria-label="Article navigation"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "2rem",
              }}
            >
              {older ? (
                <Link className="btn" href={`/blog/${older.slug}/`}>
                  ← Older: {older.title.slice(0, 42)}
                  {older.title.length > 42 ? "…" : ""}
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link className="btn" href={`/blog/${newer.slug}/`}>
                  Newer: {newer.title.slice(0, 42)}
                  {newer.title.length > 42 ? "…" : ""} →
                </Link>
              ) : null}
            </nav>

            <p className="small muted" style={{ marginTop: "2rem" }}>
              Published by {PERSON.name} ({ORGANIZATION.name}) on{" "}
              <time dateTime={article.date}>{published}</time>. This article is informational only and
              is not professional advice — see the <Link href="/terms/">terms and disclaimer</Link>.
              Image and page metadata for this article is defined in the site&apos;s structured data.
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
