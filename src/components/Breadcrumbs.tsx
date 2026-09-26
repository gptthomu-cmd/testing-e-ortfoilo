/**
 * Visible breadcrumb trail. Mirrors the BreadcrumbList structured data emitted
 * by the same page, so what users see matches what Google reads.
 */
import Link from "next/link";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <div className="wrap">
        <ol>
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={crumb.path}>
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.path}>{crumb.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/** Build a trail from the site root to a page. */
export function buildTrail(...items: Crumb[]): Crumb[] {
  return [{ name: "Home", path: "/" }, ...items];
}
