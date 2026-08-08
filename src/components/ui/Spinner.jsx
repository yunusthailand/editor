import clsx from "clsx";

const SIZES = { sm: "size-4 border-2", md: "size-6 border-2" };

export default function Spinner({ size = "md", className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        "inline-block rounded-pill border-primary/20 border-t-secondary animate-spin",
        SIZES[size],
        className,
      )}
    />
  );
}
