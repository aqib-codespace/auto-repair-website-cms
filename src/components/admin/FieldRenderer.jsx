"use client";

import {
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  ColorField,
  ToggleField,
} from "./fields/BasicFields";
import IconField from "./fields/IconField";
import ImagePickerField from "./fields/ImagePickerField";
import ListField from "./fields/ListField";
import RepeaterField from "./fields/RepeaterField";

/**
 * Maps a field descriptor to a control. This switch is the only place that
 * knows the set of supported field types, so adding a type (say "date" or
 * "richtext") is one case here plus one branch in lib/admin/parse.js — every
 * content block and collection picks it up for free.
 */
export default function FieldRenderer({ field, defaultValue, error, mediaLibrary }) {
  switch (field.type) {
    case "textarea":
      return <TextAreaField field={field} defaultValue={defaultValue} error={error} />;
    case "number":
      return <NumberField field={field} defaultValue={defaultValue} error={error} />;
    case "select":
      return <SelectField field={field} defaultValue={defaultValue} error={error} />;
    case "color":
      return <ColorField field={field} defaultValue={defaultValue} error={error} />;
    case "toggle":
      return <ToggleField field={field} defaultValue={defaultValue} error={error} />;
    case "icon":
      return <IconField field={field} defaultValue={defaultValue} error={error} />;
    case "image":
      return (
        <ImagePickerField
          field={field}
          defaultValue={defaultValue}
          error={error}
          mediaLibrary={mediaLibrary}
        />
      );
    case "list":
      return <ListField field={field} defaultValue={defaultValue} error={error} />;
    case "repeater":
      return <RepeaterField field={field} defaultValue={defaultValue} error={error} />;
    default:
      return <TextField field={field} defaultValue={defaultValue} error={error} />;
  }
}
