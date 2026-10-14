import { cn } from "@/lib/utils";

/** Shown when a collection, inbox, or media library has nothing in it yet. */
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
