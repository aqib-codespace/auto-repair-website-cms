"use client";

import { CircleAlert, RotateCw } from "lucide-react";
import Button from "@/components/admin/ui/Button";

/**
 * Admin-side error boundary. The most likely cause by far is a Supabase
 * connection or schema problem (missing table, wrong key), so the copy points
 * there first instead of showing a bare stack trace.
 */
export default function AdminError({ error, reset }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <CircleAlert className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
      </span>
      <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        This usually means the database isn&apos;t reachable or the schema hasn&apos;t been created
        yet. Check your Supabase keys in <code className="font-mono text-xs">.env.local</code> and
        confirm <code className="font-mono text-xs">supabase/schema.sql</code> has been run.
      </p>
      {error?.message && (
        <p className="mx-auto mt-4 max-w-md overflow-x-auto rounded-lg bg-slate-100 px-3 py-2 text-left font-mono text-[0.7rem] text-slate-600">
          {error.message}
        </p>
      )}
      <div className="mt-7 flex justify-center gap-2">
        <Button onClick={reset}>
          <RotateCw className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Try again
        </Button>
        <Button href="/admin" variant="secondary">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
