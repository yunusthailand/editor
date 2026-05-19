import TextInput from "./inputs/TextInput";

import HeadInput from "./inputs/HeadInput";

import ImageInput from "./inputs/ImageInput";

import ArrayInput from "./inputs/ArrayInput";

export default function DynamicInput({
  index,
  label,
  value,
  dispatch,
  config,
}) {
  function handleChange(e) {
    dispatch({
      type: "UPDATE",

      index,

      key: label,

      value: e.target.value,
    });
  }

  return (
    <div className="space-y-2">
      {label !== "placehold" && (
        <label className="block text-white">{label}</label>
      )}

      {(() => {
        switch (label) {
          case "placehold":
            return <p>Not Editable</p>;

          case "text":
            return <TextInput onChange={handleChange} value={value} />;

          case "head":
            return <HeadInput onChange={handleChange} value={value} />;

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
                value={value}
                index={index}
                label={label}
                dispatch={dispatch}
              />
            );

          default:
            return null;
        }
      })()}
    </div>
  );
}
