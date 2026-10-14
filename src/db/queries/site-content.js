import "server-only";
import { cache } from "react";
import {
  getSiteSettings,
  getContentBlock,
  getServices,
  getTestimonials,
  getFaqs,
  getGalleryItems,
} from "./content";

/**
 * ---------------------------------------------------------------------------
 * THE CONTENT CONTRACT
 * ---------------------------------------------------------------------------
 * Every template renders from this one object. That is the whole reason
 * switching designs is safe: a template chooses how content looks, never what
 * content exists, so it cannot quietly depend on a field the other template
 * doesn't read, and adding a template never touches the data layer.
 *
 * Shape:
 *   { settings, blocks: { hero, about, … }, collections: { services, … } }
 *
 * Adding a section means adding one key to `blocks` here plus a block in the
 * registry — and then each template decides whether to render it. A template
 * that ignores a block is a design decision, not a bug.
 *
 * Every underlying reader is React-cache()-wrapped, so composing them here costs
 * nothing extra and the layout and page share one set of queries per request.
 */
export const getSiteContent = cache(async () => {
  const [
    settings,
    hero,
    makes,
    servicesIntro,
    whyUs,
    about,
    process,
    reviewsIntro,
    ctaBand,
    financing,
    galleryIntro,
    faqIntro,
    contact,
    footer,
    services,
    testimonials,
    faqs,
    gallery,
  ] = await Promise.all([
    getSiteSettings(),
    getContentBlock("hero"),
    getContentBlock("makes"),
    getContentBlock("services_intro"),
    getContentBlock("why_us"),
    getContentBlock("about"),
    getContentBlock("process"),
    getContentBlock("reviews_intro"),
    getContentBlock("cta_band"),
    getContentBlock("financing"),
    getContentBlock("gallery_intro"),
    getContentBlock("faq_intro"),
    getContentBlock("contact"),
    getContentBlock("footer"),
    getServices(),
    getTestimonials(),
    getFaqs(),
    getGalleryItems(),
  ]);

  return {
    settings,
    blocks: {
      hero,
      makes,
      servicesIntro,
      whyUs,
      about,
      process,
      reviewsIntro,
      ctaBand,
      financing,
      galleryIntro,
      faqIntro,
      contact,
      footer,
    },
    collections: { services, testimonials, faqs, gallery },
  };
});
