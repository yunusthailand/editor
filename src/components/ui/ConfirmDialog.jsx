import Button from "./Button";

// `children` is the extension point: a caller that needs to collect something
// before confirming (e.g. who to reassign a member's posts to) renders it in
// the body rather than building a bespoke modal.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  error,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-card p-6 space-y-4 text-xs w-[420px] shadow-card">
        <h3 className="text-lg font-light">{title}</h3>

        {message && <p>{message}</p>}

        {children}

        {error && <p className="text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={busy}
          >
            {busy ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
