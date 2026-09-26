import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, buildTrail } from "@/components/Breadcrumbs";
import { Toc } from "@/components/Toc";
import { AuthorCard } from "@/components/AuthorCard";
import { SpecList } from "@/components/Cards";
import { buildMetadata } from "@/lib/seo";
import { ID, PERSON, url } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, projectNode } from "@/lib/schema";
import { PROJECTS, getProject } from "@/content/projects";
import { prepareHtml, extractHeadings, wordCount } from "@/lib/content";

/** Only the three known projects exist — everything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    path: `/work/${project.slug}/`,
    title: `${project.name} — ${project.kicker}`,
    description: project.summary,
    ogImage: project.ogImage,
    ogImageAlt: `${project.name} — ${project.tagline}`,
    keywords: project.keywords,
    type: "article",
    section: "Projects",
    tags: [...project.stack],
    modifiedTime: "2026-09-26",
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const path = `/work/${project.slug}/`;
  const trail = buildTrail({ name: "Work", path: "/work/" }, { name: project.name, path });
  const body = prepareHtml(project.body);
  const headings = extractHeadings(body);
  const others = PROJECTS.filter((p) => p.slug !== project.slug);

  return (
    <>
      <JsonLd
        id="project-graph"
        data={graph(
          webPageNode({
            path,
            name: `${project.name} — ${project.kicker}`,
            description: project.summary,
            type: "WebPage",
            primaryImage: { url: project.ogImage, caption: project.tagline },
            aboutId: `${url(path)}#project`,
            mainEntityId: `${url(path)}#project`,
            breadcrumbId: ID.breadcrumb(path),
            dateModified: "2026-09-26",
            keywords: project.keywords,
          }),
          projectNode({
            path,
            name: project.name,
            description: project.summary,
            type: project.schemaType,
            applicationCategory: project.applicationCategory,
            operatingSystem: project.operatingSystem,
            keywords: project.keywords,
            codeRepository: project.codeRepository,
            image: project.ogImage,
            status: project.status,
          }),
          breadcrumbNode(path, trail),
        )}
      />
      <Breadcrumbs trail={trail} />

      <PageHero
        eyebrow={`${project.kicker} · ${project.year}`}
        title={project.name}
        lede={project.tagline}
        tags={project.stack.slice(0, 6)}
      />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <article className="prose" dangerouslySetInnerHTML={{ __html: body }} />

            <aside>
              <Toc headings={headings} />
              <div style={{ marginTop: "1.5rem" }}>
                <SpecList
                  items={[
                    { label: "Status", value: project.status },
                    { label: "Active since", value: project.year },
                    { label: "Owned by", value: PERSON.name },
                    { label: "Schema type", value: project.schemaType },
                    {
                      label: "Category",
                      value: project.applicationCategory || "Engineering project",
                    },
                    { label: "Repository", value: project.codeRepository ? "Linked" : undefined },
                  ]}
                />
              </div>
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h2 style={{ fontSize: "0.95rem", marginTop: 0 }}>Other projects</h2>
                <ul className="small" style={{ marginBottom: 0 }}>
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link href={`/work/${other.slug}/`}>
                        {other.name} — {other.kicker}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/work/">All projects</Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <AuthorCard />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="prose">
            <h2 id="project-meta">About this page</h2>
            <p className="small muted">
              Published on this site as part of the{" "}
              <Link href="/work/">project documentation set</Link>. Structured data for this page
              declares a <code>{project.schemaType}</code> entity with{" "}
              <code>{PERSON.name}</code> as creator and maintainer, referenced from the site-wide{" "}
              <code>Person</code> node. Approximately {wordCount(project.body)} words; see the{" "}
              <Link href="/blog/">writing section</Link> for related field notes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
