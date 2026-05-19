export default function FileInput({ onChange, label = "Upload Image" }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-medium">{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="p-2 border rounded bg-white"
      />
    </div>
  );
}
