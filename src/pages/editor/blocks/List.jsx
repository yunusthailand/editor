import { parseSingleMarkdownLink } from "@/utils/helpers";

export default function List({ load, config }) {
  const { head, array } = load;

  const { align, bg } = config;

  return (
    <div
      className="p-2 lg:p-4 space-y-2 flex flex-col"
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        color: bg === "white" ? "black" : "white",

        alignItems: align === "center" ? "center" : "start",
      }}
    >
      <p className="font-bold text-lg">{head}</p>

      <ul
        className="flex flex-col space-y-2"
        style={{
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {array.map((text, ind) => (
          <li key={ind} className="pl-2">
            {parseSingleMarkdownLink(text, ind)}
          </li>
        ))}
      </ul>
    </div>
  );
}
