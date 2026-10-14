"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, CircleCheck, CircleAlert, ExternalLink, LoaderCircle } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import { TEMPLATES } from "@/lib/templates/registry";
import { cn } from "@/lib/utils";
import { setTemplate } from "./actions";

function ApplyButton({ isActive, name }) {
  const { pending } = useFormStatus();

  if (isActive) {
    return (
      <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-50 px-4 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        Live now
      </span>
    );
  }

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} aria-hidden="true" />
          Applying…
        </>
      ) : (
        `Use ${name}`
      )}
    </Button>
  );
}

/**
 * Template picker.
 *
 * Hovering a card raises it and swaps in its preview image; the preview itself
 * opens the real site rendered in that template, because a thumbnail can only
 * ever suggest what a design feels like. Applying is one click and takes effect
 * on the live site immediately — content is untouched, so switching back is
 * equally cheap and nothing is lost either way.
 */
export default function TemplatePicker({ current }) {
  const [state, formAction] = useActionState(setTemplate, undefined);
  const [hovered, setHovered] = useState(null);

  // The action returns the id it saved, so the UI reflects the switch without a
  // round-trip through props.
  const active = state?.template ?? current;

  return (
    <div>
      {state?.success && (
        <p className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <CircleCheck className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Design switched. The live site is already showing it.
        </p>
      )}
      {state?.error && (
        <p className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {state.error}
        </p>
      )}

      <ul className="grid gap-6 lg:grid-cols-2">
        {TEMPLATES.map((template) => {
          const isActive = template.id === active;
          const isHovered = hovered === template.id;

          return (
            <li
              key={template.id}
              /* Anchor target for the sidebar's per-template links. */
              id={template.id}
              onMouseEnter={() => setHovered(template.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "group scroll-mt-8 overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                isActive
                  ? "border-brand shadow-md ring-1 ring-brand/20"
                  : "border-slate-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md",
              )}
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- static thumbnail from /public, no optimisation needed */}
                <img
                  src={template.preview}
                  alt={`${template.name} template preview`}
                  className={cn(
                    "h-full w-full object-cover object-top transition-transform duration-500",
                    isHovered && "scale-[1.03]",
                  )}
                />

                {isActive && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    Live
                  </span>
                )}

                {/* Preview affordance, revealed on hover. */}
                <a
                  href={`/preview/${template.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "absolute inset-0 flex items-end justify-end p-3 transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/85 px-3 py-2 text-[0.78rem] font-semibold text-white backdrop-blur-sm">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                    Open full preview
                  </span>
                </a>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-slate-900">{template.name}</h2>
                    <p className="mt-0.5 text-[0.78rem] text-slate-500">{template.tagline}</p>
                  </div>
                  <ul className="flex shrink-0 gap-1.5 pt-1" aria-hidden="true">
                    {template.swatches.map((swatch) => (
                      <li
                        key={swatch}
                        style={{ backgroundColor: swatch }}
                        className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10"
                      />
                    ))}
                  </ul>
                </div>

                <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-600">
                  {template.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {template.traits.map((trait) => (
                    <li
                      key={trait}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.72rem] font-medium text-slate-600"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>

                <form action={formAction} className="mt-5 flex items-center gap-2">
                  <input type="hidden" name="template" value={template.id} />
                  <ApplyButton isActive={isActive} name={template.name} />
                  <Button
                    href={`/preview/${template.id}`}
                    target="_blank"
                    variant="secondary"
                    size="md"
                  >
                    Preview
                  </Button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
