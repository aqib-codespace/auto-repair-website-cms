import Container from "@/components/ui/Container";

/**
 * Continuously scrolling band of vehicle makes.
 *
 * The track holds the list twice and translates -50%, so the loop is seamless
 * with no JavaScript. Edge masking keeps the entry/exit soft, and the whole
 * animation stops for reduced-motion users (globals.css) while the names stay
 * readable — the content is never motion-dependent.
 */
export default function MakesStrip({ makes }) {
  const items = makes?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section aria-label="Makes we service" className="border-b border-slate-200/70 bg-white py-10">
      <Container size="wide">
        {makes.heading && (
          <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {makes.heading}
          </p>
        )}

        <div className="marquee-mask mt-7 flex overflow-hidden">
          <ul className="marquee-track flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
            {items.map((item) => (
              <li
                key={item}
                className="font-display text-lg font-bold uppercase tracking-[0.08em] text-slate-300 transition-colors duration-300 hover:text-brand sm:text-xl"
              >
                {item}
              </li>
            ))}
          </ul>
          {/* Duplicate copy completes the loop; hidden from assistive tech. */}
          <ul
            aria-hidden="true"
            className="marquee-track flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
          >
            {items.map((item) => (
              <li
                key={`${item}-dup`}
                className="font-display text-lg font-bold uppercase tracking-[0.08em] text-slate-300 sm:text-xl"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
