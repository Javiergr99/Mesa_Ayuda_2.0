import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

type FiltersState = {
  q: string;
  estado: string;
  estatus: EstatusSolicitud | "";
  tipo: string;
  tipoRegistro: TipoRegistroSolicitud | "";
  desde: string;
  hasta: string;
};

type FiltersAction =
  | {
      type: "set";
      key: keyof FiltersState;
      value: string;
    }
  | {
      type: "clear";
    };

const DEFAULT_PAGE_SIZE = 5;
const SORT_BY: keyof SolicitudRow = "fecha";
const SORT_DIRECTION: "asc" | "desc" = "desc";

const INITIAL_FILTERS: FiltersState = {
  q: "",
  estado: "",
  estatus: "",
  tipo: "",
  tipoRegistro: "",
  desde: "",
  hasta: "",
};

function filtersReducer(
  state: FiltersState,
  action: FiltersAction,
): FiltersState {
  if (action.type === "clear") {
    return INITIAL_FILTERS;
  }

  return {
    ...state,
    [action.key]: action.value,
  } as FiltersState;
}

function filterAndSortSolicitudes(
  rows: SolicitudRow[],
  filters: FiltersState,
) {
  let result = [...rows];
  const query = filters.q.trim().toLowerCase();

  if (query) {
    result = result.filter(
      (row) =>
        row.folio.toLowerCase().includes(query) ||
        row.nombre.toLowerCase().includes(query) ||
        row.estado.toLowerCase().includes(query) ||
        row.tipo.toLowerCase().includes(query) ||
        row.registro.toLowerCase().includes(query) ||
        row.estatus.toLowerCase().includes(query),
    );
  }

  if (filters.estado) {
    result = result.filter(
      (row) => row.estado === filters.estado,
    );
  }

  if (filters.estatus) {
    result = result.filter(
      (row) => row.estatus === filters.estatus,
    );
  }

  if (filters.tipo) {
    result = result.filter(
      (row) => row.tipo === filters.tipo,
    );
  }

  if (filters.tipoRegistro) {
    result = result.filter(
      (row) =>
        row.registro === filters.tipoRegistro,
    );
  }

  if (filters.desde) {
    result = result.filter(
      (row) => row.fecha >= filters.desde,
    );
  }

  if (filters.hasta) {
    result = result.filter(
      (row) => row.fecha <= filters.hasta,
    );
  }

  result.sort((first, second) => {
    const firstValue = String(first[SORT_BY]);
    const secondValue = String(second[SORT_BY]);

    if (firstValue < secondValue) {
      return SORT_DIRECTION === "asc" ? -1 : 1;
    }

    if (firstValue > secondValue) {
      return SORT_DIRECTION === "asc" ? 1 : -1;
    }

    return 0;
  });

  return result;
}

export default function SolicitudSeguimientoPage() {
  const [data, setData] = useState<SolicitudRow[]>(
    MOCK_SOLICITUDES,
  );

  const [filters, dispatchFilters] = useReducer(
    filtersReducer,
    INITIAL_FILTERS,
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DEFAULT_PAGE_SIZE,
  );

  const [editRow, setEditRow] =
    useState<SolicitudRow | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] =
    useState<SolicitudRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const filtered = useMemo(
    () => filterAndSortSolicitudes(data, filters),
    [data, filters],
  );

  const total = filtered.length;
  const maxPage = Math.max(
    1,
    Math.ceil(total / pageSize),
  );
  const safePage = Math.min(page, maxPage);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const pageStart =
    total === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const pageEnd =
    total === 0
      ? 0
      : pageStart + pageData.length - 1;

  function showToastMessage(message: string) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 1600);
  }

  function updateFilter(
    key: keyof FiltersState,
    value: string,
  ) {
    dispatchFilters({
      type: "set",
      key,
      value,
    });
    setPage(1);
  }

  function clearFilters() {
    dispatchFilters({ type: "clear" });
    setPage(1);
  }

  function handleDeleteRequest(row: SolicitudRow) {
    setToDelete(row);
    setConfirmOpen(true);
  }

  function handleDeleteConfirm() {
    if (!toDelete) {
      return;
    }

    setData((currentRows) =>
      currentRows.filter(
        (row) => row.folio !== toDelete.folio,
      ),
    );

    const remaining = Math.max(0, total - 1);
    const nextMaxPage = Math.max(
      1,
      Math.ceil(remaining / pageSize),
    );

    setPage((currentPage) =>
      Math.min(currentPage, nextMaxPage),
    );
    setConfirmOpen(false);
    setToDelete(null);
    showToastMessage("Solicitud eliminada");
  }

  function handleUpdatedSolicitud(
    updated: SolicitudRow,
  ) {
    setData((currentRows) =>
      currentRows.map((row) =>
        row.folio === updated.folio
          ? updated
          : row,
      ),
    );

    setEditRow(null);
    showToastMessage("Solicitud actualizada");
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Solicitudes › Seguimiento"
        title="Seguimiento de Solicitudes"
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <SolicitudFilters
          q={filters.q}
          onQChange={(value) =>
            updateFilter("q", value)
          }
          estado={filters.estado}
          onEstadoChange={(value) =>
            updateFilter("estado", value)
          }
          estatus={filters.estatus}
          onEstatusChange={(value) =>
            updateFilter("estatus", value)
          }
          tipo={filters.tipo}
          onTipoChange={(value) =>
            updateFilter("tipo", value)
          }
          tipoRegistro={filters.tipoRegistro}
          onTipoRegistroChange={(value) =>
            updateFilter("tipoRegistro", value)
          }
          desde={filters.desde}
          onDesdeChange={(value) =>
            updateFilter("desde", value)
          }
          hasta={filters.hasta}
          onHastaChange={(value) =>
            updateFilter("hasta", value)
          }
          onClear={clearFilters}
          onApply={() => setPage(1)}
        />

        <SolicitudTable
          rows={pageData}
          onEdit={setEditRow}
          onDelete={handleDeleteRequest}
        />

        <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-600 md:flex-row">
          <div>
            Mostrando{" "}
            <span className="font-medium text-slate-800">
              {pageStart}–{pageEnd}
            </span>{" "}
            de{" "}
            <span className="font-medium text-slate-800">
              {total}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="solicitudes-page-size"
              className="sr-only"
            >
              Solicitudes por página
            </label>

            <select
              id="solicitudes-page-size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(
                  Number(event.target.value),
                );
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
                aria-label="Página anterior"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(1, currentPage - 1),
                  )
                }
                disabled={safePage === 1}
                className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
              >
                <ChevronLeft
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>

              <span className="px-2" aria-live="polite">
                {safePage} / {maxPage}
              </span>

              <button
                type="button"
                aria-label="Página siguiente"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(
                      maxPage,
                      currentPage + 1,
                    ),
                  )
                }
                disabled={safePage === maxPage}
                className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
              >
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {editRow && (
        <SolicitudDrawer
          row={editRow}
          onClose={() => setEditRow(null)}
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
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
