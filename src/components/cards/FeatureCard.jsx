import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * A "why choose us" promise. Renders as a frosted panel on dark sections and a
 * plain column on light ones, so the same data drives either treatment.
 */
export default function FeatureCard({ feature, index, tone = "light" }) {
  const ink = tone === "ink";

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-3xl p-7 transition-all duration-500 xl:p-8",
        ink
          ? "glass hover:-translate-y-1.5 hover:border-white/25"
          : "border border-slate-200/80 bg-white shadow-soft hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-card",
      )}
    >
      {typeof index === "number" && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-6 top-5 font-display text-2xl font-extrabold",
            ink ? "text-white/10" : "text-slate-100",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <span
        className={cn(
          "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105",
          ink
            ? "bg-accent/12 text-accent ring-1 ring-inset ring-accent/20 group-hover:bg-accent group-hover:text-ink"
            : "bg-brand-light text-brand ring-1 ring-inset ring-brand/10 group-hover:bg-brand group-hover:text-white",
        )}
      >
        <Icon name={feature.icon} className="h-7 w-7" />
      </span>

      <h3
        className={cn(
          "font-display text-lg font-bold tracking-tight xl:text-xl",
          ink ? "text-white" : "text-ink",
        )}
      >
        {feature.title}
      </h3>
      <p
        className={cn(
          "mt-3 text-sm leading-relaxed",
          ink ? "text-white/60" : "text-slate-600",
        )}
      >
        {feature.description}
      </p>
    </div>
  );
}
