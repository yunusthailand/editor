import { useEffect, useId, useRef, useState } from "react";

import { FaRegImage } from "react-icons/fa6";

import { cn } from "@/lib/utils";

export default function ImageInput({ value, index, label, dispatch, width }) {
  const [preview, setPreview] = useState(null);

  const imageRef = useRef();

  const scaleRef = useRef();

  const widthId = useId();

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);

      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    if (value) {
      setPreview(value);
    }
  }, [value]);

  function handleChangeImg(e) {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];

      const objectUrl = URL.createObjectURL(newFile);

      setPreview(objectUrl);

      dispatch({
        type: "UPDATE",
        index,
        key: label,
        value: newFile,
      });
    }
  }

  function handleWidthChange() {
    dispatch({
      type: "UPDATE",

      index,

      key: "config",

      value: {
        width: scaleRef.current.value,
      },
    });
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={imageRef}
        accept="image/*"
        onChange={handleChangeImg}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => imageRef.current.click()}
        aria-label={preview ? "Replace image" : "Upload image"}
        className={cn(
          "group relative block aspect-video w-full overflow-hidden rounded-control transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          preview
            ? "border border-primary/25"
            : "grid place-items-center border-2 border-dashed border-neutral-300 bg-neutral-100 hover:border-secondary hover:bg-secondary/5",
        )}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
            <span className="absolute bottom-2 right-2 rounded-pill bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white">
              Replace
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-primary">
            <FaRegImage aria-hidden="true" className="size-5 text-primary/60" />
            <span className="text-xs font-medium">Upload an image</span>
          </span>
        )}
      </button>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between text-xs">
          <label htmlFor={widthId} className="font-medium text-primary">
            Width
          </label>
          <span className="tabular-nums text-neutral-600">{width}px</span>
        </div>
        <input
          id={widthId}
          type="range"
          value={width}
          min={150}
          max={750}
          step={10}
          ref={scaleRef}
          onChange={handleWidthChange}
          className="w-full cursor-pointer accent-secondary"
        />
      </div>
    </div>
  );
}
