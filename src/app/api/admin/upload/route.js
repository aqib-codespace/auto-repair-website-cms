import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSupabase, MEDIA_BUCKET } from "@/lib/supabase/client";
import { mapMedia } from "@/lib/supabase/mappers";
import { TABLES } from "@/lib/supabase/tables";
import { requireSite } from "@/lib/site";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_WIDTH = 2400;

/**
 * Authenticated image upload.
 *
 * Every file is re-encoded through sharp before it is stored, which both caps
 * the dimensions (a 6000px phone photo would otherwise be served to every
 * visitor) and strips EXIF — including GPS coordinates from a phone camera.
 * The stored name is a UUID plus a slugified original, so uploads can never
 * collide or traverse paths.
 */
export async function POST(request) {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const formData = await request.formData();
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 5MB limit." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const slug = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const filename = `${randomUUID()}-${slug || "image"}.${ext}`;

  let resized;
  let info;
  try {
    const output = await sharp(buffer)
      .rotate() // honour EXIF orientation before the data is stripped
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .toFormat(ext === "jpg" ? "jpeg" : ext, { quality: 82 })
      .toBuffer({ resolveWithObject: true });
    resized = output.data;
    info = output.info;
  } catch {
    return NextResponse.json({ error: "That file could not be read as an image." }, { status: 400 });
  }

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(filename, resized, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filename);

  const { data: row, error: insertError } = await supabase
    .from(TABLES.media)
    .insert({
      site_id: site.id,
      filename,
      url: publicUrlData.publicUrl,
      alt_text: altText,
      width: info.width,
      height: info.height,
      size_bytes: info.size,
      uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(mapMedia(row));
}
