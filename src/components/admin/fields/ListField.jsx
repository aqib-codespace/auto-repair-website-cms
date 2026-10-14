"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import FieldShell, { CONTROL_CLASS } from "./FieldShell";
import { cn } from "@/lib/utils";

/**
 * A variable-length list of plain strings. Every row posts under the same
 * `name[]` so the Server Action reads them with formData.getAll().
 *
 * Row values are controlled here (rather than uncontrolled inputs) because
 * reordering has to move the text with the row.
 */
export default function ListField({ field, defaultValue, error }) {
  const [items, setItems] = useState(() =>
    Array.isArray(defaultValue) && defaultValue.length > 0 ? [...defaultValue] : [""],
  );

  const update = (index, value) =>
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));

  const add = () => setItems((prev) => [...prev, ""]);

  const remove = (index) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));

  const move = (index, direction) =>
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <FieldShell label={field.label} help={field.help} error={error} required={!field.optional}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <GripVertical
              className="h-4 w-4 shrink-0 text-slate-300"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              name={`${field.name}[]`}
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={field.placeholder}
              maxLength={field.max ?? 300}
              className={cn(CONTROL_CLASS, "h-10 border-slate-200")}
            />
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="flex h-8 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="flex h-8 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove item"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand/40 hover:bg-brand-light hover:text-brand-dark"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        Add item
      </button>
    </FieldShell>
  );
}
