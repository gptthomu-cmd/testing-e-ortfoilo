/**
 * Global header. The mobile menu is a CSS-only checkbox toggle so navigation
 * works with zero JavaScript (better for Core Web Vitals and for crawlers).
 */
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav aria-label="Primary" className="nav-inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} — home`}>
          <span className="brand-mark">
            {SITE.wordmark} <span>//</span> {SITE.wordmarkSuffix}
          </span>
          <span className="brand-sub">George S. Thomas</span>
        </Link>

        {/* CSS-only menu toggle: works before (and without) JavaScript. */}
        <input type="checkbox" id="nav-toggle" className="nav-toggle" hidden />
        <label className="nav-toggle-label" htmlFor="nav-toggle">
          <i />
          <i />
          <i />
        </label>

        <NavLinks />
      </nav>
    </header>
  );
}
