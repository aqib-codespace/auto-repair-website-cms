import { getSiteContent } from "@/db/queries/site-content";
import { resolveTemplate } from "@/lib/templates/resolve";

/**
 * The homepage is a thin shell: fetch the content contract once, hand it to
 * whichever template is active, and emit the structured data.
 *
 * Structured data lives here rather than in a template because it describes the
 * *business*, not the design — both templates must produce identical schema, and
 * duplicating it per template would guarantee they eventually drift.
 */
export default async function HomePage() {
  const content = await getSiteContent();
  const { settings, blocks, collections } = content;
  const template = resolveTemplate(settings.template);

  const ratings = collections.testimonials.map((t) => Number(t.rating) || 0).filter(Boolean);
  const averageRating = ratings.length
    ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRepair",
        "@id": `${settings.siteUrl}#business`,
        name: settings.company,
        description: settings.metaDescription,
        url: settings.siteUrl,
        telephone: settings.phone,
        email: settings.email,
        image: `${settings.siteUrl}${blocks.hero.image.src}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.addressLine1,
          description: settings.addressLine2,
        },
        ...(averageRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: collections.testimonials.length,
          },
        }),
        makesOffer: collections.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: collections.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data must be raw JSON, not JSX text.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <template.Home content={content} />
    </>
  );
}
