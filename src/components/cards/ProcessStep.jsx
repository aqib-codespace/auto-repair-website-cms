import Icon from "@/components/ui/Icon";

/**
 * One node of the five-step process rail. The connector line between steps is
 * drawn by the parent section, so this stays position-agnostic whether the rail
 * runs horizontally (desktop) or vertically (mobile).
 */
export default function ProcessStep({ step, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative flex gap-6 sm:block">
      <div className="relative shrink-0">
        <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-brand shadow-soft transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-brand group-hover:bg-brand group-hover:text-white group-hover:shadow-glow">
          <Icon name={step.icon} className="h-7 w-7" />
        </span>
        <span className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[0.62rem] font-bold text-white ring-4 ring-slate-50 transition-colors duration-500 group-hover:bg-accent group-hover:text-ink">
          {number}
        </span>
      </div>

      <div className="pb-10 sm:pb-0 sm:pt-7">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand sm:hidden">
          Step {number}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-ink sm:mt-0 xl:text-xl">
          {step.title}
        </h3>
        <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-slate-600">
          {step.description}
        </p>
      </div>
    </div>
  );
}
