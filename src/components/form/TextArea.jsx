import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TextArea({
  label,
  name,
  onChange,
  value = "",
  rows = 6,
}) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
      />
    </div>
  );
}
