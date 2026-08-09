import { Label } from "@/components/ui/label";

// Native <select> rather than the Radix one: these selects rely on an empty
// option to clear back to a placeholder, which Radix Select disallows. Styled
// to match the shadcn Input so the forms read as one system.
export default function SelectInput({
  options = [],
  label,
  name,
  onChange,
  value = "",
  placeholder = "-- Select --",
}) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="flex h-9 w-full rounded-control border border-primary/30 bg-white px-3 text-xs text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
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
