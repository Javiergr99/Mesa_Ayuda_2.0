import { Download, Eye, Trash2 } from "lucide-react";
import type {
  EstatusSolicitud,
  SolicitudRow,
  TipoRegistroSolicitud,
} from "../types/solicitudes.types";

type Props = {
  rows: SolicitudRow[];
  onEdit: (row: SolicitudRow) => void;
  onDelete: (row: SolicitudRow) => void;
};

const ESTATUS_STYLES: Record<EstatusSolicitud, string> = {
  Pendiente: "border-amber-200 bg-amber-100 text-amber-800",
  "En proceso": "border-sky-200 bg-sky-100 text-sky-800",
  Cerrada: "border-emerald-200 bg-emerald-100 text-emerald-800",
  Cancelada: "border-rose-200 bg-rose-100 text-rose-700",
};

const REGISTRO_STYLES: Record<TipoRegistroSolicitud, string> = {
  RMH: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
  RMP: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  RDVF: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  RNOA: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function EstatusBadge({ value }: { value: EstatusSolicitud }) {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-[12px] ${ESTATUS_STYLES[value]}`}
    >
      {value}
    </span>
  );
}

function RegistroBadge({ code }: { code: TipoRegistroSolicitud }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold ${REGISTRO_STYLES[code]}`}
    >
      {code}
    </span>
  );
}

export default function SolicitudTable({
  rows,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section
      aria-label="Resultados de solicitudes"
      className="mt-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:p-3"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-[12px] uppercase tracking-wide text-slate-500">
              <th scope="col" className="px-3 py-2">
                Folio
              </th>
              <th scope="col" className="px-3 py-2">
                Nombre
              </th>
              <th scope="col" className="px-3 py-2">
                Estado
              </th>
              <th scope="col" className="px-3 py-2">
                Tipo de solicitud
              </th>
              <th scope="col" className="px-3 py-2">
                Tipo de registro
              </th>
              <th scope="col" className="px-3 py-2">
                Fecha
              </th>
              <th scope="col" className="px-3 py-2">
                Estatus
              </th>
              <th scope="col" className="px-3 py-2">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[14px]">
            {rows.map((row) => (
              <tr key={row.folio} className="hover:bg-slate-50/60">
                <td className="px-3 py-2 font-medium text-slate-800">
                  {row.folio}
                </td>
                <td className="px-3 py-2">{row.nombre}</td>
                <td className="px-3 py-2">{row.estado}</td>
                <td className="px-3 py-2">{row.tipo}</td>
                <td className="px-3 py-2">
                  <RegistroBadge code={row.registro} />
                </td>
                <td className="px-3 py-2">{formatDate(row.fecha)}</td>
                <td className="px-3 py-2">
                  <EstatusBadge value={row.estatus} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <button
                      type="button"
                      aria-label={`Actualizar solicitud ${row.folio}`}
                      title="Actualizar solicitud"
                      onClick={() => onEdit(row)}
                      className="rounded-md border border-slate-200 p-1 hover:bg-slate-50"
                    >
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      aria-label={`Descargar PDF de ${row.folio}`}
                      title="Descargar PDF"
                      className="rounded-md border border-slate-200 p-1 hover:bg-slate-50"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      aria-label={`Eliminar solicitud ${row.folio}`}
                      title="Eliminar"
                      onClick={() => onDelete(row)}
                      className="rounded-md border border-rose-200 p-1 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  Sin resultados con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}