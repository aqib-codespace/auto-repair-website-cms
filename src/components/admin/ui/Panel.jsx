import { cn } from "@/lib/utils";

/** The admin card surface. */
export default function Panel({ title, description, actions, padded = true, className, children }) {
  return (
    <section
      className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-sm", className)}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}
