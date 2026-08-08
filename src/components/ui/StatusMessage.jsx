import clsx from "clsx";

// Inline feedback, replacing the alert() calls the update forms used. Inline
// keeps the message next to the form that produced it and needs no new state
// plumbing, unlike a toast system.
export default function StatusMessage({ kind = "success", children }) {
  if (!children) return null;

  return (
    <p
      className={clsx(
        "text-xs",
        kind === "error" ? "text-danger" : "text-secondary",
      )}
    >
      {children}
    </p>
  );
}
