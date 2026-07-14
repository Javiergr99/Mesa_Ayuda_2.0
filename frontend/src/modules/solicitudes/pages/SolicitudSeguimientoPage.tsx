import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PageHeader from "../../../components/ui/PageHeader";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import SolicitudFilters from "../components/SolicitudFilters";
import SolicitudTable from "../components/SolicitudTable";
import SolicitudDrawer from "../components/SolicitudDrawer";

import { MOCK_SOLICITUDES } from "../constants/solicitudes.constants";
import type {
  EstatusSolicitud,
  SolicitudRow,
  TipoRegistroSolicitud,
} from "../types/solicitudes.types";

const DEFAULT_PAGE_SIZE = 5;
const SORT_BY: keyof SolicitudRow = "fecha";
const SORT_DIR: "asc" | "desc" = "desc";

export default function SolicitudSeguimientoPage() {
  const [data, setData] = useState<SolicitudRow[]>(MOCK_SOLICITUDES);

  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [estatus, setEstatus] = useState<EstatusSolicitud | "">("");
  const [tipo, setTipo] = useState("");
  const [tipoRegistro, setTipoRegistro] = useState<TipoRegistroSolicitud | "">(
    ""
  );
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [editRow, setEditRow] = useState<SolicitudRow | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<SolicitudRow | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [q, estado, estatus, tipo, tipoRegistro, desde, hasta, pageSize]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    let list = [...data];
    const qq = q.trim().toLowerCase();

    if (qq) {
      list = list.filter(
        (row) =>
          row.folio.toLowerCase().includes(qq) ||
          row.nombre.toLowerCase().includes(qq) ||
          row.estado.toLowerCase().includes(qq) ||
          row.tipo.toLowerCase().includes(qq) ||
          row.registro.toLowerCase().includes(qq) ||
          row.estatus.toLowerCase().includes(qq)
      );
    }

    if (estado) {
      list = list.filter((row) => row.estado === estado);
    }

    if (estatus) {
      list = list.filter((row) => row.estatus === estatus);
    }

    if (tipo) {
      list = list.filter((row) => row.tipo === tipo);
    }

    if (tipoRegistro) {
      list = list.filter((row) => row.registro === tipoRegistro);
    }

    if (desde) {
      list = list.filter((row) => row.fecha >= desde);
    }

    if (hasta) {
      list = list.filter((row) => row.fecha <= hasta);
    }

    list.sort((a, b) => {
      const valueA = a[SORT_BY] as string;
      const valueB = b[SORT_BY] as string;

      if (valueA < valueB) return SORT_DIR === "asc" ? -1 : 1;
      if (valueA > valueB) return SORT_DIR === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, q, estado, estatus, tipo, tipoRegistro, desde, hasta]);

  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage((prev) => Math.min(prev, maxPage));
  }, [maxPage]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return filtered.slice(start, end);
  }, [filtered, page, pageSize]);

  const pageStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = total === 0 ? 0 : pageStart + pageData.length - 1;

  function showToastMessage(message: string) {
    setToast(message);
  }

  function closeDrawer() {
    setEditRow(null);
  }

  function handleEdit(row: SolicitudRow) {
    setEditRow(row);
  }

  function handleDeleteRequest(row: SolicitudRow) {
    setToDelete(row);
    setConfirmOpen(true);
  }

  function handleDeleteConfirm() {
    if (!toDelete) return;

    setData((prev) => prev.filter((row) => row.folio !== toDelete.folio));
    setConfirmOpen(false);
    setToDelete(null);
    showToastMessage("Solicitud eliminada");
  }

  function handleUpdatedSolicitud(updated: SolicitudRow) {
    setData((prev) =>
      prev.map((row) => (row.folio === updated.folio ? updated : row))
    );

    closeDrawer();
    showToastMessage("Solicitud actualizada");
  }

  function handleClearFilters() {
    setQ("");
    setEstado("");
    setEstatus("");
    setTipo("");
    setTipoRegistro("");
    setDesde("");
    setHasta("");
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Solicitudes › Seguimiento"
        title="Seguimiento de Solicitudes"
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <SolicitudFilters
          q={q}
          onQChange={setQ}
          estado={estado}
          onEstadoChange={setEstado}
          estatus={estatus}
          onEstatusChange={setEstatus}
          tipo={tipo}
          onTipoChange={setTipo}
          tipoRegistro={tipoRegistro}
          onTipoRegistroChange={setTipoRegistro}
          desde={desde}
          onDesdeChange={setDesde}
          hasta={hasta}
          onHastaChange={setHasta}
          onClear={handleClearFilters}
          onApply={() => setPage(1)}
        />

        <SolicitudTable
          rows={pageData}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

        <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-600 md:flex-row">
          <div>
            Mostrando{" "}
            <span className="font-medium text-slate-800">
              {pageStart}–{pageEnd}
            </span>{" "}
            de <span className="font-medium text-slate-800">{total}</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[13px]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-2">
                {page} / {maxPage}
              </span>

              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
                disabled={page === maxPage}
                className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {editRow && (
        <SolicitudDrawer
          row={editRow}
          onClose={closeDrawer}
          onSave={handleUpdatedSolicitud}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar solicitud"
        message={
          toDelete
            ? `¿Seguro que deseas eliminar la solicitud ${toDelete.folio} – ${toDelete.nombre}? Esta acción no se puede deshacer.`
            : ""
        }
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        cancelText="Cancelar"
        confirmText="Eliminar"
        confirmVariant="danger"
      />

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}