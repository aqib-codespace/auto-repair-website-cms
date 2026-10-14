"use client";

import { useFormStatus } from "react-dom";
import { Trash2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Inner({ label, compact }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50",
        compact
          ? "h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "h-10 border border-red-200 bg-white px-4 text-sm text-red-600 hover:border-red-300 hover:bg-red-50",
      )}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} />
      ) : (
        <Trash2 className={compact ? "h-4 w-4" : "h-4 w-4"} strokeWidth={2} />
      )}
      {!compact && (pending ? "Deleting…" : label)}
    </button>
  );
}

/**
 * Delete control with a native confirmation step. Deletion is not undoable, so
 * it always asks — and it names the record so a mis-click on a list of similar
 * rows is obvious before it happens.
 */
export default function DeleteButton({
  action,
  hidden = {},
  label = "Delete",
  confirmMessage,
  compact = false,
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage ?? "Delete this item? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Inner label={label} compact={compact} />
    </form>
  );
}
