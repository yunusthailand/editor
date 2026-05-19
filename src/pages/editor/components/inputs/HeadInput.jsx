export default function HeadInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
      className="bg-white border p-2 w-full rounded"
    />
  );
}
