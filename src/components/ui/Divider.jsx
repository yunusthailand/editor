export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
