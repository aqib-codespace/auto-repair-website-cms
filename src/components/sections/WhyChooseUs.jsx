import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FeatureCard from "@/components/cards/FeatureCard";

/**
 * Four-column promises row on an inverted background — the tonal break here is
 * what gives the page its rhythm between the services grid and the shop story.
 */
export default function WhyChooseUs({ whyUs }) {
  return (
    <Section tone="ink" containerSize="wide" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="surface-grid absolute inset-0 opacity-60" />
        <span className="orb left-1/2 top-[-30%] h-[30rem] w-[30rem] -translate-x-1/2 bg-brand opacity-40" />
      </div>

      <Reveal>
        <SectionHeading
          eyebrow={whyUs?.eyebrow}
          heading={whyUs?.heading}
          body={whyUs?.body}
          tone="light"
        />
      </Reveal>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        {whyUs?.features?.map((feature, index) => (
          <Reveal
            as="li"
            key={feature.title}
            delay={Math.min(index, 4) * 80}
            className="h-full"
          >
            <FeatureCard feature={feature} index={index} tone="ink" />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
