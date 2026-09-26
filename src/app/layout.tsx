import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Analytics, AnalyticsPreconnect } from "@/components/Analytics";
import { ConsentBanner } from "@/components/Consent";
import { WebVitals } from "@/components/WebVitals";
import { SITE, SITE_ROOT, url, withBasePath, VERIFICATION, isFilled } from "@/lib/site";
import {
  graph,
  webSiteNode,
  organizationNode,
  personNode,
  logoNode,
} from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_ROOT}/`),
  title: {
    default: `${SITE.name} — ${SITE.shortName} | Operator, builder and digital architect`,
    // Every page's <title> is unique; the template keeps the brand consistent.
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: `${SITE.name} portfolio`,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: url("/about/") }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: withBasePath("/feed.xml"), title: `${SITE.name} — Writing` }],
    },
  },
  // Explicitly base-path aware so icons resolve on GitHub Pages project sites.
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico"), sizes: "any" },
      { url: withBasePath("/images/brand/site-icon-192.png"), type: "image/png", sizes: "192x192" },
      { url: withBasePath("/images/brand/site-icon-512.png"), type: "image/png", sizes: "512x512" },
      { url: withBasePath("/images/brand/monogram.svg"), type: "image/svg+xml" },
    ],
    apple: [{ url: withBasePath("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
    shortcut: [withBasePath("/favicon.ico")],
  },
  manifest: withBasePath("/site.webmanifest"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Google Search Console / Bing ownership proof, only emitted once a token exists.
  ...(isFilled(VERIFICATION.google)
    ? { verification: { google: VERIFICATION.google } }
    : {}),
  ...(isFilled(VERIFICATION.bing)
    ? { verification: { google: VERIFICATION.google, other: { "msvalidate.01": VERIFICATION.bing } } }
    : {}),
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.lang} dir={SITE.dir}>
      <head>
        <AnalyticsPreconnect />
        {/* Google Analytics 4 — consent-gated; emits nothing without an ID. */}
        <Analytics />
      </head>
      <body>
        {/* Site-wide knowledge graph: WebSite + Organization + Person + logo.
            Declared once with stable @ids and referenced from every page. */}
        <JsonLd
          id="site-graph"
          data={graph(
            logoNode(),
            webSiteNode(),
            organizationNode(),
            personNode(),
          )}
        />

        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ConsentBanner />
        <WebVitals />
      </body>
    </html>
  );
}
