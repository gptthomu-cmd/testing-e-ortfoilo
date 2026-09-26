/**
 * Global footer. Doubles as the site's internal-linking hub: every key page is
 * one click from every other page, which is what the "internal linking" and
 * "crawlability" requirements actually need.
 */
import Link from "next/link";
import { FOOTER_LINKS, SOCIALS, SITE, ORGANIZATION, PERSON, COPYRIGHT_START_YEAR } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <h2>George S. Thomas</h2>
            <p className="small muted" style={{ maxWidth: "34ch" }}>
              {PERSON.jobTitle}. Based in {PERSON.address.addressLocality},{" "}
              {PERSON.address.addressRegion}. Building EV charging infrastructure, homelab systems
              and AI tooling.
            </p>
            <ul>
              {SOCIALS.map((social) => (
                <li key={social.key}>
                  <a href={social.href} rel="me noopener" target="_blank">
                    {social.label} <span className="muted">({social.handle})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div className="footer-col" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-legal">
          <p style={{ margin: 0 }}>
            © {COPYRIGHT_START_YEAR === year ? year : `${COPYRIGHT_START_YEAR}–${year}`}{" "}
            {PERSON.name}. All rights reserved.
          </p>
          <p style={{ margin: 0 }}>
            {ORGANIZATION.name} · {PERSON.locationLabel}
          </p>
          <p style={{ margin: 0 }}>
            <Link href="/privacy-policy/">Privacy</Link> · <Link href="/terms/">Terms</Link> ·{" "}
            <Link href="/cookies/">Cookies</Link> · <Link href="/sitemap.xml">Sitemap</Link> ·{" "}
            <a href="/feed.xml">RSS</a>
          </p>
          <p style={{ margin: 0 }}>{SITE.wordmark} // {SITE.wordmarkSuffix} — static, HTTPS-only</p>
        </div>
      </div>
    </footer>
  );
}
