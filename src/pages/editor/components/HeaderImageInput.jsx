import { useEffect, useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Field } from "./EditorField";

export default function HeaderImageInput({ headerImage, setHeaderImage }) {
  const [preview, setPreview] = useState(null);

  const imageRef = useRef();

  useEffect(() => {
    if (headerImage instanceof File) {
      const objectUrl = URL.createObjectURL(headerImage);

      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    if (headerImage) {
      setPreview(headerImage);
    }
  }, [headerImage]);

  function handleChangeImage(e) {
    if (e.target.files && e.target.files[0]) {
      setHeaderImage(e.target.files[0]);
    }
  }

  return (
    <Field label="Header image">
      <button
        type="button"
        onClick={() => imageRef.current.click()}
        aria-label={preview ? "Replace header image" : "Upload header image"}
        className={cn(
          "group relative aspect-video w-full overflow-hidden rounded-control transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          preview
            ? "border border-primary/25"
            : "border-2 border-dashed border-neutral-300 bg-neutral-100 hover:border-secondary hover:bg-secondary/5",
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
          <span className="flex h-full flex-col items-center justify-center gap-2 text-primary">
            <FaRegImage aria-hidden="true" className="size-6 text-primary/60" />
            <span className="text-sm font-medium">Upload an image</span>
            <span className="text-xs text-neutral-600">
              Shown at the top of the post
            </span>
          </span>
        )}
      </button>

      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        onChange={handleChangeImage}
        className="hidden"
      />
    </Field>
  );
}
