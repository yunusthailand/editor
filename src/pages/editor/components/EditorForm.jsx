import { useId, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaTrashCan,
} from "react-icons/fa6";
import DynamicInput from "./DynamicInput";
import { Field, SelectField } from "./EditorField";
import { alignmentOptions, bgOptions, eleOptions } from "../DATA";
import { cn } from "@/lib/utils";

// Small square icon button for the row's actions.
function IconButton({ label, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-control text-neutral-600 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-primary active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none motion-reduce:active:scale-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// First line of readable content, shown when a block is collapsed so a long
// post can be scanned without opening every block.
function summarize(load) {
  if (!load) return "";
  const candidate = load.head || load.text || load.array?.[0];
  return typeof candidate === "string" ? candidate : "";
}

export default function EditorForm({
  index,
  dispatch,
  editor,
  lang,
  isFirst,
  isLast,
}) {
  const { type, load, load_th, config, expanded, visible, desc } = editor;

  const uid = useId();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const activeLoad = lang === "th" ? load_th || load : load;

  // `desc` is copied into each block when it's created and then persisted with
  // the blog, so saved blocks keep whatever help text was current at the time.
  // Resolve it from the block registry instead, falling back to the stored copy
  // for any type that has since been removed.
  const registered = eleOptions.find((ele) => ele.type === type);
  const activeDesc = registered?.desc ?? desc;
  const blockName = registered?.label ?? type;
  const summary = summarize(activeLoad);

  function handleConfigChange(e, key) {
    dispatch({
      type: "UPDATE",
      index,
      key: "config",
      value: { ...config, [key]: e.target.value },
    });
  }

  const selectOptions = [
    { key: "align", label: "Align", options: alignmentOptions },
    { key: "bg", label: "Background", options: bgOptions },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none">
      <div className="flex min-h-[52px] items-center gap-0.5 px-2 py-1.5">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`${uid}-body`}
          onClick={() =>
            dispatch({
              type: "UPDATE",
              index,
              key: "expanded",
              value: !expanded,
            })
          }
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 py-1.5 text-left transition-colors hover:bg-neutral-100 active:bg-neutral-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 motion-reduce:transition-none"
        >
          <FaChevronRight
            aria-hidden="true"
            className={cn(
              "size-3 shrink-0 text-neutral-500 transition-transform duration-200 ease-drawer motion-reduce:transition-none",
              expanded && "rotate-90",
            )}
          />
          <span className="min-w-0">
            <span
              className={cn(
                "flex items-center gap-1.5 text-[15px] font-medium",
                visible ? "text-neutral-900" : "text-neutral-500",
              )}
            >
              <span className="truncate" title={blockName}>
                {blockName}
              </span>
              {!visible && (
                <span className="rounded-pill bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-neutral-700">
                  Hidden
                </span>
              )}
            </span>
            {!expanded && summary && (
              <span className="block truncate text-xs text-neutral-500">
                {summary}
              </span>
            )}
          </span>
        </button>

        <IconButton
          label="Move up"
          disabled={isFirst}
          onClick={() => dispatch({ type: "REORDER", index, increment: -1 })}
        >
          <FaArrowUp aria-hidden="true" className="size-3.5" />
        </IconButton>
        <IconButton
          label="Move down"
          disabled={isLast}
          onClick={() => dispatch({ type: "REORDER", index, increment: 1 })}
        >
          <FaArrowDown aria-hidden="true" className="size-3.5" />
        </IconButton>
        <IconButton
          label={visible ? "Hide on page" : "Show on page"}
          aria-pressed={!visible}
          onClick={() =>
            dispatch({ type: "UPDATE", index, key: "visible", value: !visible })
          }
        >
          {visible ? (
            <FaEye aria-hidden="true" className="size-4" />
          ) : (
            <FaEyeSlash aria-hidden="true" className="size-4" />
          )}
        </IconButton>

        {/* Two steps because a block can't be brought back once removed. */}
        {confirmingDelete ? (
          <button
            type="button"
            autoFocus
            onClick={() => {
              // The list is keyed by index, so the next block reuses this
              // component; clear the prompt so it doesn't inherit it.
              setConfirmingDelete(false);
              dispatch({ type: "DELETE", index });
            }}
            onBlur={() => setConfirmingDelete(false)}
            className="h-7 shrink-0 animate-in fade-in zoom-in-95 rounded-control bg-danger px-2 text-xs font-medium text-white duration-150 transition-[filter,transform] hover:brightness-95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50 focus-visible:ring-offset-1 motion-reduce:animate-none"
          >
            Delete?
          </button>
        ) : (
          <IconButton
            label="Delete element"
            onClick={() => setConfirmingDelete(true)}
            className="hover:bg-danger/10 hover:text-danger"
          >
            <FaTrashCan aria-hidden="true" className="size-3.5" />
          </IconButton>
        )}
      </div>

      {/* The body stays mounted and animates its height (0fr to 1fr) so a block
          opens and closes smoothly and can be reversed mid-motion; `inert`
          keeps collapsed controls out of the tab order. */}
      <div
        id={`${uid}-body`}
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-drawer motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden" inert={!expanded}>
          <div
            className={cn(
              "space-y-4 px-4 pb-4 pt-1 transition-opacity duration-200 motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="grid grid-cols-2 gap-3">
              {selectOptions.map(({ key, label, options }) => (
                <Field key={key} label={label} htmlFor={`${uid}-${key}`}>
                  <SelectField
                    id={`${uid}-${key}`}
                    value={config?.[key]}
                    onChange={(e) => handleConfigChange(e, key)}
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </SelectField>
                </Field>
              ))}
            </div>

            {activeDesc && (
              <p className="text-xs leading-relaxed text-neutral-600">
                {activeDesc.trim()}
              </p>
            )}

            {activeLoad &&
              Object.entries(activeLoad).map(([key, value]) =>
                key !== "expanded" ? (
                  <DynamicInput
                    key={`${key}-${lang}`}
                    index={index}
                    label={key}
                    value={value}
                    dispatch={dispatch}
                    config={config}
                    lang={lang}
                    blockType={type}
                  />
                ) : null,
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
