import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import BitacoraFilters from "../components/BitacoraFilters";
import BitacoraTable from "../components/BitacoraTable";
import ActualizarBitacoraDrawer from "../components/ActualizarBitacoraDrawer";

import {
  listBitacoras,
  getBitacoraById,
  updateBitacora,
  deleteBitacora,
  listBitacoraFiles,
  uploadBitacoraFiles,
  deleteBitacoraFile,
} from "../../../services/bitacoras.service";

/**
 * Mesa Ayuda 2.0 – Seguimiento de Bitácoras
 * Refactorizado para separar lógica de página y UI reutilizable
 */

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
];

const ESTATUS = ["Pendiente", "Seguimiento", "Finalizado"] as const;
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

const REGISTRO_LABEL_TO_CODE: Record<RegistroLabel, RegistroAbbr> = {
  "Registro de Movilidad Humana": "RMH",
  "Registro de Medidas de Protección": "RMP",
  "Registro de Derecho a Vivir en Familia": "RDVF",
  "Registro Nacional de Obligaciones Alimentarias": "RNOA",
};

const ESTATUS_OPTS: string[] = ["", ...Array.from(ESTATUS)];
const TIPOS_OPTS: string[] = ["", ...Array.from(TIPOS)];
const REGISTROS_OPTS: string[] = ["", ...Array.from(REGISTROS)];

const ATENDIDO_POR = [
  "Arturo Reyes Alcauter",
  "Brandon Joel Cabalceta Brenes",
  "Danton Bazaldua Morquecho",
  "Fabiola Azucena Gutierrez",
  "Gustavo Gonzalez Cabrera",
  "Javier Garcia Lucero",
  "Jocelyn Romero Carrillo",
  "Monica Gabriela De la Luz Eslava",
].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

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

export type ArchivoBitacoraItem = {
  id: number;
  original_name: string;
  stored_name: string;
  content_type: string | null;
  size_bytes: number;
  created_at: string;
};

function buildNombre(b: any): string {
  return [b.nombre, b.primer_apellido, b.segundo_apellido]
    .filter((x) => !!x && String(x).trim().length > 0)
    .join(" ");
}

