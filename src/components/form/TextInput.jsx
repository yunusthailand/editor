export default function TextInput({
  label,
  name,
  onChange,
  value = "",
  type = "text",
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-medium">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="  p-2 rounded w-full border border-neutral-700"
      />
    </div>
  );
}
