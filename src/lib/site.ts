/**
 * ============================================================================
 *  SITE CONFIGURATION — single source of truth
 * ============================================================================
 *  Everything SEO-related (canonical URLs, sitemap, structured data, Open
 *  Graph, analytics, verification) reads from this file.
 *
 *  Fields marked `TODO_FILL` are placeholders. Run `npm run seo:check` to list
 *  every unfilled field, or search the repo for `TODO_FILL`.
 * ============================================================================
 */

/** Production origin, without trailing slash and without the path prefix. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://gptthomu-cmd.github.io"
).replace(/\/+$/, "");

/**
 * Path prefix the site is served from.
 * GitHub Pages *project* site -> "/testing-e-ortfoilo"; custom domain -> "".
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

/** Absolute site root including any path prefix. */
export const SITE_ROOT = `${SITE_URL}${BASE_PATH}`;

/** Build an absolute, canonical URL for a site-relative path. */
export function url(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ROOT}${clean === "/" ? "/" : clean}`;
}

/** Prefix a site-relative asset/link path with the deployment base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${BASE_PATH}${path}`;
}

/** Stable JSON-LD `@id` values so every node can be referenced across pages. */
export const ID = {
  website: url("/#website"),
  organization: url("/#organization"),
  person: url("/#person"),
  logo: url("/#logo"),
  chargingStation: url("/ventures/nkt-charge-hub/#chargingstation"),
  webpage: (path: string) => url(`${path}#webpage`),
  breadcrumb: (path: string) => url(`${path}#breadcrumb`),
  article: (path: string) => url(`${path}#article`),
  primaryImage: (path: string) => url(`${path}#primaryimage`),
};

/**
 * A value counts as "filled" only when it is real. Any placeholder marker
 * anywhere in the string disqualifies it, so a half-edited value like
 * "hello@TODO_FILL.example" can never leak into structured data or metadata.
 */
export function isFilled(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  return !/(TODO_FILL|REPLACE_?ME?\b|XXXX|PLACEHOLDER|example\.(com|org|net)\b|your-?(domain|email|name))/i.test(v);
}

export const SITE = {
  /** Brand / site name used in titles. */
  name: "George S. Thomas",
  shortName: "Thomu",
  /** Wordmark shown in the header — matches the "THOMU // OPERATOR" identity. */
  wordmark: "THOMU",
  wordmarkSuffix: "OPERATOR",
  tagline: "Operator, builder and digital architect in Thodupuzha, Kerala",
  /** Default meta description (kept under 160 characters). */
  description:
    "George S. Thomas (Thomu) — student, operator of the Nedumpurath Group (NKT Group) and builder of NKT Charge Hub, THOMU LAB, Apex Creator OS and My_AI_OS.",
  locale: "en_IN",
  lang: "en",
  dir: "ltr" as const,
  themeColor: "#0a0a0a",
  /** Default Open Graph / social share image, relative to /public. */
  defaultOgImage: "/images/og/og-default.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  /** Handle used for twitter:creator / twitter:site — omit when unknown. */
  xHandle: "" as string,
  keywords: [
    "George S. Thomas",
    "George Nedumpurath",
    "Thomu",
    "NKT Group",
    "Nedumpurath Group",
    "NKT Charge Hub",
    "EV charging Kerala",
    "THOMU LAB",
    "Apex Creator OS",
    "My_AI_OS",
    "Thodupuzha",
    "Idukki",
    "Kerala",
  ],
} as const;

/**
 * The site owner. Used for the Person / ProfilePage schema, article authorship
 * and the "About the author" blocks — this is what makes E-E-A-T traceable.
 */
