"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import FieldShell, { CONTROL_CLASS } from "./FieldShell";
import { IconSelect } from "./IconField";
import { cn } from "@/lib/utils";

/**
 * A repeating group of fields (trust indicators, features, process steps,
 * business hours, stats…).
 *
 * State lives here and is serialised into one hidden JSON input, which keeps
 * the wire format stable no matter how rows are added, removed, or reordered —
 * indexed input names (`features[2][title]`) break as soon as row 1 is deleted.
 */
export default function RepeaterField({ field, defaultValue, error }) {
  const blank = () => Object.fromEntries(field.fields.map((sub) => [sub.name, ""]));

  const [rows, setRows] = useState(() =>
    Array.isArray(defaultValue) && defaultValue.length > 0
      ? defaultValue.map((row) => ({ ...blank(), ...row }))
      : [blank()],
  );

  const setCell = (index, name, value) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [name]: value } : row)));

  const add = () => setRows((prev) => [...prev, blank()]);

  const remove = (index) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const move = (index, direction) =>
    setRows((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const atMax = field.maxItems ? rows.length >= field.maxItems : false;

  return (
    <FieldShell label={field.label} help={field.help} error={error} required={!field.optional}>
      <input type="hidden" name={field.name} value={JSON.stringify(rows)} />

      <ul className="space-y-2.5">
        {rows.map((row, index) => (
          <li
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-colors hover:border-slate-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
                {field.itemLabel ?? "Row"} {index + 1}
              </span>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Move down"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={rows.length === 1}
                  aria-label="Remove row"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {field.fields.map((sub) => {
                if (sub.type === "icon") {
                  return (
                    <IconSelect
                      key={sub.name}
                      label={sub.label}
                      value={row[sub.name]}
                      onChange={(value) => setCell(index, sub.name, value)}
                    />
                  );
                }

                const isWide = sub.type === "textarea";

                return (
                  <label key={sub.name} className={cn("block min-w-0", isWide && "sm:col-span-2")}>
                    <span className="mb-1.5 block text-[0.78rem] font-semibold text-slate-600">
                      {sub.label}
                    </span>
                    {isWide ? (
                      <textarea
                        rows={sub.rows ?? 2}
                        value={row[sub.name] ?? ""}
                        onChange={(event) => setCell(index, sub.name, event.target.value)}
                        maxLength={sub.max ?? undefined}
                        className={cn(CONTROL_CLASS, "border-slate-200 py-2 text-[0.85rem]")}
                      />
                    ) : (
                      <input
                        value={row[sub.name] ?? ""}
                        onChange={(event) => setCell(index, sub.name, event.target.value)}
                        placeholder={sub.placeholder}
                        maxLength={sub.max ?? undefined}
                        className={cn(CONTROL_CLASS, "h-9 border-slate-200 text-[0.85rem]")}
                      />
                    )}
                    {sub.help && (
                      <span className="mt-1 block text-[0.7rem] text-slate-400">{sub.help}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        disabled={atMax}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand/40 hover:bg-brand-light hover:text-brand-dark disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-600"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        Add {(field.itemLabel ?? "row").toLowerCase()}
        {atMax && ` (max ${field.maxItems})`}
      </button>
    </FieldShell>
  );
}
