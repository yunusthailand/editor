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
        className="p-2 rounded-control w-full border border-primary/30"
      />
    </div>
  );
}
