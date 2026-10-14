"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, CircleAlert, LoaderCircle, Save } from "lucide-react";
import FieldRenderer from "./FieldRenderer";
import Button from "./ui/Button";
import { cn } from "@/lib/utils";

function SubmitBar({ label, secondary }) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-0 -mx-5 mt-2 flex items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} aria-hidden="true" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              {label}
            </>
          )}
        </Button>
        {secondary}
      </div>
      <p className="hidden text-xs text-slate-400 sm:block">
        Changes go live on the site immediately.
      </p>
    </div>
  );
}

/**
 * Renders and submits any registry-described form.
 *
 * It owns the useActionState wiring, the pending state, the error and success
 * chrome, and the field layout — which is why there is no bespoke form
 * component for hero, services, FAQs, or anything else. Field-level messages
 * come back keyed by field name so a single bad value never discards the rest
 * of the submission.
 */
export default function SchemaForm({
  action,
  fields,
  defaults = {},
  mediaLibrary = [],
  submitLabel = "Save changes",
  secondaryAction,
  hidden = {},
}) {
  const [state, formAction] = useActionState(action, undefined);
  const errors = state?.errors ?? {};
  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="space-y-6 p-5">
        {/*
         * Which block/row this form targets travels in the submission rather
         * than in a bound closure: one generated action serves every route, and
         * it re-validates the value against the registry before touching the
         * database.
         */}
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        {state?.success && (
          <p className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            <CircleCheck className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            Saved. The live site has been updated.
          </p>
        )}

        {(state?.error || hasFieldErrors) && (
          <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {state?.error ?? "Some fields need attention — see the messages below."}
          </p>
        )}

        {fields.map((field) => (
          <div
            key={field.name}
            className={cn(field.type === "repeater" && "border-t border-slate-100 pt-6 first:border-0 first:pt-0")}
          >
            <FieldRenderer
              field={field}
              defaultValue={defaults[field.name]}
              error={errors[field.name]}
              mediaLibrary={mediaLibrary}
            />
          </div>
        ))}
      </div>

      <SubmitBar label={submitLabel} secondary={secondaryAction} />
    </form>
  );
}
