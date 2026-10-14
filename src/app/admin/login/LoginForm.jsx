"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert, LoaderCircle, ArrowRight } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import { CONTROL_CLASS } from "@/components/admin/fields/FieldShell";
import { cn } from "@/lib/utils";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" full disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} aria-hidden="true" />
          Signing in…
        </>
      ) : (
        <>
          Sign in
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </>
      )}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[0.82rem] font-semibold text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(CONTROL_CLASS, "h-11 border-slate-200")}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[0.82rem] font-semibold text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={cn(CONTROL_CLASS, "h-11 border-slate-200")}
        />
      </div>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.82rem] leading-relaxed text-red-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
