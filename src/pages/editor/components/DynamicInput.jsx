import { useId } from "react";
import TextInput from "./inputs/TextInput";
import HeadInput from "./inputs/HeadInput";
import ImageInput from "./inputs/ImageInput";
import ArrayInput from "./inputs/ArrayInput";
import { Field, LangBadge } from "./EditorField";

// The keys below are the block's data model and what the renderers read, so
// they stay as they are; only the caption shown to the editor is friendlier.
const FIELD_LABELS = {
  head: "Heading",
  text: "Text",
  img: "Image",
  array: "List items",
};

function fieldLabel(key, blockType) {
  if (key === "text" && blockType === "videoEmbed") return "YouTube link";
  if (key === "text" && blockType === "imageCaption") return "Caption";
  if (key === "text" && blockType === "heading") return "Heading";
  return FIELD_LABELS[key] ?? key;
}

// Fields that are a single native control the label can point at.
const LABELLABLE = new Set(["text", "head", "array"]);

export default function DynamicInput({
  index,
  label,
  value,
  dispatch,
  config,
  lang,
  blockType,
}) {
  const id = useId();

  function handleChange(e) {
    dispatch({
      type: "UPDATE",
      index,
      key: label,
      value: e.target.value,
      lang,
    });
  }

  if (label === "placehold") {
    return (
      <p className="text-xs leading-relaxed text-neutral-600">
        Adds empty space between blocks. Nothing to edit.
      </p>
    );
  }

  return (
    <Field
      label={fieldLabel(label, blockType)}
      htmlFor={LABELLABLE.has(label) ? id : undefined}
      badge={lang === "th" && <LangBadge />}
    >
      {(() => {
        switch (label) {
          case "text":
            // A heading is one line and a video block's "text" is just a URL,
            // so neither needs the multi-line textarea.
            return blockType === "videoEmbed" || blockType === "heading" ? (
              <HeadInput
                id={id}
                onChange={handleChange}
                value={value}
                placeholder={
                  blockType === "videoEmbed"
                    ? "https://www.youtube.com/watch?v=..."
                    : undefined
                }
              />
            ) : (
              <TextInput id={id} onChange={handleChange} value={value} />
            );
          case "head":
            return <HeadInput id={id} onChange={handleChange} value={value} />;
          case "img":
            return (
              <ImageInput
                value={value}
                index={index}
                label={label}
                dispatch={dispatch}
                width={config?.width}
              />
            );
          case "array":
            return (
              <ArrayInput
                id={id}
                value={value}
                index={index}
                label={label}
                dispatch={dispatch}
                lang={lang}
              />
            );
          default:
            return null;
        }
      })()}
    </Field>
  );
}