export default function BitacoraSeguimientoPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");

  const [estado, setEstado] = useState("");
  const [estatus, setEstatus] = useState<Estatus | "">("");
  const [tipo, setTipo] = useState("");
  const [registro, setRegistro] = useState<RegistroAbbr | "">("");
  const [atendidoFiltro, setAtendidoFiltro] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy] = useState<keyof Row>("fecha");
  const [sortDir] = useState<"asc" | "desc">("desc");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBitacora, setEditBitacora] = useState<BitacoraDetail | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingRow, setDeletingRow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setQ(qInput.trim()), 250);
    return () => clearTimeout(id);
  }, [qInput]);

  useEffect(() => {
    let cancelled = false;

    async function fetchBitacoras() {
      setLoading(true);
      setLoadError(null);

      try {
        const res = await listBitacoras();
        if (cancelled) return;

        const rows: Row[] = (res || []).map((b: any) => {
          const label = b.tipo_registro as RegistroLabel;
          const registroCode: RegistroAbbr =
            REGISTRO_LABEL_TO_CODE[label] ?? "RMH";

          return {
            id: b.id,
            folio: b.folio,
            fecha: b.fecha,
            registro: registroCode,
            estado: b.estado,
            tipo: b.tipo_caso,
            estatus: b.estatus as Estatus,
            atendido_por: b.atendido_por,
            nombre: buildNombre(b),
          };
        });

        setData(rows);
      } catch (err: any) {
        console.error(err);
        setLoadError(
          err?.response?.data?.detail ||
            err?.message ||
            "No se pudo cargar la lista de bitácoras."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBitacoras();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, estado, estatus, tipo, registro, atendidoFiltro, desde, hasta, pageSize]);

  const filtered = useMemo(() => {
    let list = data;

    if (q) {
      const qq = q.toLowerCase();
      list = list.filter((r) => {
        const estatusText = String(r.estatus).toLowerCase();
        return (
          r.folio.toLowerCase().includes(qq) ||
          r.nombre.toLowerCase().includes(qq) ||
          r.estado.toLowerCase().includes(qq) ||
          r.registro.toLowerCase().includes(qq) ||
          r.tipo.toLowerCase().includes(qq) ||
          r.atendido_por.toLowerCase().includes(qq) ||
          estatusText.includes(qq)
        );
      });
    }

    if (estado) list = list.filter((r) => r.estado === estado);
    if (estatus) list = list.filter((r) => r.estatus === estatus);
    if (tipo) list = list.filter((r) => r.tipo === tipo);
    if (registro) list = list.filter((r) => r.registro === registro);
    if (atendidoFiltro) {
      list = list.filter((r) => r.atendido_por === atendidoFiltro);
    }
    if (desde) list = list.filter((r) => r.fecha >= desde);
    if (hasta) list = list.filter((r) => r.fecha <= hasta);

    return [...list].sort((a, b) => {
      const va = a[sortBy] as unknown as string;
      const vb = b[sortBy] as unknown as string;

      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, q, estado, estatus, tipo, registro, atendidoFiltro, desde, hasta, sortBy, sortDir]);

  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const requestDelete = useCallback((row: Row) => {
    setToDelete(row);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;

    setDeletingRow(true);

    try {
      await deleteBitacora(toDelete.id);

      setData((prev) => prev.filter((r) => r.id !== toDelete.id));
      setConfirmOpen(false);
      setToDelete(null);

      const remaining = Math.max(0, total - 1);
      const newMax = Math.max(1, Math.ceil(remaining / pageSize));
      setPage((p) => Math.min(p, newMax));

      setToast("Registro eliminado correctamente.");
      setTimeout(() => setToast(null), 1600);
    } catch (err: any) {
      console.error(err);
      setToast(
        err?.response?.data?.detail ||
          err?.message ||
          "No se pudo eliminar la bitácora. Inténtalo de nuevo."
      );
      setTimeout(() => setToast(null), 2200);
    } finally {
      setDeletingRow(false);
    }
  }, [toDelete, total, pageSize]);

  const openDrawer = useCallback(async (row: Row) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerError(null);
    setEditBitacora(null);

    try {
      const b: BitacoraDetail = await getBitacoraById(row.id);
      const est = b.estatus as Estatus;

      setEditBitacora({
        ...b,
        estatus: est,
      });
    } catch (err: any) {
      console.error(err);
      setDrawerError(
        err?.response?.data?.detail ||
          err?.message ||
          "No se pudo cargar el detalle de la bitácora."
      );
    } finally {
      setDrawerLoading(false);
    }
  }, []);

  const handleUpdatedBitacora = useCallback((updated: BitacoraDetail) => {
    setData((prev) =>
      prev.map((r) => {
        if (r.id !== updated.id) return r;

        const label = updated.tipo_registro as RegistroLabel;
        const registroCode: RegistroAbbr =
          REGISTRO_LABEL_TO_CODE[label] ?? r.registro;

        return {
          ...r,
          folio: updated.folio,
          fecha: updated.fecha,
          registro: registroCode,
          estado: updated.estado,
          tipo: updated.tipo_caso,
          estatus: updated.estatus as Estatus,
          atendido_por: updated.atendido_por,
          nombre: buildNombre(updated),
        };
      })
    );

    setToast("Bitácora actualizada.");
    setTimeout(() => setToast(null), 1600);
  }, []);

  function clearFilters() {
    setQInput("");
    setEstado("");
    setEstatus("");
    setTipo("");
    setRegistro("");
    setAtendidoFiltro("");
    setDesde("");
    setHasta("");
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Bitácora › Seguimiento"
        title="Seguimiento de Bitácoras"
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <BitacoraFilters
          qInput={qInput}
          onQInputChange={setQInput}
          estado={estado}
          onEstadoChange={setEstado}
          estatus={estatus}
          onEstatusChange={(value) => setEstatus(value as Estatus | "")}
          tipo={tipo}
          onTipoChange={setTipo}
          registro={registro}
          onRegistroChange={(value) => setRegistro(value as RegistroAbbr | "")}
          atendidoFiltro={atendidoFiltro}
          onAtendidoFiltroChange={setAtendidoFiltro}
          desde={desde}
          onDesdeChange={setDesde}
          hasta={hasta}
          onHastaChange={setHasta}
          onClear={() => {
            setQInput("");
            setEstado("");
            setEstatus("");
            setTipo("");
            setRegistro("");
            setAtendidoFiltro("");
            setDesde("");
            setHasta("");
          }}
          onApply={() => setPage(1)}
          loading={loading}
          loadError={loadError}
          estadosOptions={["", ...ESTADOS_MX]}
          estatusOptions={ESTATUS_OPTS}
          tiposOptions={TIPOS_OPTS}
          registrosOptions={REGISTROS_OPTS}
          atendidoPorOptions={["", ...ATENDIDO_POR]}
        />

        <BitacoraTable
          rows={pageData}
          total={total}
          page={page}
          maxPage={maxPage}
          pageSize={pageSize}
          loading={loading}
          deletingRow={deletingRow}
          onPageSizeChange={(value: number) => {
            setPageSize(value);
            setPage(1);
          }}
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(maxPage, p + 1))}
          onOpenDrawer={openDrawer}
          onRequestDelete={requestDelete}
        />
      </div>

      {drawerOpen && (
        <ActualizarBitacoraDrawer
          bitacora={editBitacora}
          loading={drawerLoading}
          error={drawerError}
          onClose={() => {
            setDrawerOpen(false);
            setEditBitacora(null);
            setDrawerError(null);
          }}
          onUpdated={(updated) => handleUpdatedBitacora(updated as BitacoraDetail)}
          listBitacoraFiles={listBitacoraFiles}
          uploadBitacoraFiles={uploadBitacoraFiles}
          deleteBitacoraFile={deleteBitacoraFile}
          updateBitacora={updateBitacora}
        />
      )}

      <ConfirmDialog
        open={confirmOpen && !!toDelete}
        title="Eliminar registro"
        message={
          toDelete
            ? `¿Seguro que deseas eliminar el folio ${toDelete.folio} – ${toDelete.nombre}? Esta acción no se puede deshacer.`
            : ""
        }
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
        onConfirm={confirmDelete}
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