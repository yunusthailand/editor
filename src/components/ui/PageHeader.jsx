export default function PageHeader({ title, subtitle }) {
  return (
    <div className="space-y-2">
      <h1 className="text-5xl font-thin tracking-wider">{title}</h1>
      {subtitle && (
        <p className="text-lg tracking-wide font-thin text-primary/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}
