export default function TextArea({
  label,
  name,
  onChange,
  value = "",
  rows = 6,
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-medium">{label}</label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 rounded-control w-full border border-primary/30 resize-none"
      />
    </div>
  );
}
