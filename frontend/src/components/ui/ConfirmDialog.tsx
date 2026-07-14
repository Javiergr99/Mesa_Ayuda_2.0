import React from "react";
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
  if (!open) return null;

  const confirmClass =
    confirmVariant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-rose-600 text-white hover:bg-rose-700";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-md mx-4 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex items-center justify-center h-8 w-8 rounded-full bg-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-[14px] text-slate-600">{message}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-[14px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-[14px] rounded-xl shadow ${confirmClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}