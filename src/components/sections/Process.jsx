import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ProcessStep from "@/components/cards/ProcessStep";

/**
 * Five-step rail: horizontal on desktop with a connector running behind the
 * icons, vertical on mobile with the same line drawn down the gutter. The
 * gradient in the connector implies direction without an arrow graphic.
 */
export default function Process({ process }) {
  const steps = process?.steps ?? [];

  return (
    <Section tone="muted" containerSize="wide">
      <Reveal>
        <SectionHeading eyebrow={process?.eyebrow} heading={process?.heading} body={process?.body} />
      </Reveal>

      <div className="relative mt-18">
        <div
          aria-hidden="true"
          className="absolute left-8 right-8 top-8 hidden h-0.5 bg-linear-to-r from-slate-200 via-brand/40 to-slate-200 sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-12 left-8 top-6 w-0.5 bg-linear-to-b from-slate-200 via-brand/40 to-slate-200 sm:hidden"
        />

        <ol className="relative grid gap-0 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-5 lg:gap-x-6">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={Math.min(index, 5) * 90}>
              <ProcessStep step={step} index={index} />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
