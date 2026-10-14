"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { getBlock } from "@/lib/admin/blocks";
import { parseFields } from "@/lib/admin/parse";
import { saveContentBlock } from "@/lib/actions/content-helpers";

/**
 * The only save action for all fourteen content blocks.
 *
 * The target block arrives as a hidden form value and is resolved through the
 * registry, so an edited request body can only ever address a block this
 * template actually defines.
 */
export async function updateContentBlock(prevState, formData) {
  const admin = await requireAdmin();

  const block = getBlock(String(formData.get("__blockKey") ?? ""));
  if (!block) return { error: "Unknown content section." };

  const { data, errors, ok } = parseFields(block.fields, formData, { mode: "block" });
  if (!ok) return { errors };

  await saveContentBlock({
    admin,
    key: block.key,
    data,
    label: `${block.label} section`,
  });

  return { success: true };
}
