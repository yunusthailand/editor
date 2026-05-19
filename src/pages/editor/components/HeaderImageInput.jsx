import { useEffect, useRef, useState } from "react";

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
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-white text-sm font-semibold">Header Image</label>

      <div
        onClick={() => imageRef.current.click()}
        className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/30 bg-white/5 cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Header Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-light">
              +
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white text-3xl font-light">
            +
          </div>
        )}
      </div>

      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        onChange={handleChangeImage}
        className="hidden"
      />
    </div>
  );
}