export const PERSON = {
  name: "George S. Thomas",
  alternateName: ["George Nedumpurath", "Thomu", "George S. Thomas Nedumpurath"],
  givenName: "George",
  additionalName: "S.",
  familyName: "Thomas",
  /** Public-facing role — keep it factual. */
  jobTitle: "Operator, NKT Group (Nedumpurath Group)",
  description:
    "Student, operator and builder based in Thodupuzha, Kerala. Runs the family business group by day and builds EV charging infrastructure, homelab systems and AI tooling in public.",
  /** Profile / identity images (see `npm run images:optimize`). */
  image: "/images/profile/george-s-thomas-960.jpg",
  imageAlt: "Identity mark for George S. Thomas (Thomu) — monogram on a dark grid",
  /** Human-readable location, mirrored in structured data. */
  address: {
    addressLocality: "Thodupuzha",
    addressRegion: "Kerala",
    postalCode: "685584", // TODO_FILL: confirm the exact PIN for the registered address
    addressCountry: "IN",
  },
  geo: { latitude: 9.8959, longitude: 76.7184 },
  /** Free-text location label used in copy. */
  locationLabel: "Thodupuzha, Idukki district, Kerala, India",
  /** Topics the person is publicly associated with (schema.org `knowsAbout`). */
  knowsAbout: [
    "Electric vehicle charging infrastructure",
    "OCPP charge point management",
    "Edge computing and homelab storage",
    "ZFS storage architecture",
    "AI agent orchestration",
    "Video editing and post-production",
    "Quantitative trading research",
  ],
  /**
   * Public contact. Left empty on purpose: an unmonitored address is worse than
   * none, and a placeholder must never reach structured data (the SEO gate
   * fails the build if one does). Set this to a real, monitored inbox.
   * TODO_FILL: public contact email
   */
  email: "",
  telephone: "", // TODO_FILL: optional public phone number (E.164, e.g. +91…)
} as const;

/**
 * Official social profiles. These power `sameAs` in Person/Organization schema
 * and the social links in the footer — only verified URLs belong here.
 */
export const SOCIALS = [
  {
    key: "github",
    label: "GitHub",
    handle: "@gptthomu-cmd",
    href: "https://github.com/gptthomu-cmd",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@george.s.thomas",
    href: "https://www.instagram.com/george.s.thomas/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "George S. Thomas",
    href: "https://www.linkedin.com/in/george-s-thomas-a64b91405/",
  },
  // TODO_FILL: add your YouTube channel URL — e.g. https://www.youtube.com/@handle
  // TODO_FILL: add your X / Twitter profile URL if you want twitter:creator set
] as const;

/** `sameAs` array for structured data. */
export const SAME_AS: string[] = SOCIALS.map((s) => s.href);

/**
 * NKT Group (Nedumpurath Group) — the organization behind the ventures.
 * Address data mirrors the publicly listed Thodupuzha locality.
 */
export const ORGANIZATION = {
  name: "NKT Group",
  legalName: "NKT Group (Nedumpurath Group)",
  alternateName: ["Nedumpurath Group", "N.K.T. Group of Enterprises"],
  description:
    "Family business group based in Thodupuzha, Kerala, operating retail, commercial property and electric-vehicle charging infrastructure since 1947.",
  foundingDate: "1947",
  founderName: "N. K. Thomas",
  slogan: "Four generations of enterprise in Idukki district",
  logo: "/images/brand/nkt-group-logo-512.png",
  address: {
    streetAddress: "", // TODO_FILL: street address of the registered office (optional)
    addressLocality: "Thodupuzha",
    addressRegion: "Kerala",
    postalCode: "685584", // TODO_FILL: confirm PIN
    addressCountry: "IN",
  },
  geo: { latitude: 9.8959, longitude: 76.7184 },
  areaServed: "Idukki district, Kerala, India",
  email: "", // TODO_FILL: business contact email (must be monitored)
  telephone: "", // TODO_FILL: business phone number (E.164)
  /** Venture sub-organizations (schema.org `subOrganization`). */
  ventures: [
    {
      name: "NKT Vessels House",
      path: "/ventures/nkt-vessels-house/",
      description:
        "Legacy retail business established in 1947, known across Idukki district for brassware and household trade.",
    },
    {
      name: "Nedumpurath Towers",
      path: "/ventures/nedumpurath-towers/",
      description:
        "Commercial property management vertical anchoring the group's regional real-estate footprint.",
    },
    {
      name: "NKT Charge Hub",
      path: "/ventures/nkt-charge-hub/",
      description:
        "Public electric-vehicle charging station network launched in 2026, supported by IonGrid as technology and network partner.",
    },
  ],
} as const;

