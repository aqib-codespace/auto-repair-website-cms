"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, LoaderCircle, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drag-and-drop (or click) uploader. Files are sent one at a time to
 * /api/admin/upload, which resizes and stores each one, then the route's data
 * is picked up by refreshing the server component below.
 */
export default function UploadWidget() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  async function upload(files) {
    const list = Array.from(files ?? []).filter(Boolean);
    if (list.length === 0) return;

    setBusy(true);
    setErrors([]);
    const failures = [];

    for (const [index, file] of list.entries()) {
      setProgress(`Uploading ${index + 1} of ${list.length}…`);
      try {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Upload failed.");
      } catch (error) {
        failures.push(`${file.name}: ${error.message}`);
      }
    }

    setErrors(failures);
    setProgress(null);
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          upload(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-brand bg-brand-light"
            : "border-slate-300 bg-slate-50/60 hover:border-brand/40 hover:bg-brand-light/40",
          busy && "cursor-wait opacity-70",
        )}
      >
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
          {busy ? (
            <LoaderCircle className="h-6 w-6 animate-spin" strokeWidth={2} aria-hidden="true" />
          ) : (
            <UploadCloud className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          )}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {progress ?? "Drop images here, or click to choose"}
        </span>
        <span className="mt-1 text-xs text-slate-500">
          JPEG, PNG, or WebP · up to 5MB each · resized automatically
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={busy}
          onChange={(event) => {
            upload(event.target.files);
            event.target.value = "";
          }}
          className="hidden"
        />
      </label>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {errors.map((message) => (
            <li
              key={message}
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
              {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
