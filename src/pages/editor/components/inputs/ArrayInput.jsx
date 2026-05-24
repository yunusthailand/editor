import { useRef } from "react";

export default function ArrayInput({ index, label, dispatch, lang }) {
  const arrayRef = useRef();

  function handleArrayChange() {
    const arrayValues = arrayRef.current.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    dispatch({
      type: "UPDATE",
      index,
      key: label,
      value: arrayValues,
      lang,
    });
  }

  return (
    <div className="flex gap-2">
      <textarea
        ref={arrayRef}
        className="bg-white border p-2 w-full rounded"
        placeholder="Enter comma-separated values"
      />
      <button
        onClick={handleArrayChange}
        className="border cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 transition-all rounded whitespace-nowrap"
      >
        Make Array
      </button>
    </div>
  );
}
