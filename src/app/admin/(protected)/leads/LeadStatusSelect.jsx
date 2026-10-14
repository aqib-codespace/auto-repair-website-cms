"use client";

import { useRef } from "react";
import { LEAD_STATUSES } from "@/config/site";
import { updateLeadStatus } from "./actions";

/**
 * Status picker that submits on change — moving a request through the pipeline
 * is a one-interaction job, so there is no separate save button to forget.
 */
export default function LeadStatusSelect({ id, status }) {
  const formRef = useRef(null);

  return (
    <form ref={formRef} action={updateLeadStatus} className="shrink-0">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Request status
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
      >
        {LEAD_STATUSES.map((entry) => (
          <option key={entry.value} value={entry.value}>
            {entry.label}
          </option>
        ))}
      </select>
    </form>
  );
}
