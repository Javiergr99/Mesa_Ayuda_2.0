import { useEffect, useId, useRef } from "react";
import { AlertCircle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "primary";
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  confirmVariant = "danger",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const confirmClass =
    confirmVariant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-rose-600 text-white hover:bg-rose-700";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-[1px]"
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100"
            aria-hidden="true"
          >
            <AlertCircle className="h-5 w-5 text-rose-600" />
          </div>

          <div>
            <h2
              id={titleId}
              className="text-[18px] font-semibold text-slate-900"
            >
              {title}
            </h2>

            <p id={messageId} className="mt-1 text-[14px] text-slate-600">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-[14px] shadow ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}