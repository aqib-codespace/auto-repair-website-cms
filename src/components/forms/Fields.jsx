import { cn } from "@/lib/utils";

/**
 * Public-site form primitives. One control surface, one error treatment, one
 * label style — reused by the appointment form and available to any future
 * form (quote request, fleet enquiry) without restyling.
 */

const CONTROL =
  "w-full rounded-xl border bg-white px-4 text-[0.95rem] text-ink shadow-soft transition-colors " +
  "placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
      {required && (
        <span className="ml-0.5 text-brand" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ id, error }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-red-600">
      {Array.isArray(error) ? error[0] : error}
    </p>
  );
}

export function FormInput({
  name,
  label,
  type = "text",
  error,
  required = false,
  className,
  ...props
}) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, "h-12", error ? "border-red-300" : "border-slate-200")}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function FormSelect({
  name,
  label,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  className,
  ...props
}) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, "h-12 appearance-none pr-10", error ? "border-red-300" : "border-slate-200")}
        style={{
          // Chevron drawn inline so the control needs no wrapper element.
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.85rem center",
          backgroundSize: "1.15rem",
        }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function FormTextarea({
  name,
  label,
  rows = 4,
  error,
  required = false,
  className,
  ...props
}) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, "py-3", error ? "border-red-300" : "border-slate-200")}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}
