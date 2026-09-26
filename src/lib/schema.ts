/**
 * ============================================================================
 *  JSON-LD (schema.org) builders
 * ============================================================================
 *  Every entity is emitted once with a stable `@id`, then referenced from other
 *  nodes via `{ "@id": ... }`. That is what lets Google merge the Person, the
 *  Organization and the WebPage into one knowledge graph instead of guessing.
 * ============================================================================
 */
import {
  SITE,
  ID,
  url,
  ORGANIZATION,
  PERSON,
  SAME_AS,
  CHARGE_HUB,
  isFilled,
} from "./site";

export type JsonLdNode = Record<string, unknown>;

/** Drop empty/undefined keys so we never emit `"telephone": ""`. */
function clean<T extends JsonLdNode>(node: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}

/** Wrap nodes in a single `@graph` document. */
export function graph(...nodes: JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.map((n) => clean(n)),
  };
}

/* -------------------------------------------------------------------------- */
/*  Site-wide entities (rendered from the root layout on every page)          */
/* -------------------------------------------------------------------------- */

export function postalAddress(input: {
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}): JsonLdNode {
  return clean({
    "@type": "PostalAddress",
    streetAddress: input.streetAddress,
    addressLocality: input.addressLocality,
    addressRegion: input.addressRegion,
    postalCode: input.postalCode,
    addressCountry: input.addressCountry,
  });
}

export function logoNode(): JsonLdNode {
  return {
    "@type": "ImageObject",
    "@id": ID.logo,
    url: url(ORGANIZATION.logo),
    contentUrl: url(ORGANIZATION.logo),
    width: 512,
    height: 512,
    caption: `${ORGANIZATION.name} logo`,
  };
}

/** Organization schema — NKT Group (Nedumpurath Group). */
export function organizationNode(): JsonLdNode {
  return clean({
    "@type": ["Organization", "LocalBusiness"],
    "@id": ID.organization,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    alternateName: [...ORGANIZATION.alternateName],
    description: ORGANIZATION.description,
    slogan: ORGANIZATION.slogan,
    foundingDate: ORGANIZATION.foundingDate,
    foundingLocation: ORGANIZATION.address.addressLocality,
    founder: { "@type": "Person", name: ORGANIZATION.founderName },
    employee: { "@id": ID.person },
    url: url("/ventures/"),
    logo: { "@id": ID.logo },
    image: { "@id": ID.logo },
    address: postalAddress(ORGANIZATION.address),
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORGANIZATION.geo.latitude,
      longitude: ORGANIZATION.geo.longitude,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: ORGANIZATION.areaServed,
    },
    email: isFilled(ORGANIZATION.email) ? ORGANIZATION.email : undefined,
    telephone: isFilled(ORGANIZATION.telephone) ? ORGANIZATION.telephone : undefined,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "business enquiries",
        url: url("/contact/"),
        areaServed: "IN",
        availableLanguage: ["en", "ml"],
      },
    ],
    knowsAbout: [...ORGANIZATION.ventures.map((v) => v.name)],
    subOrganization: ORGANIZATION.ventures.map((v) =>
      clean({
        "@type": "Organization",
        name: v.name,
        url: url(v.path),
        description: v.description,
      }),
    ),
    sameAs: SAME_AS,
  });
}

/** Person schema — George S. Thomas, with a knowsAbout/sameAs trail. */
export function personNode(options: { profilePagePath?: string } = {}): JsonLdNode {
  return clean({
    "@type": "Person",
    "@id": ID.person,
    name: PERSON.name,
    alternateName: [...PERSON.alternateName],
    givenName: PERSON.givenName,
    additionalName: PERSON.additionalName,
    familyName: PERSON.familyName,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    url: url("/about/"),
    mainEntityOfPage: options.profilePagePath
      ? { "@id": ID.webpage(options.profilePagePath) }
      : undefined,
    image: {
      "@type": "ImageObject",
      "@id": url("/about/#portrait"),
      url: url(PERSON.image),
      contentUrl: url(PERSON.image),
      width: 960,
      height: 960,
      caption: PERSON.imageAlt,
    },
    worksFor: { "@id": ID.organization },
    knowsAbout: [...PERSON.knowsAbout],
    address: postalAddress(PERSON.address),
    homeLocation: {
      "@type": "Place",
      name: PERSON.locationLabel,
      geo: {
        "@type": "GeoCoordinates",
        latitude: PERSON.geo.latitude,
        longitude: PERSON.geo.longitude,
      },
    },
    email: isFilled(PERSON.email) ? PERSON.email : undefined,
    telephone: isFilled(PERSON.telephone) ? PERSON.telephone : undefined,
    sameAs: SAME_AS,
  });
}

