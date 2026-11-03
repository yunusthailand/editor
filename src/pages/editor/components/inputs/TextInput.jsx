import { useState } from "react";
import { CONTROL } from "../EditorField";

export default function TextInput({ id, value, onChange }) {
  const [expanded, setExpanded] = useState(false);

  function handleToggleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <textarea
        id={id}
        value={value}
        rows={expanded ? 15 : 7}
        onChange={onChange}
        className={`${CONTROL} resize-none leading-relaxed`}
      />

      <button
        type="button"
        onClick={handleToggleExpand}
        aria-expanded={expanded}
        className="rounded-control px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
}
