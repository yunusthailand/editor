import { useEffect, useState } from "react";

export default function ImageCaption({ load, config }) {
  const { img, text } = load;

  const { align, bg, width } = config;

  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);

      setUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setUrl(img);
  }, [img]);

  return (
    <div
      className="p-2 lg:p-4 flex flex-col"
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        color: bg === "white" ? "black" : "white",

        alignItems:
          align === "center" ? "center" : align === "left" ? "start" : "end",
      }}
    >
      <img
        src={url}
        alt=""
        style={{
          width: width ? (isNaN(width) ? width : `${width}px`) : "auto",

          height: "auto",

          objectFit: "cover",
        }}
      />

      <p
        className="text-zinc-400 italic"
        style={{
          textAlign:
            align === "center" ? "center" : align === "left" ? "left" : "right",
        }}
      >
        {text}
      </p>
    </div>
  );
}
