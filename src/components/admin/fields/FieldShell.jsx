import { cn } from "@/lib/utils";

export const CONTROL_CLASS =
  "w-full rounded-lg border bg-white px-3 text-sm text-slate-900 transition-colors " +
  "placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

/**
 * Label + help text + error wrapper shared by every admin field, so labels,
 * spacing, and error placement can never drift between field types.
 */
export default function FieldShell({ name, label, help, error, required, children, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-[0.82rem] font-semibold text-slate-700">
          {label}
          {required === false && (
            <span className="ml-1.5 font-normal text-slate-400">(optional)</span>
          )}
        </label>
      )}
      {children}
      {help && !error && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{help}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
