
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import PageHeader from "../../../components/ui/PageHeader";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import BitacoraFilters from "../components/BitacoraFilters";
import BitacoraTable from "../components/BitacoraTable";
import ActualizarBitacoraDrawer from "../components/ActualizarBitacoraDrawer";

import {
  deleteBitacora,
  deleteBitacoraFile,
  getBitacoraById,
  listBitacoraFiles,
  listBitacoras,
  updateBitacora,
  uploadBitacoraFiles,
} from "../../../services/bitacoras.service";

const ESTADOS_MX = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

const ESTATUS = [
  "Pendiente",
  "Seguimiento",
  "Finalizado",
] as const;

type Estatus = (typeof ESTATUS)[number];

const TIPOS = [
  "Alta usuario",
  "Baja usuario",
  "Actualización de datos",
  "Recuperación de cuentas",
  "Fallas en el sistema",
  "Eliminación de registros",
  "Orientación por aplicación",
  "Formato de solicitud",
] as const;

const REGISTROS = ["RMH", "RMP", "RDVF", "RNOA"] as const;
type RegistroAbbr = (typeof REGISTROS)[number];

const REGISTROS_LABELS = [
  "Registro de Movilidad Humana",
  "Registro de Medidas de Protección",
  "Registro de Derecho a Vivir en Familia",
  "Registro Nacional de Obligaciones Alimentarias",
] as const;

type RegistroLabel = (typeof REGISTROS_LABELS)[number];

const REGISTRO_LABEL_TO_CODE: Record<
  RegistroLabel,
  RegistroAbbr
> = {
  "Registro de Movilidad Humana": "RMH",
  "Registro de Medidas de Protección": "RMP",
  "Registro de Derecho a Vivir en Familia": "RDVF",
  "Registro Nacional de Obligaciones Alimentarias": "RNOA",
};

const ESTADOS_OPTIONS = ["", ...ESTADOS_MX];
const ESTATUS_OPTIONS = ["", ...ESTATUS];
const TIPOS_OPTIONS = ["", ...TIPOS];
const REGISTROS_OPTIONS = ["", ...REGISTROS];

const ATENDIDO_POR = [
  "Arturo Reyes Alcauter",
  "Brandon Joel Cabalceta Brenes",
  "Danton Bazaldua Morquecho",
  "Fabiola Azucena Gutierrez",
  "Gustavo Gonzalez Cabrera",
  "Javier Garcia Lucero",
  "Jocelyn Romero Carrillo",
  "Monica Gabriela De la Luz Eslava",
].sort((a, b) =>
  a.localeCompare(b, "es", {
    sensitivity: "base",
  }),
);

const ATENDIDO_OPTIONS = ["", ...ATENDIDO_POR];
const DEFAULT_PAGE_SIZE = 5;
const SORT_BY: keyof Row = "fecha";
const SORT_DIRECTION: "asc" | "desc" = "desc";

export type Row = {
  id: number;
  folio: string;
  fecha: string;
  registro: RegistroAbbr;
  estado: string;
  tipo: string;
  estatus: Estatus;
  atendido_por: string;
  nombre: string;
};

export type BitacoraDetail = {
  id: number;
  folio: string;
  nombre: string;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  correo: string | null;
  telefono: string | null;
  estado: string;
  instancia: string | null;
  fecha: string;
  hora: string;
  tipo_caso: string;
  atendido_por: string;
  observaciones: string | null;
  estatus: Estatus | string;
  tipo_registro: string;
  created_at: string;
  updated_at: string | null;
  usuario_id: number;
};

