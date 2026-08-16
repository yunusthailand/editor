import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NumberInput({ label, name, onChange, value = "" }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="number"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
