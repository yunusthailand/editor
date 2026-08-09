import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

// Built on the shadcn dialog (Radix): focus trap, Esc-to-close and scroll lock
// come for free. The parent mounts this only when it wants it open, so `open`
// is always true; closing routes through onCancel unless a request is in
// flight. `children` is the extension point — a caller collecting something
// before confirming (e.g. who to reassign a member's posts to) renders it in
// the body.
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
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next && !busy) onCancel();
      }}
    >
      <DialogContent className="text-xs">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>

        {children}

        {error && <p className="text-danger">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={onConfirm}
            loading={busy}
          >
            {busy ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
