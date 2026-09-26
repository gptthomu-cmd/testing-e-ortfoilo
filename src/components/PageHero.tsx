/**
 * Shared page header. Renders the page's single <h1> plus optional eyebrow,
 * lede, tag row and action buttons — one H1 per page, always above the H2s.
 */
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  tags,
  actions,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  tags?: readonly string[];
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {tags && tags.length > 0 ? (
          <div className="tag-row" style={{ marginTop: "1.3rem" }}>
            {tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {actions ? <div className="btn-row">{actions}</div> : null}
        {aside}
      </div>
    </section>
  );
}
