"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteMedia } from "./actions";

function bytes(size) {
  if (!size) return "";
  const kb = size / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

/**
 * Media library grid. Copying a URL is the common action (pasting a photo into
 * a section that isn't using the picker), so it gets a one-click button with
 * confirmation feedback.
 */
export default function MediaGrid({ items }) {
  const [copied, setCopied] = useState(null);

  async function copy(url) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((current) => (current === url ? null : current)), 1600);
    } catch {
      // Clipboard permission denied — nothing useful to recover here.
    }
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-square bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary upload */}
            <img
              src={item.url}
              alt={item.altText || ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                onClick={() => copy(item.url)}
                aria-label="Copy image URL"
                title="Copy image URL"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm transition-colors hover:text-brand"
              >
                {copied === item.url ? (
                  <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
              <form
                action={deleteMedia}
                onSubmit={(event) => {
                  if (!window.confirm(`Delete ${item.filename}? This cannot be undone.`)) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  aria-label="Delete image"
                  title="Delete image"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>

          <div className="px-3 py-2.5">
            <p className="truncate text-[0.78rem] font-medium text-slate-700" title={item.filename}>
              {item.filename}
            </p>
            <p className="mt-0.5 text-[0.7rem] text-slate-400">
              {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
              {bytes(item.sizeBytes)}
              {item.uploadedAt ? ` · ${formatDate(item.uploadedAt)}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
