import "server-only";

/**
 * ---------------------------------------------------------------------------
 * ONE PARSER FOR EVERY ADMIN FORM
 * ---------------------------------------------------------------------------
 * Reads a FormData submission against a field registry (lib/admin/blocks.js or
 * lib/admin/collections.js) and returns either a save payload or per-field
 * error messages. Every content block and every collection row goes through
 * here, which is why the admin panel has no hand-written validation.
 *
 * Two output shapes:
 *   mode "block" — nested JSON for content_blocks.data
 *                  (image -> { src, alt }, repeater -> array of objects)
 *   mode "row"   — flat snake_case columns for a table insert/update
 *
 * Field name -> form input name:
 *   text | textarea | icon | select | color | number   ->  name
 *   toggle                                             ->  name (checkbox)
 *   image                                              ->  name__src, name__alt
 *   list                                               ->  name[] (repeated)
 *   repeater                                           ->  name (JSON string)
 */

const DEFAULT_MAX = 5000;

function label(field) {
  return field.label ?? field.name;
}

/** Trim, then enforce required/max for a single string value. */
function readText(field, raw, { required = !field.optional, max = field.max ?? DEFAULT_MAX } = {}) {
  const value = String(raw ?? "").trim();

  if (!value) {
    if (required) return { error: `${label(field)} is required.` };
    return { value: "" };
  }
  if (value.length > max) {
    return { error: `${label(field)} must be ${max} characters or fewer.` };
  }
  return { value };
}

function parseSimple(field, formData) {
  const result = readText(field, formData.get(field.name));
  return result.error ? { error: result.error } : { value: result.value };
}

function parseNumber(field, formData) {
  const raw = String(formData.get(field.name) ?? "").trim();
  if (!raw) {
    if (field.optional) return { value: null };
    return { error: `${label(field)} is required.` };
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) return { error: `${label(field)} must be a number.` };
  if (field.min != null && value < field.min) {
    return { error: `${label(field)} must be at least ${field.min}.` };
  }
  if (field.max != null && value > field.max) {
    return { error: `${label(field)} must be at most ${field.max}.` };
  }
  return { value };
}

function parseImage(field, formData) {
  const src = String(formData.get(`${field.name}__src`) ?? "").trim();
  const alt = String(formData.get(`${field.name}__alt`) ?? "").trim();

  if (!src) {
    if (field.optional) return { value: { src: "", alt: "" } };
    return { error: `${label(field)}: choose or upload an image.` };
  }
  // Alt text is required whenever there *is* an image, except where the image
  // is announced by adjacent text anyway (`noAlt`, e.g. a logo beside the
  // business name) — shop photography is never decorative.
  if (!alt && !field.noAlt) {
    return { error: `${label(field)}: describe the image for screen readers.` };
  }
  return { value: { src, alt } };
}

function parseList(field, formData) {
  const values = formData
    .getAll(`${field.name}[]`)
    .map((value) => String(value).trim())
    .filter(Boolean);

  const min = field.minItems ?? (field.optional ? 0 : 1);
  if (values.length < min) {
    return { error: `${label(field)}: add at least ${min} item${min === 1 ? "" : "s"}.` };
  }
  if (field.maxItems && values.length > field.maxItems) {
    return { error: `${label(field)}: ${field.maxItems} items maximum.` };
  }

  const tooLong = values.find((value) => value.length > (field.max ?? 300));
  if (tooLong) {
    return { error: `${label(field)}: each item must be ${field.max ?? 300} characters or fewer.` };
  }

  return { value: values };
}

/**
 * Repeaters post a JSON array from a hidden input — the client component owns
 * add/remove/reorder, so the wire format is one value instead of a matrix of
 * indexed input names.
 */
function parseRepeater(field, formData) {
  const raw = String(formData.get(field.name) ?? "").trim();
  let items;

  try {
    items = raw ? JSON.parse(raw) : [];
  } catch {
    return { error: `${label(field)}: could not read the submitted rows.` };
  }
  if (!Array.isArray(items)) {
    return { error: `${label(field)}: unexpected value.` };
  }

  const min = field.minItems ?? (field.optional ? 0 : 1);
  if (items.length < min) {
    return { error: `${label(field)}: add at least ${min} row${min === 1 ? "" : "s"}.` };
  }
  if (field.maxItems && items.length > field.maxItems) {
    return { error: `${label(field)}: ${field.maxItems} rows maximum.` };
  }

  const cleaned = [];
  for (const [index, item] of items.entries()) {
    const row = {};
    for (const sub of field.fields) {
      const result = readText(sub, item?.[sub.name]);
      if (result.error) {
        return {
          error: `${field.itemLabel ?? "Row"} ${index + 1} — ${result.error}`,
        };
      }
      row[sub.name] = result.value;
    }
    cleaned.push(row);
  }

  return { value: cleaned };
}

function parseField(field, formData) {
  switch (field.type) {
    case "toggle":
      return { value: formData.get(field.name) != null };
    case "number":
      return parseNumber(field, formData);
    case "image":
      return parseImage(field, formData);
    case "list":
      return parseList(field, formData);
    case "repeater":
      return parseRepeater(field, formData);
    default:
      return parseSimple(field, formData);
  }
}

/** Spread a parsed value into the shape the caller is saving. */
function assign(target, field, value, mode) {
  if (field.type === "image") {
    if (mode === "row") {
      target[field.column ?? `${field.name}_url`] = value.src || null;
      target[field.altColumn ?? `${field.name}_alt`] = value.alt || null;
      return;
    }
    target[field.name] = value;
    return;
  }

  const key = mode === "row" ? (field.column ?? field.name) : field.name;
  target[key] = mode === "row" && value === "" ? null : value;
}

export function parseFields(fields, formData, { mode = "block" } = {}) {
  const data = {};
  const errors = {};

  for (const field of fields) {
    const result = parseField(field, formData);
    if (result.error) errors[field.name] = result.error;
    else assign(data, field, result.value, mode);
  }

  return { data, errors, ok: Object.keys(errors).length === 0 };
}

/**
 * Turns a database row into the `defaults` map the form renderer expects, so
 * the create and edit forms are the same component with different input.
 */
export function rowToDefaults(fields, row) {
  const defaults = {};

  for (const field of fields) {
    if (field.type === "image") {
      defaults[field.name] = {
        src: row?.[field.column ?? `${field.name}_url`] ?? "",
        alt: row?.[field.altColumn ?? `${field.name}_alt`] ?? "",
      };
      continue;
    }
    defaults[field.name] = row?.[field.column ?? field.name] ?? undefined;
  }

  return defaults;
}
