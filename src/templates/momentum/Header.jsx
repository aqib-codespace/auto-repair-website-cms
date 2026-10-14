import Header from "@/components/layout/Header";

/**
 * Momentum's chrome is the existing sticky header, which needs the first hours
 * row from the contact block for its utility bar.
 */
export default function MomentumHeader({ content }) {
  const hours = content.blocks.contact?.hours ?? [];
  const hoursSummary = hours[0] ? `${hours[0].days}: ${hours[0].hours}` : "";

  return <Header settings={content.settings} hoursSummary={hoursSummary} />;
}
