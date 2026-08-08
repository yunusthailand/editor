import { useEffect, useRef, useState } from "react";

// Items are separated by newlines, not commas: a markdown link's text can
// legitimately contain a comma (e.g. "[Smith, John](example.com)"), and so can
// a query string. One item per line has no such ambiguity.
function joinItems(value) {
  return Array.isArray(value) ? value.join("\n") : (value ?? "");
}

function parseItems(text) {
  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ArrayInput({ value, index, label, dispatch, lang }) {
  const [text, setText] = useState(() => joinItems(value));

  // Tracks the last value we either received from or sent to the reducer, so we
  // can tell an incoming hydration apart from an echo of our own edit. Without
  // this, every commit produces a new array identity and the effect would
  // re-normalize the textarea while the user is still typing in it.
  const lastSynced = useRef(null);

  useEffect(() => {
    const joined = joinItems(value);

    if (joined !== lastSynced.current) {
      setText(joined);
      lastSynced.current = joined;
    }
  }, [value]);

  // Committed on blur rather than per keystroke: dispatching on every character
  // re-renders the whole preview pane. React fires blur before a sibling
  // button's click, so clicking straight from here to Save still captures it.
  function handleCommit() {
    const items = parseItems(text);
    const joined = joinItems(items);

    // Blur fires even when the user only tabbed through. Skipping the no-op
    // keeps us from dispatching an identical array on every focus change.
    if (joined === lastSynced.current) return;

    lastSynced.current = joined;

    dispatch({
      type: "UPDATE",
      index,
      key: label,
      value: items,
      lang,
    });
  }

  return (
    <textarea
      value={text}
      rows={4}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleCommit}
      className="bg-white border p-2 w-full rounded"
      placeholder="One item per line"
    />
  );
}
