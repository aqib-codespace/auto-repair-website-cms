import Hero from "./sections/Hero";
import Makes from "./sections/Makes";
import Services from "./sections/Services";
import WhyUs from "./sections/WhyUs";
import About from "./sections/About";
import Process from "./sections/Process";
import Reviews from "./sections/Reviews";
import CtaBand from "./sections/CtaBand";
import Financing from "./sections/Financing";
import Gallery from "./sections/Gallery";
import Faq from "./sections/Faq";
import Contact from "./sections/Contact";

/**
 * ATELIER — editorial design.
 *
 * Renders the identical content object Momentum receives. Two things are worth
 * noticing about the order:
 *
 *   • The story (About) comes earlier than in Momentum. This design sells craft
 *     and provenance, so the shop's history is an argument rather than a footnote.
 *   • The mid-page CTA sits after the reviews instead of before them, because the
 *     reviews here are long-form and are the strongest thing on the page.
 *
 * Same content, different argument — which is the point of having two templates
 * rather than one with a colour switch.
 */
export default function TorqueHome({ content }) {
  const { settings, blocks, collections } = content;
  const showFinancing = Boolean(settings.financingEnabled && blocks.financing);

  /**
   * The numerals beside each section eyebrow read as a table of contents, so they
   * have to match the order the visitor actually scrolls through — and close up
   * when a shop turns financing off rather than leaving a gap at 06. Numbering
   * here, in the one file that decides the order, is the only way those two facts
   * cannot drift apart.
   */
  const order = [
    "services",
    "about",
    "whyUs",
    "process",
    "reviews",
    "gallery",
    ...(showFinancing ? ["financing"] : []),
    "faq",
    "contact",
  ];
  const number = (key) => order.indexOf(key) + 1;

  return (
    <>
      <Hero
        hero={blocks.hero}
        settings={settings}
        ratingLabel={blocks.reviewsIntro?.ratingLabel}
      />
      <Makes makes={blocks.makes} />
      <Services
        intro={blocks.servicesIntro}
        services={collections.services}
        scheduleUrl={settings.scheduleUrl}
        number={number("services")}
      />
      <About about={blocks.about} scheduleUrl={settings.scheduleUrl} number={number("about")} />
      <WhyUs whyUs={blocks.whyUs} number={number("whyUs")} />
      <Process process={blocks.process} number={number("process")} />
      <Reviews
        intro={blocks.reviewsIntro}
        testimonials={collections.testimonials}
        number={number("reviews")}
      />
      <CtaBand ctaBand={blocks.ctaBand} settings={settings} />
      <Gallery
        intro={blocks.galleryIntro}
        items={collections.gallery}
        number={number("gallery")}
      />
      {/* Financing is optional per shop — toggled in Settings, not by the design. */}
      {showFinancing && (
        <Financing financing={blocks.financing} number={number("financing")} />
      )}
      <Faq
        intro={blocks.faqIntro}
        faqs={collections.faqs}
        settings={settings}
        number={number("faq")}
      />
      <Contact contact={blocks.contact} settings={settings} number={number("contact")} />
    </>
  );
}
