import LegalDocument from "@/components/sections/LegalDocument";
import { getContentBlock } from "@/db/queries/content";

export async function generateMetadata() {
  const block = await getContentBlock("legal_privacy");
  return { title: block?.heading ?? "Privacy Policy", robots: { index: false, follow: true } };
}

export default async function PrivacyPage() {
  const block = await getContentBlock("legal_privacy");
  return <LegalDocument block={block} />;
}
