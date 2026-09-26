import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { buildMetadata } from "@/lib/seo";
import { TERMS } from "@/content/legal";

const doc = TERMS;

export const metadata: Metadata = buildMetadata({
  path: doc.path,
  title: doc.seoTitle,
  description: doc.description,
  ogImage: "/images/og/og-terms.jpg",
  ogImageAlt: "Terms of Use and Disclaimer",
  keywords: doc.keywords,
  titleAbsolute: true,
});

export default function TermsPage() {
  return <LegalDocumentPage doc={doc} breadcrumbLabel="Terms & Disclaimer" />;
}
