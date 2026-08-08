import clsx from "clsx";

// Primary is the teal used by the nav and every form's submit; the blue that
// two buttons used previously was the odd one out.
const VARIANTS = {
  primary: "bg-secondary text-white hover:brightness-95",
  outline: "border border-primary/30 text-primary hover:bg-primary/5",
  danger: "bg-danger text-white hover:brightness-95",
  ghost: "text-primary hover:bg-primary/5",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "rounded-control transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
