"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, CircleAlert, ArrowRight, LoaderCircle } from "lucide-react";
import { FormInput, FormSelect, FormTextarea } from "./Fields";
import Button from "@/components/ui/Button";
import { submitLead } from "@/lib/actions/leads";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="xl" full disabled={pending} className="sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} aria-hidden="true" />
          Sending…
        </>
      ) : (
        <>
          Request Appointment
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </>
      )}
    </Button>
  );
}

/**
 * Appointment request form. Errors come back per-field from the Server
 * Action, so a mistyped phone number never costs the visitor everything else
 * they typed. On success the form is replaced by a confirmation panel rather
 * than a toast that can be missed.
 */
export default function ContactForm({ serviceOptions = [], formNote, successMessage }) {
  const [state, formAction] = useActionState(submitLead, undefined);
  const errors = state?.errors ?? {};

  if (state?.success) {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl border border-green-200 bg-green-50/70 px-6 py-14 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
          <CircleCheck className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-ink">Request received</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">{successMessage}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot: off-screen rather than display:none, which some bots detect. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="name"
          label="Name"
          required
          autoComplete="name"
          placeholder="Jordan Reyes"
          error={errors.name}
        />
        <FormInput
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(817) 555-0142"
          error={errors.phone}
        />
      </div>

      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="vehicleMake"
          label="Vehicle Make"
          required
          placeholder="Honda"
          error={errors.vehicleMake}
        />
        <FormInput
          name="vehicleModel"
          label="Vehicle Model"
          required
          placeholder="Pilot"
          error={errors.vehicleModel}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelect
          name="serviceNeeded"
          label="Service Needed"
          required
          options={serviceOptions}
          placeholder="Choose a service"
          error={errors.serviceNeeded}
        />
        <FormInput
          name="preferredDate"
          label="Preferred Appointment Date"
          type="date"
          error={errors.preferredDate}
        />
      </div>

      <FormTextarea
        name="comments"
        label="Comments"
        rows={4}
        placeholder="Tell us what you're hearing, seeing, or smelling — and when it happens."
        error={errors.comments}
      />

      {state?.error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <SubmitButton />
        {formNote && <p className="text-xs leading-relaxed text-slate-500">{formNote}</p>}
      </div>
    </form>
  );
}
