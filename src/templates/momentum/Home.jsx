import Hero from "@/components/sections/Hero";
import MakesStrip from "@/components/sections/MakesStrip";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Reviews from "@/components/sections/Reviews";
import CtaBand from "@/components/sections/CtaBand";
import Financing from "@/components/sections/Financing";
import Gallery from "@/components/sections/Gallery";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

/**
 * MOMENTUM — the original design.
 *
 * Section order is the conversion path: promise → capability → credibility →
 * process → proof → action. Reordering the page is reordering this list, and
 * removing a section is deleting one line.
 *
 * Every template receives the same `content` object (see
 * src/db/queries/site-content.js) and decides what to do with it.
 */
export default function MomentumHome({ content }) {
  const { settings, blocks, collections } = content;

  return (
    <>
      <Hero hero={blocks.hero} settings={settings} ratingLabel={blocks.reviewsIntro?.ratingLabel} />
      <MakesStrip makes={blocks.makes} />
      <Services
        intro={blocks.servicesIntro}
        services={collections.services}
        scheduleUrl={settings.scheduleUrl}
      />
      <WhyChooseUs whyUs={blocks.whyUs} />
      <About about={blocks.about} scheduleUrl={settings.scheduleUrl} />
      <Process process={blocks.process} />
      <Reviews intro={blocks.reviewsIntro} testimonials={collections.testimonials} />
      <CtaBand ctaBand={blocks.ctaBand} settings={settings} />
      {/* Financing is optional per shop — toggled in Settings. */}
      {settings.financingEnabled && blocks.financing && <Financing financing={blocks.financing} />}
      <Gallery
        intro={blocks.galleryIntro}
        items={collections.gallery}
        scheduleUrl={settings.scheduleUrl}
      />
      <Faq intro={blocks.faqIntro} faqs={collections.faqs} settings={settings} />
      <Contact contact={blocks.contact} settings={settings} />
    </>
  );
}
