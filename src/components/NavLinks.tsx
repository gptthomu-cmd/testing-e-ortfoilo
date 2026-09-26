"use client";

/**
 * Nav links with an accurate `aria-current="page"` marker.
 * Isolated in a tiny client component so the rest of the header (and every
 * page shell) stays server-rendered.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

export function NavLinks() {
  const pathname = usePathname() || "/";

  return (
    <ul className="nav-links">
      {NAV.map((item) => {
        const isCurrent =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={isCurrent ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
