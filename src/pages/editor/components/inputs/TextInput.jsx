import { useState } from "react";

export default function TextInput({ value, onChange }) {
  const [expanded, setExpanded] = useState(false);

  function handleToggleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      <button
        type="button"
        onClick={handleToggleExpand}
        className="px-2 py-1 border rounded text-xs bg-white hover:bg-gray-100 transition-all"
      >
        {expanded ? "Collapse Input" : "Expand Input"}
      </button>

      <textarea
        value={value}
        rows={expanded ? 15 : 7}
        onChange={onChange}
        className="bg-white border p-2 w-full resize-none rounded"
      />
    </div>
  );
}
