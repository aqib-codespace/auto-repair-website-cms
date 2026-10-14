import LegalDocument from "@/components/sections/LegalDocument";
import { getContentBlock } from "@/db/queries/content";

export async function generateMetadata() {
  const block = await getContentBlock("legal_terms");
  return { title: block?.heading ?? "Terms of Service", robots: { index: false, follow: true } };
}

export default async function TermsPage() {
  const block = await getContentBlock("legal_terms");
  return <LegalDocument block={block} />;
}
