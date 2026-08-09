import { Label } from "@/components/ui/label";

// Native file input — styled to sit next to the shadcn fields. The file-picker
// button itself is browser chrome; the file:* utilities style it to read as a
// small secondary control.
export default function FileInput({ onChange, label = "Upload Image" }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label>{label}</Label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="block w-full text-sm text-primary/70 file:mr-3 file:rounded-control file:border-0 file:bg-primary/5 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/10"
      />
    </div>
  );
}