type FiltersState = {
  qInput: string;
  estado: string;
  estatus: Estatus | "";
  tipo: string;
  registro: RegistroAbbr | "";
  atendido: string;
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

type DrawerState = {
  open: boolean;
  bitacora: BitacoraDetail | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_FILTERS: FiltersState = {
  qInput: "",
  estado: "",
  estatus: "",
  tipo: "",
  registro: "",
  atendido: "",
  desde: "",
  hasta: "",
};

const INITIAL_DRAWER: DrawerState = {
  open: false,
  bitacora: null,
  loading: false,
  error: null,
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

function buildName(bitacora: any) {
  return [
    bitacora.nombre,
    bitacora.primer_apellido,
    bitacora.segundo_apellido,
  ]
    .filter(
      (value) =>
        value && String(value).trim().length > 0,
    )
    .join(" ");
}

function mapBitacoraToRow(bitacora: any): Row {
  const label = bitacora.tipo_registro as RegistroLabel;
  const registro =
    REGISTRO_LABEL_TO_CODE[label] ?? "RMH";

  return {
    id: bitacora.id,
    folio: bitacora.folio,
    fecha: bitacora.fecha,
    registro,
    estado: bitacora.estado,
    tipo: bitacora.tipo_caso,
    estatus: bitacora.estatus as Estatus,
    atendido_por: bitacora.atendido_por,
    nombre: buildName(bitacora),
  };
}

function filterAndSortRows(
  rows: Row[],
  filters: FiltersState,
  query: string,
) {
  let result = rows;
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery) {
    result = result.filter((row) => {
      const status = String(row.estatus).toLowerCase();

      return (
        row.folio.toLowerCase().includes(normalizedQuery) ||
        row.nombre.toLowerCase().includes(normalizedQuery) ||
        row.estado.toLowerCase().includes(normalizedQuery) ||
        row.registro.toLowerCase().includes(normalizedQuery) ||
        row.tipo.toLowerCase().includes(normalizedQuery) ||
        row.atendido_por
          .toLowerCase()
          .includes(normalizedQuery) ||
        status.includes(normalizedQuery)
      );
    });
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

  if (filters.registro) {
    result = result.filter(
      (row) => row.registro === filters.registro,
    );
  }

  if (filters.atendido) {
    result = result.filter(
      (row) => row.atendido_por === filters.atendido,
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

  return [...result].sort((first, second) => {
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
}

function useBitacoraTracking() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    null,
  );

  const [filters, dispatchFilters] = useReducer(
    filtersReducer,
    INITIAL_FILTERS,
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DEFAULT_PAGE_SIZE,
  );

  const [drawer, setDrawer] = useState<DrawerState>(
    INITIAL_DRAWER,
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deletingRow, setDeletingRow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const deferredQuery = useDeferredValue(
    filters.qInput.trim(),
  );

  useEffect(() => {
    let active = true;

    async function fetchBitacoras() {
      setLoading(true);
      setLoadError(null);

      try {
        const response = await listBitacoras();

        if (active) {
          setData((response || []).map(mapBitacoraToRow));
        }
      } catch (fetchError: any) {
        console.error(fetchError);

        if (active) {
          setLoadError(
            fetchError?.response?.data?.detail ||
              fetchError?.message ||
              "No se pudo cargar la lista de bitácoras.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchBitacoras();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const filteredRows = useMemo(
    () =>
      filterAndSortRows(
        data,
        filters,
        deferredQuery,
      ),
    [data, filters, deferredQuery],
  );

  const total = filteredRows.length;
  const maxPage = Math.max(
    1,
    Math.ceil(total / pageSize),
  );
  const safePage = Math.min(page, maxPage);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  function showToast(
    message: string,
    duration = 1600,
  ) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
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

  function requestDelete(row: Row) {
    setToDelete(row);
    setConfirmOpen(true);
  }

  function cancelDelete() {
    setConfirmOpen(false);
    setToDelete(null);
  }

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }

    setDeletingRow(true);

    try {
      await deleteBitacora(toDelete.id);

      setData((currentRows) =>
        currentRows.filter(
          (row) => row.id !== toDelete.id,
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
      cancelDelete();
      showToast("Registro eliminado correctamente.");
    } catch (deleteError: any) {
      console.error(deleteError);

      showToast(
        deleteError?.response?.data?.detail ||
          deleteError?.message ||
          "No se pudo eliminar la bitácora. Inténtalo de nuevo.",
        2200,
      );
    } finally {
      setDeletingRow(false);
    }
  }

  async function openDrawer(row: Row) {
    setDrawer({
      open: true,
      bitacora: null,
      loading: true,
      error: null,
    });

    try {
      const bitacora: BitacoraDetail =
        await getBitacoraById(row.id);

      setDrawer({
        open: true,
        bitacora: {
          ...bitacora,
          estatus: bitacora.estatus as Estatus,
        },
        loading: false,
        error: null,
      });
    } catch (drawerError: any) {
      console.error(drawerError);

      setDrawer({
        open: true,
        bitacora: null,
        loading: false,
        error:
          drawerError?.response?.data?.detail ||
          drawerError?.message ||
          "No se pudo cargar el detalle de la bitácora.",
      });
    }
  }

  function closeDrawer() {
    setDrawer(INITIAL_DRAWER);
  }

  function handleUpdatedBitacora(
    updated: BitacoraDetail,
  ) {
    setData((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== updated.id) {
          return row;
        }

        const label =
          updated.tipo_registro as RegistroLabel;

        return {
          ...row,
          folio: updated.folio,
          fecha: updated.fecha,
          registro:
            REGISTRO_LABEL_TO_CODE[label] ??
            row.registro,
          estado: updated.estado,
          tipo: updated.tipo_caso,
          estatus: updated.estatus as Estatus,
          atendido_por: updated.atendido_por,
          nombre: buildName(updated),
        };
      }),
    );

    showToast("Bitácora actualizada.");
  }

  function changePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((currentPage) =>
      Math.max(1, currentPage - 1),
    );
  }

  function goToNextPage() {
    setPage((currentPage) =>
      Math.min(maxPage, currentPage + 1),
    );
  }

  return {
    filters,
    loading,
    loadError,
    pageData,
    total,
    safePage,
    maxPage,
    pageSize,
    drawer,
    confirmOpen,
    toDelete,
    deletingRow,
    toast,
    updateFilter,
    clearFilters,
    requestDelete,
    cancelDelete,
    confirmDelete,
    openDrawer,
    closeDrawer,
    handleUpdatedBitacora,
    changePageSize,
    goToPreviousPage,
    goToNextPage,
    setPage,
  };
}

export default function BitacoraSeguimientoPage() {
  const tracking = useBitacoraTracking();

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Bitácora › Seguimiento"
        title="Seguimiento de Bitácoras"
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <BitacoraFilters
          qInput={tracking.filters.qInput}
          onQInputChange={(value) =>
            tracking.updateFilter("qInput", value)
          }
          estado={tracking.filters.estado}
          onEstadoChange={(value) =>
            tracking.updateFilter("estado", value)
          }
          estatus={tracking.filters.estatus}
          onEstatusChange={(value) =>
            tracking.updateFilter("estatus", value)
          }
          tipo={tracking.filters.tipo}
          onTipoChange={(value) =>
            tracking.updateFilter("tipo", value)
          }
          registro={tracking.filters.registro}
          onRegistroChange={(value) =>
            tracking.updateFilter("registro", value)
          }
          atendidoFiltro={tracking.filters.atendido}
          onAtendidoFiltroChange={(value) =>
            tracking.updateFilter("atendido", value)
          }
          desde={tracking.filters.desde}
          onDesdeChange={(value) =>
            tracking.updateFilter("desde", value)
          }
          hasta={tracking.filters.hasta}
          onHastaChange={(value) =>
            tracking.updateFilter("hasta", value)
          }
          onClear={tracking.clearFilters}
          onApply={() => tracking.setPage(1)}
          loading={tracking.loading}
          loadError={tracking.loadError}
          estadosOptions={ESTADOS_OPTIONS}
          estatusOptions={ESTATUS_OPTIONS}
          tiposOptions={TIPOS_OPTIONS}
          registrosOptions={REGISTROS_OPTIONS}
          atendidoPorOptions={ATENDIDO_OPTIONS}
        />

        <BitacoraTable
          rows={tracking.pageData}
          total={tracking.total}
          page={tracking.safePage}
          maxPage={tracking.maxPage}
          pageSize={tracking.pageSize}
          loading={tracking.loading}
          deletingRow={tracking.deletingRow}
          onPageSizeChange={tracking.changePageSize}
          onPrevPage={tracking.goToPreviousPage}
          onNextPage={tracking.goToNextPage}
          onOpenDrawer={tracking.openDrawer}
          onRequestDelete={tracking.requestDelete}
        />
      </div>

      {tracking.drawer.open && (
        <ActualizarBitacoraDrawer
          bitacora={tracking.drawer.bitacora}
          loading={tracking.drawer.loading}
          error={tracking.drawer.error}
          onClose={tracking.closeDrawer}
          onUpdated={(updated) =>
            tracking.handleUpdatedBitacora(
              updated as BitacoraDetail,
            )
          }
          listBitacoraFiles={listBitacoraFiles}
          uploadBitacoraFiles={uploadBitacoraFiles}
          deleteBitacoraFile={deleteBitacoraFile}
          updateBitacora={updateBitacora}
        />
      )}

      <ConfirmDialog
        open={
          tracking.confirmOpen &&
          Boolean(tracking.toDelete)
        }
        title="Eliminar registro"
        message={
          tracking.toDelete
            ? `¿Seguro que deseas eliminar el folio ${tracking.toDelete.folio} – ${tracking.toDelete.nombre}? Esta acción no se puede deshacer.`
            : ""
        }
        onCancel={tracking.cancelDelete}
        onConfirm={tracking.confirmDelete}
        cancelText="Cancelar"
        confirmText="Eliminar"
        confirmVariant="danger"
      />

      {tracking.toast && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {tracking.toast}
        </div>
      )}
    </div>
  );
}
