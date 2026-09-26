import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { buildMetadata } from "@/lib/seo";
import { COOKIE_POLICY } from "@/content/legal";

const doc = COOKIE_POLICY;

export const metadata: Metadata = buildMetadata({
  path: doc.path,
  title: doc.seoTitle,
  description: doc.description,
  ogImage: "/images/og/og-cookies.jpg",
  ogImageAlt: "Cookie and privacy controls",
  keywords: doc.keywords,
  titleAbsolute: true,
});

export default function CookiesPage() {
  return <LegalDocumentPage doc={doc} breadcrumbLabel="Cookies" />;
}
