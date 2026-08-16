export default function EmptyState({ title, message, action }) {
  return (
    <div className="w-full py-12 text-center space-y-2 text-primary">
      <p className="text-lg font-thin tracking-wide">{title}</p>
      {message && <p className="text-xs text-primary/70">{message}</p>}
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
}
