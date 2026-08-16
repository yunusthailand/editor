import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Thin field wrapper: pairs a shadcn Label with a shadcn Input. Kept as its own
// component so the create/update forms stay declarative (label + name + value).
export default function TextInput({
  label,
  name,
  onChange,
  value = "",
  type = "text",
}) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
