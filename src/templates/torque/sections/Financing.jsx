import Image from "next/image";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Reveal from "@/components/ui/Reveal";

/**
 * The owner-facing financing module.
 *
 * REMOVABLE: rendered only when Settings → "Show financing section" is on, and
 * the nav/footer link disappears with it — the same behaviour as Momentum, since
 * that switch belongs to the site rather than to a design.
 */
export default function TorqueFinancing({ financing, number }) {
  return (
    <Band id="financing" frameSize="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Reveal variant="left">
            <Kicker index={number}>{financing?.eyebrow}</Kicker>
            <Display className="mt-5">{financing?.heading}</Display>
            <p className="mt-5 max-w-xl leading-relaxed text-clay-700">{financing?.body}</p>
          </Reveal>

          {financing?.bullets?.length > 0 && (
            <Reveal variant="left" delay={70}>
              <ul className="mt-8 border-t border-clay-200">
                {financing.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="border-b border-clay-200 py-3.5 text-[0.9rem] leading-relaxed text-clay-700"
                  >
                    <span aria-hidden="true" className="mr-3 text-terra">
                      —
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal variant="left" delay={120}>
            <Action href={financing?.ctaHref || "#contact"} variant="terra" className="mt-8">
              {financing?.ctaLabel}
            </Action>
            <p className="mt-4 max-w-md text-[0.72rem] leading-relaxed text-clay-500">
              Financing availability, terms, and approval are determined by the lender and are
              subject to credit review.
            </p>
          </Reveal>
        </div>

        <Reveal variant="right" delay={60} className="lg:col-span-5">
          <div className="relative aspect-4/5 w-full overflow-hidden">
            <Image
              src={financing.image.src}
              alt={financing.image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Band>
  );
}
