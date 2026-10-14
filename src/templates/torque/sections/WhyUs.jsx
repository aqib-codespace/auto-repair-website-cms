import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Reveal from "@/components/ui/Reveal";

/**
 * Promises set as a two-column spread with oversized serif numerals. The icons
 * Momentum leans on are dropped deliberately — in an editorial layout the numeral
 * carries the hierarchy and an icon beside it would be redundant decoration.
 */
export default function TorqueWhyUs({ whyUs, number }) {
  const features = whyUs?.features ?? [];

  return (
    <Band tone="deep" frameSize="wide">
      <Reveal className="max-w-2xl">
        <Kicker index={number}>{whyUs?.eyebrow}</Kicker>
        <Display className="mt-5">{whyUs?.heading}</Display>
        {whyUs?.body && <p className="mt-5 leading-relaxed text-clay-700">{whyUs.body}</p>}
      </Reveal>

      <ul className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
        {features.map((feature, index) => (
          <Reveal as="li" key={feature.title} delay={Math.min(index, 4) * 60}>
            <div className="flex gap-5 border-t border-clay-200 pt-6">
              <span className="font-condensed text-[2.4rem] leading-none text-clay-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-condensed text-[1.2rem] text-clay-900">{feature.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-clay-700">
                  {feature.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