/** WebSite schema with the publisher relationship. */
export function webSiteNode(): JsonLdNode {
  return clean({
    "@type": "WebSite",
    "@id": ID.website,
    url: url("/"),
    name: `${SITE.name} — ${SITE.shortName}`,
    alternateName: SITE.shortName,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { "@id": ID.organization },
    about: { "@id": ID.person },
    copyrightHolder: { "@id": ID.person },
    copyrightYear: new Date().getFullYear(),
    sameAs: SAME_AS,
  });
}

/* -------------------------------------------------------------------------- */
/*  Page-level entities                                                       */
/* -------------------------------------------------------------------------- */

export function webPageNode(input: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
  primaryImage?: { url: string; width?: number; height?: number; caption?: string };
  aboutId?: string;
  mainEntityId?: string;
  breadcrumbId?: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: readonly string[];
}): JsonLdNode {
  const pageId = ID.webpage(input.path);
  return clean({
    "@type": input.type || "WebPage",
    "@id": pageId,
    url: url(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": ID.website },
    inLanguage: SITE.lang,
    about: input.aboutId ? { "@id": input.aboutId } : undefined,
    mainEntity: input.mainEntityId ? { "@id": input.mainEntityId } : undefined,
    breadcrumb: input.breadcrumbId ? { "@id": input.breadcrumbId } : undefined,
    primaryImageOfPage: input.primaryImage
      ? {
          "@type": "ImageObject",
          "@id": ID.primaryImage(input.path),
          url: url(input.primaryImage.url),
          contentUrl: url(input.primaryImage.url),
          width: input.primaryImage.width ?? 1200,
          height: input.primaryImage.height ?? 630,
          caption: input.primaryImage.caption,
        }
      : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    keywords: input.keywords ? [...input.keywords].join(", ") : undefined,
    publisher: { "@id": ID.organization },
    author: { "@id": ID.person },
    potentialAction: {
      "@type": "ReadAction",
      target: [url(input.path)],
    },
  });
}

/** BreadcrumbList from an ordered trail (excluding the trailing current page). */
export function breadcrumbNode(
  path: string,
  trail: { name: string; path: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": ID.breadcrumb(path),
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

/** BlogPosting / Article schema for editorial pages. */
export function articleNode(input: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  imageCaption?: string;
  wordCount?: number;
  articleSection: string;
  keywords?: readonly string[];
  type?: "BlogPosting" | "Article" | "TechArticle";
}): JsonLdNode {
  return clean({
    "@type": input.type || "BlogPosting",
    "@id": ID.article(input.path),
    isPartOf: { "@id": ID.website },
    mainEntityOfPage: { "@id": ID.webpage(input.path) },
    headline: input.headline,
    description: input.description,
    url: url(input.path),
    inLanguage: SITE.lang,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    articleSection: input.articleSection,
    keywords: input.keywords ? [...input.keywords].join(", ") : undefined,
    wordCount: input.wordCount,
    image: {
      "@type": "ImageObject",
      "@id": `${url(input.path)}#primaryimage`,
      url: url(input.image),
      contentUrl: url(input.image),
      width: 1200,
      height: 630,
      caption: input.imageCaption,
    },
    author: {
      "@type": "Person",
      "@id": ID.person,
      name: PERSON.name,
      url: url("/about/"),
      sameAs: SAME_AS,
    },
    publisher: { "@id": ID.organization },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-lede"],
    },
  });
}

/** FAQPage schema — used on the charging-station page and any Q&A content. */
export function faqNode(path: string, faqs: readonly { question: string; answer: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${url(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** LocalBusiness + Service schema for NKT Charge Hub. */
export function chargingStationNode(): JsonLdNode {
  return clean({
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    "@id": ID.chargingStation,
    name: CHARGE_HUB.name,
    legalName: CHARGE_HUB.legalName,
    description: CHARGE_HUB.description,
    url: url("/ventures/nkt-charge-hub/"),
    parentOrganization: { "@id": ID.organization },
    image: url("/images/og/og-nkt-charge-hub.jpg"),
    logo: { "@id": ID.logo },
    address: postalAddress(ORGANIZATION.address),
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORGANIZATION.geo.latitude,
      longitude: ORGANIZATION.geo.longitude,
    },
    areaServed: { "@type": "AdministrativeArea", name: ORGANIZATION.areaServed },
    openingHours: CHARGE_HUB.openingHours,
    priceRange: isFilled(CHARGE_HUB.priceRange) ? CHARGE_HUB.priceRange : undefined,
    paymentAccepted: isFilled(CHARGE_HUB.paymentAccepted)
      ? CHARGE_HUB.paymentAccepted
      : undefined,
    hasMap: isFilled(CHARGE_HUB.mapUrl) ? CHARGE_HUB.mapUrl : undefined,
    amenityFeature: CHARGE_HUB.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    keywords: "EV charging station, DC fast charging, Thodupuzha, Kerala",
    knowsAbout: [...PERSON.knowsAbout],
    sameAs: SAME_AS,
    /** The charging service itself, described separately. */
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Public EV DC fast charging",
        serviceType: "Electric vehicle charging",
        description: CHARGE_HUB.description,
        provider: { "@id": ID.organization },
        areaServed: { "@type": "AdministrativeArea", name: ORGANIZATION.areaServed },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceLocation: { "@id": ID.chargingStation },
          serviceUrl: url("/ventures/nkt-charge-hub/"),
        },
      },
    },
  });
}

/** SoftwareApplication / Project schema for the project pages. */
export function projectNode(input: {
  path: string;
  name: string;
  description: string;
  type: "SoftwareApplication" | "Project" | "WebApplication";
  applicationCategory?: string;
  operatingSystem?: string;
  keywords?: readonly string[];
  codeRepository?: string;
  image?: string;
  status?: string;
  creatorId?: string;
}): JsonLdNode {
  const base: JsonLdNode = {
    "@type": input.type,
    "@id": `${url(input.path)}#project`,
    name: input.name,
    description: input.description,
    url: url(input.path),
    image: input.image ? url(input.image) : undefined,
    keywords: input.keywords ? [...input.keywords].join(", ") : undefined,
    creator: { "@id": input.creatorId || ID.person },
    maintainer: { "@id": ID.person },
    publisher: { "@id": ID.organization },
    sameAs: input.codeRepository,
    isPartOf: { "@id": ID.website },
    inLanguage: SITE.lang,
  };
  if (input.type === "SoftwareApplication" || input.type === "WebApplication") {
    base.applicationCategory = input.applicationCategory;
    base.operatingSystem = input.operatingSystem;
    base.softwareVersion = input.status;
    base.offers = { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/PreOrder" };
  }
  if (input.type === "Project") {
    base.foundingDate = undefined;
    base.creativeWorkStatus = input.status;
    base.about = { "@id": ID.organization };
    base.member = { "@id": ID.person };
  }
  return clean(base);
}

/** ItemList for collection pages (project index, blog index). */
export function itemListNode(
  path: string,
  name: string,
  items: readonly { name: string; path: string; description?: string }[],
): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": `${url(path)}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: url(item.path),
    })),
  };
}

/** Blog collection node so /blog/ reads as a blog, not just a page. */
export function blogNode(
  path: string,
  posts: readonly { name: string; path: string; datePublished: string }[],
): JsonLdNode {
  return {
    "@type": "Blog",
    "@id": `${url(path)}#blog`,
    name: `${SITE.name} — Writing`,
    description:
      "Field notes on EV charging infrastructure, homelab systems, creator workflows and building software in Kerala.",
    url: url(path),
    inLanguage: SITE.lang,
    publisher: { "@id": ID.organization },
    author: { "@id": ID.person },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": ID.article(p.path),
      headline: p.name,
      url: url(p.path),
      datePublished: p.datePublished,
      author: { "@id": ID.person },
    })),
  };
}
