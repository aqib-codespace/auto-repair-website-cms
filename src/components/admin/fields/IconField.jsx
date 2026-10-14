"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import FieldShell, { CONTROL_CLASS } from "./FieldShell";
import Icon from "@/components/ui/Icon";
import { ICON_OPTIONS } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Visual icon picker. Icons are the one field where a <select> of slugs is
 * genuinely unusable — you cannot choose "disc" over "gauge" without seeing
 * them — so this renders the actual glyphs and posts the chosen slug in a
 * hidden input.
 */
export default function IconField({ field, defaultValue, error }) {
  const [value, setValue] = useState(defaultValue || ICON_OPTIONS[0]?.value || "wrench");
  const [query, setQuery] = useState("");

  const matches = ICON_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <FieldShell name={field.name} label={field.label} help={field.help} error={error}>
      <input type="hidden" name={field.name} value={value} />

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
            <Icon name={value} className="h-5 w-5" />
          </span>
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons…"
              aria-label="Search icons"
              className={cn(CONTROL_CLASS, "h-9 border-slate-200 pl-8 text-[0.8rem]")}
            />
          </div>
        </div>

        <div className="grid max-h-52 grid-cols-6 gap-1.5 overflow-y-auto p-3 sm:grid-cols-8">
          {matches.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue(option.value)}
                title={option.label}
                aria-pressed={isSelected}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg border transition-all",
                  isSelected
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-transparent bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900",
                )}
              >
                <Icon name={option.value} className="h-4.5 w-4.5" />
              </button>
            );
          })}
          {matches.length === 0 && (
            <p className="col-span-full py-6 text-center text-xs text-slate-400">
              No icons match “{query}”.
            </p>
          )}
        </div>
      </div>
    </FieldShell>
  );
}

/**
 * Compact variant for repeater rows, where a full picker grid per row would
 * bury the actual content fields.
 */
export function IconSelect({ label, value, onChange, className }) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="mb-1.5 block text-[0.78rem] font-semibold text-slate-600">{label}</span>
      <span className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
          <Icon name={value} className="h-4 w-4" />
        </span>
        <select
          value={value || "wrench"}
          onChange={(event) => onChange(event.target.value)}
          className={cn(CONTROL_CLASS, "h-9 border-slate-200 text-[0.8rem]")}
        >
          {ICON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
