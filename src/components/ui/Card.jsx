import clsx from "clsx";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-card border shadow-card p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
