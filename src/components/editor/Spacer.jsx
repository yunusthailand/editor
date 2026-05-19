export default function Spacer({ config }) {
  const { align, bg } = config;

  return (
    <div
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,

        textAlign: align,
      }}
    >
      <hr
        className="mx-2"
        style={{
          color: bg === "black" ? "white" : "black",
        }}
      />
    </div>
  );
}
