export default function Combo({ load, config }) {
  const { head, text } = load;

  const { align, bg } = config;

  return (
    <div
      className="p-4 flex flex-col gap-2"
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        color: bg === "white" ? "black" : "white",

        alignItems:
          align === "center" ? "center" : align === "left" ? "start" : "end",
      }}
    >
      <h4
        className="text-xl xs:text-2xl text-center"
        style={{
          textAlign: align,
        }}
      >
        {head}
      </h4>

      <p
        className="px-1 text-center"
        style={{
          textAlign: align,
        }}
      >
        {text}
      </p>
    </div>
  );
}
