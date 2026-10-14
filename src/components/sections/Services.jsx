import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ServiceCard from "@/components/cards/ServiceCard";

/**
 * The services grid — four across on desktop, two on tablet, one on phone.
 * Cards are data-driven, so adding a ninth service is one database row.
 */
export default function Services({ intro, services, scheduleUrl }) {
  return (
    <Section id="services" tone="white" containerSize="wide">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Reveal variant="left" className="flex-1">
          <SectionHeading
            eyebrow={intro?.eyebrow}
            heading={intro?.heading}
            body={intro?.body}
            align="left"
            className="max-w-2xl"
          />
        </Reveal>
        <Reveal variant="right" className="shrink-0">
          <Button href={scheduleUrl || "#contact"} variant="dark" className="group">
            Book an inspection
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Button>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {services.map((service, index) => (
          <Reveal
            as="li"
            key={service.id}
            variant="scale"
            delay={Math.min(index, 4) * 70}
            className="h-full"
          >
            <ServiceCard service={service} href={scheduleUrl || "#contact"} index={index} />
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 px-7 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-ink">Not sure what you need?</span> Describe the
          symptom and we&apos;ll diagnose it — most inspections are same-day.
        </p>
        <Button href="#contact" variant="outline" size="md" className="shrink-0">
          Ask about your vehicle
        </Button>
      </Reveal>
    </Section>
  );
}
