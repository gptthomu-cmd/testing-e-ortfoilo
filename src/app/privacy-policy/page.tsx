import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { buildMetadata } from "@/lib/seo";
import { PRIVACY_POLICY } from "@/content/legal";

const doc = PRIVACY_POLICY;

export const metadata: Metadata = buildMetadata({
  path: doc.path,
  title: doc.seoTitle,
  description: doc.description,
  ogImage: "/images/og/og-privacy-policy.jpg",
  ogImageAlt: "Privacy Policy for this website",
  keywords: doc.keywords,
  titleAbsolute: true,
});

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage doc={doc} breadcrumbLabel="Privacy Policy" />;
}
