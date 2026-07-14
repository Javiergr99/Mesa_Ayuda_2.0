import { ChevronLeft, ChevronRight, Download, Eye, Trash2 } from "lucide-react";

type RegistroAbbr = "RMH" | "RMP" | "RDVF" | "RNOA";
type Estatus = "Pendiente" | "Seguimiento" | "Finalizado";

type Row = {
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

type Props = {
  rows: Row[];
  total: number;
  page: number;
  maxPage: number;
  pageSize: number;
  loading: boolean;
  deletingRow: boolean;
  onPageSizeChange: (value: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenDrawer: (row: Row) => void;
  onRequestDelete: (row: Row) => void;
};

function EstatusBadge({ value }: { value: Estatus }) {
  const map = {
    Pendiente: "bg-amber-100 text-amber-800 border-amber-200",
    Seguimiento: "bg-sky-100 text-sky-800 border-sky-200",
    Finalizado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  } as const;

  return (
    <span className={`rounded-full border px-2 py-1 text-[12px] ${map[value]}`}>
      {value}
    </span>
  );
}

function RegistroBadge({ code }: { code: RegistroAbbr }) {
  const map: Record<RegistroAbbr, string> = {
    RMH: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
    RMP: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    RDVF: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    RNOA: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold ${map[code]}`}
    >
      {code}
    </span>
  );
}

export default function BitacoraTable({
  rows,
  total,
  page,
  maxPage,
  pageSize,
  loading,
  deletingRow,
  onPageSizeChange,
  onPrevPage,
  onNextPage,
  onOpenDrawer,
  onRequestDelete,
}: Props) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:p-3">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-[12px] uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Folio</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Registro</th>
              <th className="px-3 py-2">Tipo de caso</th>
              <th className="px-3 py-2">Atendido por</th>
              <th className="px-3 py-2">Estatus</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[14px]">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60">
                <td className="px-3 py-2 font-medium text-slate-800">
                  {row.folio}
                </td>
                <td className="px-3 py-2">{row.nombre}</td>
                <td className="px-3 py-2">{row.estado}</td>
                <td className="px-3 py-2">
                  <RegistroBadge code={row.registro} />
                </td>
                <td className="px-3 py-2">{row.tipo}</td>
                <td className="px-3 py-2">{row.atendido_por}</td>
                <td className="px-3 py-2">
                  <EstatusBadge value={row.estatus} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <button
                      className="rounded-md border border-slate-200 p-1 hover:bg-slate-50"
                      title="Ver / Actualizar"
                      onClick={() => onOpenDrawer(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      className="rounded-md border border-slate-200 p-1 hover:bg-slate-50"
                      title="Descargar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      className="rounded-md border border-rose-200 p-1 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      title="Eliminar"
                      onClick={() => onRequestDelete(row)}
                      disabled={deletingRow}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                  Sin resultados con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col items-center justify-between gap-3 text-[13px] text-slate-600 md:flex-row">
        <div>
          Mostrando <span className="font-medium text-slate-800">{rows.length}</span>{" "}
          de <span className="font-medium text-slate-800">{total}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onPrevPage}
              disabled={page === 1}
              className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2">
              {page} / {maxPage}
            </span>

            <button
              onClick={onNextPage}
              disabled={page === maxPage}
              className="rounded-md border border-slate-200 p-1 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}