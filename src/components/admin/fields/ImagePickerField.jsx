"use client";

import { useState } from "react";
import { ImageOff, Upload, LibraryBig, Check, X, LoaderCircle } from "lucide-react";
import FieldShell, { CONTROL_CLASS } from "./FieldShell";
import { cn } from "@/lib/utils";

/**
 * Renders a hidden `name__src` input holding the selected image URL, plus a
 * visible alt-text input and two ways to fill it: upload a new file (POSTs to
 * /api/admin/upload, which resizes and stores it) or pick something already in
 * the media library.
 */
export default function ImagePickerField({ field, defaultValue, error, mediaLibrary = [] }) {
  const [src, setSrc] = useState(defaultValue?.src ?? "");
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed.");
      setSrc(data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <FieldShell label={field.label} help={field.help} error={error} required={!field.optional}>
      <input type="hidden" name={`${field.name}__src`} value={src} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative aspect-video w-full bg-slate-50">
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary upload, not a public optimised image */
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
              <ImageOff className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider">
                No image selected
              </span>
            </div>
          )}

          {src && (
            <button
              type="button"
              onClick={() => setSrc("")}
              aria-label="Remove image"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/85 text-brand">
              <LoaderCircle className="h-6 w-6 animate-spin" strokeWidth={2} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-3 py-2.5">
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300",
              uploading && "cursor-not-allowed opacity-60",
            )}
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {uploading ? "Uploading…" : "Upload new"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {mediaLibrary.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLibrary((value) => !value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                showLibrary
                  ? "border-brand/30 bg-brand-light text-brand-dark"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <LibraryBig className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {showLibrary ? "Hide library" : "Choose existing"}
            </button>
          )}

          <span className="ml-auto text-[0.7rem] text-slate-400">JPEG, PNG, or WebP — up to 5MB</span>
        </div>
      </div>

      {showLibrary && (
        <div className="mt-2.5 grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-6">
          {mediaLibrary.map((item) => {
            const isSelected = item.url === src;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setSrc(item.url);
                  setShowLibrary(false);
                }}
                title={item.filename}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                  isSelected ? "border-brand" : "border-transparent hover:border-slate-300",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.altText} className="h-full w-full object-cover" />
                {isSelected && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!field.noAlt && (
        <div className="mt-2.5">
          <label
            htmlFor={`${field.name}__alt`}
            className="mb-1 block text-[0.78rem] font-medium text-slate-500"
          >
            Alt text
          </label>
          <input
            id={`${field.name}__alt`}
            name={`${field.name}__alt`}
            defaultValue={defaultValue?.alt ?? ""}
            placeholder="Briefly describe the image for screen readers"
            className={cn(CONTROL_CLASS, "h-10 border-slate-200")}
          />
        </div>
      )}

      {uploadError && <p className="mt-1.5 text-xs font-medium text-red-600">{uploadError}</p>}
    </FieldShell>
  );
}
