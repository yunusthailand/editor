import { useEffect, useRef, useState } from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";

export default function ImageInput({ value, index, label, dispatch, width }) {
  const [preview, setPreview] = useState(null);

  const imageRef = useRef();

  const scaleRef = useRef();

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
        type="range"
        value={width}
        min={150}
        max={750}
        step={10}
        ref={scaleRef}
        onChange={handleWidthChange}
      />

      <input
        type="file"
        ref={imageRef}
        accept="image/*"
        onChange={handleChangeImg}
        className="hidden"
      />

      {preview ? (
        <div
          onClick={() => imageRef.current.click()}
          className="size-24 relative cursor-pointer"
        >
          <img
            src={preview}
            alt="Preview"
            className="size-24 object-cover absolute"
          />

          <div className="flex text-white items-center justify-center z-10 size-24 backdrop-brightness-75 absolute">
            <p className="scale-150">
              <AiOutlinePlusCircle />
            </p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => imageRef.current.click()}
          className="cursor-pointer flex justify-center items-center bg-white size-24 rounded border"
        >
          +
        </div>
      )}
    </div>
  );
}
