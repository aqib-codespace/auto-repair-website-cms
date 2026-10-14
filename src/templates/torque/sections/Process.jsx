import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Reveal from "@/components/ui/Reveal";

/**
 * The five steps as a vertical ruled list. Momentum draws a horizontal rail with
 * icon medallions; a vertical sequence reads better in an editorial column and
 * removes the gradient connector, which would look out of place here.
 */
export default function TorqueProcess({ process, number }) {
  const steps = process?.steps ?? [];

  return (
    <Band frameSize="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Reveal variant="left" className="lg:sticky lg:top-10">
            <Kicker index={number}>{process?.eyebrow}</Kicker>
            <Display className="mt-5">{process?.heading}</Display>
            {process?.body && (
              <p className="mt-5 max-w-sm leading-relaxed text-clay-700">{process.body}</p>
            )}
          </Reveal>
        </div>

        <ol className="lg:col-span-8">
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              variant="right"
              delay={Math.min(index, 5) * 50}
              className="border-t border-clay-200"
            >
              <div className="grid gap-2 py-7 sm:grid-cols-12 sm:gap-6">
                <span className="font-condensed text-[1.5rem] leading-none text-clay-300 sm:col-span-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-condensed text-[1.2rem] text-clay-900 sm:col-span-4">
                  {step.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-clay-700 sm:col-span-6">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
}