/**
 * NKT Charge Hub — the local/business entity that gets its own
 * LocalBusiness + Service + FAQ structured data.
 *
 * NOTE: only publish figures you can stand behind. Values below follow the
 * group's own public description; anything unknown is left empty on purpose.
 */
export const CHARGE_HUB = {
  name: "NKT Charge Hub",
  legalName: "NKT Charge Hub (NKT Group)",
  description:
    "Public electric-vehicle DC fast-charging station in Thodupuzha, Kerala, run by NKT Group with IonGrid as technology and network partner.",
  opened: "2026",
  /** Charging hardware summary — confirm before publishing. */
  bays: 2, // TODO_FILL: confirm number of charge bays
  connectorTypes: ["CCS2"], // TODO_FILL: confirm connectors (CCS2 / Type 2 / CHAdeMO …)
  maxPowerKw: 120, // TODO_FILL: confirm peak power per bay
  networkPartner: "IonGrid",
  openingHours: "Mo-Su 00:00-23:59", // TODO_FILL: confirm operating hours
  paymentAccepted: "", // TODO_FILL: e.g. "UPI, Credit Card, Debit Card"
  priceRange: "", // TODO_FILL: e.g. "₹₹" — omit until tariffs are published
  amenities: [
    "DC fast charging bays",
    "Well-lit, monitored forecourt",
    "Support from the IonGrid network team",
  ],
  /** Public map link for the station (Google Maps place URL). */
  mapUrl: "", // TODO_FILL: Google Maps / OSM link for the station
} as const;

/** Google Analytics 4 + consent strategy. */
export const ANALYTICS = {
  /** Env override wins so CI can inject a real ID without editing source. */
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", // TODO_FILL: e.g. G-ABCDE12345
  /** `prior` = load no tag before consent (strictest). `advanced` = Consent Mode v2 with denied defaults. */
  consentMode:
    (process.env.NEXT_PUBLIC_GA_CONSENT_MODE as "prior" | "advanced" | undefined) || "prior",
  /** GA4 event sent when a Web Vital is measured. */
  webVitalsEvent: "web_vitals",
  /** Send page_view manually on SPA navigations. */
  debug: false,
} as const;

/** Search engine ownership / verification tokens. */
export const VERIFICATION = {
  /** Google Search Console HTML tag token (content="..." ) */
  google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "", // TODO_FILL: GSC verification token
  /** Optional Bing Webmaster Tools token. */
  bing: "",
  /** IndexNow key — lets Bing/Yandex pick up new URLs instantly. */
  indexNow: "",
} as const;

/** Primary navigation. Order matters: it is mirrored in the footer and sitemap. */
export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Work", href: "/work/" },
  { label: "Ventures", href: "/ventures/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** Legal + utility links, grouped for the footer (also drives internal linking). */
export const FOOTER_LINKS = [
  {
    title: "Person",
    links: [
      { label: "About George S. Thomas", href: "/about/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "All projects", href: "/work/" },
      { label: "THOMU LAB", href: "/work/thomu-lab/" },
      { label: "Apex Creator OS", href: "/work/apex-creator-os/" },
      { label: "My_AI_OS", href: "/work/my-ai-os/" },
    ],
  },
  {
    title: "Ventures",
    links: [
      { label: "NKT Group", href: "/ventures/" },
      { label: "NKT Charge Hub", href: "/ventures/nkt-charge-hub/" },
      { label: "NKT Vessels House", href: "/ventures/nkt-vessels-house/" },
      { label: "Nedumpurath Towers", href: "/ventures/nedumpurath-towers/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms & Disclaimer", href: "/terms/" },
      { label: "Cookie & Privacy Controls", href: "/cookies/" },
    ],
  },
] as const;

/** Machine-readable endpoints exposed by the site. */
export const ENDPOINTS = {
  sitemap: "/sitemap.xml",
  robots: "/robots.txt",
  rss: "/feed.xml",
  manifest: "/site.webmanifest",
} as const;

/** Canonical site name used by copyright lines. */
export const COPYRIGHT_START_YEAR = 2026;
