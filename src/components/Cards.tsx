/**
 * Card components for index pages. Each card links to a canonical page with
 * descriptive anchor text — the internal-linking foundation.
 */
import Link from "next/link";
import type { Project } from "@/content/projects";
import type { Article } from "@/content/articles";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card card-hover">
      <div className="card-meta">
        <span>{project.kicker}</span>
        <span>·</span>
        <span>{project.year}</span>
      </div>
      <h3>
        <Link href={`/work/${project.slug}/`} className="card-title-link">
          {project.name}
        </Link>
      </h3>
      <p className="muted small">{project.tagline}</p>
      <div className="tag-row">
        {project.stack.slice(0, 4).map((item) => (
          <span className="tag" key={item}>
            {item}
          </span>
        ))}
      </div>
      <p style={{ marginTop: "1rem", marginBottom: 0 }}>
        <Link href={`/work/${project.slug}/`} className="mono small">
          Read the {project.name} project page →
        </Link>
      </p>
    </article>
  );
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className="card card-hover">
      <div className="card-meta">
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{article.readingTime}</span>
        <span>·</span>
        <span>{article.category}</span>
      </div>
      <h3>
        <Link href={`/blog/${article.slug}/`} className="card-title-link">
          {article.title}
        </Link>
      </h3>
      <p className="muted small">{featured ? article.description : article.dek}</p>
      <div className="tag-row">
        {article.tags.slice(0, 3).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export function VentureCard({
  name,
  path,
  eyebrow,
  summary,
  status,
  statusVariant = "live",
}: {
  name: string;
  path: string;
  eyebrow: string;
  summary: string;
  status: string;
  statusVariant?: "live" | "legacy" | "ongoing";
}) {
  const statusLabel =
    statusVariant === "live" ? "Live" : statusVariant === "legacy" ? "Legacy" : "Ongoing";
  return (
    <article className="card card-hover">
      <div className="card-meta">
        <span>{eyebrow}</span>
      </div>
      <h3>
        <Link href={path} className="card-title-link">
          {name}
        </Link>
      </h3>
      <p className="muted small">{summary}</p>
      <div className="tag-row">
        <span className={`tag ${statusVariant === "live" ? "tag-live" : ""}`}>{statusLabel}</span>
        <span className="tag">{status}</span>
      </div>
    </article>
  );
}

/** Definition-list style specification block. Unknown values render as "pending". */
export function SpecList({ items }: { items: { label: string; value?: string }[] }) {
  return (
    <dl className="spec-list">
      {items.map((item) => (
        <div className="spec" key={item.label}>
          <dt>{item.label}</dt>
          <dd className={item.value ? undefined : "pending"}>
            {item.value || "To be confirmed"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-4">
      {items.map((item) => (
        <div className="stat" key={item.label}>
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
