export default function SelectInput({
  options = [],
  label,
  name,
  onChange,
  value = "",
  placeholder = "-- Select --",
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-medium">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="  p-2 rounded w-full border border-neutral-700"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
