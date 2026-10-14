import FieldShell, { CONTROL_CLASS } from "./FieldShell";
import { cn } from "@/lib/utils";

/**
 * Uncontrolled primitives. They post their own values with the form, so no
 * client state is involved — the browser keeps what the user typed even if the
 * Server Action comes back with an error for a different field.
 */

const border = (error) => (error ? "border-red-300" : "border-slate-200");

export function TextField({ field, defaultValue, error }) {
  return (
    <FieldShell
      name={field.name}
      label={field.label}
      help={field.help}
      error={error}
      required={!field.optional}
    >
      <input
        id={field.name}
        name={field.name}
        type={field.inputType ?? "text"}
        defaultValue={defaultValue ?? ""}
        placeholder={field.placeholder}
        maxLength={field.max ?? undefined}
        className={cn(CONTROL_CLASS, "h-10", border(error))}
      />
    </FieldShell>
  );
}

export function TextAreaField({ field, defaultValue, error }) {
  return (
    <FieldShell
      name={field.name}
      label={field.label}
      help={field.help}
      error={error}
      required={!field.optional}
    >
      <textarea
        id={field.name}
        name={field.name}
        rows={field.rows ?? 4}
        defaultValue={defaultValue ?? ""}
        placeholder={field.placeholder}
        maxLength={field.max ?? undefined}
        className={cn(CONTROL_CLASS, "py-2.5 leading-relaxed", border(error))}
      />
    </FieldShell>
  );
}

export function NumberField({ field, defaultValue, error }) {
  return (
    <FieldShell
      name={field.name}
      label={field.label}
      help={field.help}
      error={error}
      required={!field.optional}
    >
      <input
        id={field.name}
        name={field.name}
        type="number"
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        defaultValue={defaultValue ?? ""}
        className={cn(CONTROL_CLASS, "h-10 max-w-32", border(error))}
      />
    </FieldShell>
  );
}

export function SelectField({ field, defaultValue, error }) {
  return (
    <FieldShell
      name={field.name}
      label={field.label}
      help={field.help}
      error={error}
      required={!field.optional}
    >
      <select
        id={field.name}
        name={field.name}
        defaultValue={defaultValue ?? ""}
        className={cn(CONTROL_CLASS, "h-10", border(error))}
      >
        {field.optional && <option value="">—</option>}
        {(field.options ?? []).map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ColorField({ field, defaultValue, error }) {
  return (
    <FieldShell
      name={field.name}
      label={field.label}
      help={field.help}
      error={error}
      required={!field.optional}
    >
      <div className="flex items-center gap-2.5">
        {/*
         * Two inputs, one value: the swatch is the friendly picker and the text
         * box lets an owner paste an exact brand hex from a style guide. They
         * share an id/name pair via the same defaultValue and are kept in sync
         * by the browser's native form behaviour on submit (the text input is
         * the one that posts).
         */}
        <input
          type="color"
          defaultValue={defaultValue || "#1a4fd1"}
          onChange={(event) => {
            const target = document.getElementById(field.name);
            if (target) target.value = event.target.value;
          }}
          aria-label={`${field.label} colour picker`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
        />
        <input
          id={field.name}
          name={field.name}
          type="text"
          defaultValue={defaultValue ?? ""}
          placeholder="#1a4fd1"
          spellCheck={false}
          className={cn(CONTROL_CLASS, "h-10 max-w-40 font-mono", border(error))}
        />
      </div>
    </FieldShell>
  );
}

export function ToggleField({ field, defaultValue, error }) {
  return (
    <FieldShell error={error}>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-colors hover:border-slate-300">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(defaultValue)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand focus:ring-brand/30"
        />
        <span className="min-w-0">
          <span className="block text-[0.82rem] font-semibold text-slate-700">{field.label}</span>
          {field.help && (
            <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{field.help}</span>
          )}
        </span>
      </label>
    </FieldShell>
  );
}
