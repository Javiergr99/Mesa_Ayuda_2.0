import type { ReactNode } from "react";
import { X } from "lucide-react";

import type {
  BitacoraDetail,
} from "./actualizarBitacoraDrawer.types";

type Props = {
  bitacora: BitacoraDetail | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
};

export default function ActualizarBitacoraDrawerShell({
  bitacora,
  loading,
  error,
  saving,
  onClose,
  onSave,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Cerrar actualización de bitácora"
        className="absolute inset-0 border-0 bg-slate-900/40 p-0"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[720px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <div className="text-[12px] text-slate-500">
              Bitácora › Actualizar
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Actualizar Bitácora
            </h2>

            {bitacora && (
              <p className="text-[12px] text-slate-500">
                Folio:{" "}
                <span className="font-medium">
                  {bitacora.folio}
                </span>
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-50"
          >
            <X
              aria-hidden="true"
              className="h-5 w-5"
            />
          </button>
        </header>

        {loading && (
          <div className="p-4 text-[14px] text-slate-600">
            Cargando información completa de la bitácora…
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-4 text-[13px] text-rose-600"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
            {children}
          </div>
        )}

        {!loading && (
          <footer className="border-t border-slate-200 bg-white px-6 py-3">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] hover:bg-slate-50 disabled:opacity-70"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saving || Boolean(error)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-[14px] text-white hover:bg-slate-800 disabled:opacity-70"
              >
                {saving
                  ? "Guardando…"
                  : "Guardar cambios"}
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
