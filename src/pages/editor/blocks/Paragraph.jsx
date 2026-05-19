import { parseMarkdownLinks } from "@/utils/helpers";

export default function Paragraph({ load, config }) {
  const { text } = load;

  const { align, bg } = config;

  return (
    <p
      className="p-3 lg:px-6 lg:p-4"
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        color: bg === "white" ? "black" : "white",

        textAlign: align,
      }}
    >
      {parseMarkdownLinks(text)}
    </p>
  );
}
