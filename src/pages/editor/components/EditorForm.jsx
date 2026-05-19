import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

import DynamicInput from "./DynamicInput";

import { alignmentOptions, bgOptions } from "../DATA";

export default function EditorForm({ index, dispatch, editor }) {
  const { type, load, config, expanded, visible, desc } = editor;

  function handleConfigChange(e, key) {
    dispatch({
      type: "UPDATE",

      index,

      key: "config",

      value: {
        ...config,
        [key]: e.target.value,
      },
    });
  }

  const selectOptions = [
    {
      key: "align",
      options: alignmentOptions,
    },

    {
      key: "bg",
      options: bgOptions,
    },
  ];

  return (
    <div className="p-3 border rounded bg-white shadow-sm space-y-2">
      {/* Top Controls */}

      <div
        className={`flex justify-between items-center gap-3 ${
          expanded ? "mb-2" : ""
        }`}
      >
        {/* Delete */}

        <button
          onClick={() =>
            dispatch({
              type: "DELETE",
              index,
            })
          }
          className="text-rose-700 hover:scale-110 transition-all"
        >
          <span className="text-lg">🗑️</span>
        </button>

        {/* Visibility */}

        <button
          onClick={() =>
            dispatch({
              type: "UPDATE",

              index,

              key: "visible",

              value: !visible,
            })
          }
          className={`transition-all ${visible ? "opacity-100" : "opacity-40"}`}
        >
          <span className="text-lg">👁️</span>
        </button>

        {/* Expand Toggle */}

        <button
          onClick={() =>
            dispatch({
              type: "UPDATE",

              index,

              key: "expanded",

              value: !expanded,
            })
          }
          className="cursor-pointer text-sm font-bold flex-1 text-center"
        >
          {type.toUpperCase()}
        </button>

        {/* Reorder */}

        <div className="flex gap-1">
          {[
            {
              increment: -1,
              Icon: FaCaretUp,
            },

            {
              increment: 1,
              Icon: FaCaretDown,
            },
          ].map(({ increment, Icon }) => (
            <button
              key={increment}
              onClick={() =>
                dispatch({
                  type: "REORDER",

                  index,

                  increment,
                })
              }
              className="cursor-pointer text-lg"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Content */}

      {expanded && (
        <>
          <hr />

          <div className="flex flex-col space-y-3">
            {/* Config Selects */}

            <div className="flex gap-2">
              {selectOptions.map(({ key, options }) => (
                <select
                  key={key}
                  value={config?.[key]}
                  onChange={(e) => handleConfigChange(e, key)}
                  className="bg-white border rounded p-1 text-xs"
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>

            {/* Description */}

            <p className="text-neutral-600 text-xs leading-relaxed">{desc}</p>

            {/* Dynamic Inputs */}

            {load &&
              Object.entries(load).map(([key, value]) =>
                key !== "expanded" ? (
                  <DynamicInput
                    key={key}
                    index={index}
                    label={key}
                    value={value}
                    dispatch={dispatch}
                    config={config}
                  />
                ) : null,
              )}
          </div>
        </>
      )}
    </div>
  );
}
