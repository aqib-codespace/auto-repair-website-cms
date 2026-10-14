import Frame from "../ui/Frame";

/**
 * The same makes list Momentum scrolls as an animated marquee is set here as a
 * static, centred line of small caps separated by dots — a colophon. Motion would
 * be the wrong register for this template.
 */
export default function TorqueMakes({ makes }) {
  const items = makes?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section aria-label="Makes we service" className="border-t border-clay-200 bg-bone-deep py-10">
      <Frame>
        {makes.heading && (
          <p className="text-center text-[0.68rem] uppercase tracking-[0.24em] text-clay-500">
            {makes.heading}
          </p>
        )}
        <p className="mt-5 text-center font-condensed text-[0.98rem] leading-relaxed text-clay-700">
          {items.map((item, index) => (
            <span key={item}>
              {item}
              {index < items.length - 1 && (
                <span aria-hidden="true" className="mx-2.5 text-clay-300">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>
      </Frame>
    </section>
  );
}
