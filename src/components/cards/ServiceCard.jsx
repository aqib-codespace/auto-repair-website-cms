import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/ui/Icon";

/**
 * One service tile.
 *
 * The whole card is the click target and lands on the booking form — every
 * service block is a path to conversion, not a dead end. Hover state does four
 * things at once (lift, brand rule, filled icon, light sweep) which is what
 * separates a premium card from a bordered box.
 */
export default function ServiceCard({ service, href = "#contact", index }) {
  return (
    <a
      href={href}
      aria-label={`Schedule ${service.title}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-card xl:p-8"
    >
      {/* Brand rule that draws across the top edge on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-brand to-accent transition-transform duration-500 group-hover:scale-x-100"
      />
      {/* Light sweep. */}
      <span
        aria-hidden="true"
        className="sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-brand/[0.07] to-transparent"
      />

      {typeof index === "number" && (
        <span
          aria-hidden="true"
          className="absolute right-6 top-5 font-display text-2xl font-extrabold text-slate-100 transition-colors duration-500 group-hover:text-brand/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <span className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand ring-1 ring-inset ring-brand/10 transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
        <Icon name={service.icon} className="h-7 w-7" />
      </span>

      <h3 className="relative font-display text-lg font-bold tracking-tight text-ink xl:text-xl">
        {service.title}
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {service.description}
      </p>

      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        Book this service
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
