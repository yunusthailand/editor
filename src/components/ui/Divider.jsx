export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-gray-400 text-[10px] uppercase tracking-widest">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
