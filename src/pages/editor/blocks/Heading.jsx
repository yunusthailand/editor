export default function Heading({ load, config }) {
  const { text } = load;

  const { align, bg } = config;

  return (
    <h2
      className="text-base lg:text-xl xl:text-2xl font-medium pt-4 p-2 lg:pt-8 lg:p-4"
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        color: bg === "white" ? "black" : "white",

        textAlign: align,
      }}
    >
      {text}
    </h2>
  );
}
