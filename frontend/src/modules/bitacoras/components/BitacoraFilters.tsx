import { Filter, Search } from "lucide-react";
import SelectField from "../../../components/ui/SelectField";
import DateField from "../../../components/ui/DateField";

type Props = {
  qInput: string;
  onQInputChange: (value: string) => void;

  estado: string;
  onEstadoChange: (value: string) => void;

  estatus: string;
  onEstatusChange: (value: string) => void;

  tipo: string;
  onTipoChange: (value: string) => void;

  registro: string;
  onRegistroChange: (value: string) => void;

  atendidoFiltro: string;
  onAtendidoFiltroChange: (value: string) => void;

  desde: string;
  onDesdeChange: (value: string) => void;

  hasta: string;
  onHastaChange: (value: string) => void;

  onClear: () => void;
  onApply: () => void;

  loading: boolean;
  loadError: string | null;

  estadosOptions: string[];
  estatusOptions: string[];
  tiposOptions: string[];
  registrosOptions: string[];
  atendidoPorOptions: string[];
};

export default function BitacoraFilters({
  qInput,
  onQInputChange,
  estado,
  onEstadoChange,
  estatus,
  onEstatusChange,
  tipo,
  onTipoChange,
  registro,
  onRegistroChange,
  atendidoFiltro,
  onAtendidoFiltroChange,
  desde,
  onDesdeChange,
  hasta,
  onHastaChange,
  onClear,
  onApply,
  loading,
  loadError,
  estadosOptions,
  estatusOptions,
  tiposOptions,
  registrosOptions,
  atendidoPorOptions,
}: Props) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[13px] text-slate-600">
        <Filter className="h-4 w-4" />
        <span>Filtros</span>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-[13px] text-slate-600">
            Búsqueda
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={qInput}
              onChange={(e) => onQInputChange(e.target.value)}
              placeholder="Folio, nombre, estado, registro, tipo, atendido por, estatus…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        <SelectField
          label="Estado"
          value={estado}
          onChange={onEstadoChange}
          options={estadosOptions.filter(Boolean)}
          className="col-span-12 md:col-span-4"
          placeholder="Todos"
        />

        <SelectField
          label="Estatus"
          value={estatus}
          onChange={onEstatusChange}
          options={estatusOptions.filter(Boolean)}
          className="col-span-6 md:col-span-2"
          placeholder="Todos"
        />

        <SelectField
          label="Tipo de caso"
          value={tipo}
          onChange={onTipoChange}
          options={tiposOptions.filter(Boolean)}
          className="col-span-6 md:col-span-2"
          placeholder="Todos"
        />

        <SelectField
          label="Tipo de registro"
          value={registro}
          onChange={onRegistroChange}
          options={registrosOptions.filter(Boolean)}
          className="col-span-6 md:col-span-3"
          placeholder="Todos"
        />

        <SelectField
          label="Atendido por"
          value={atendidoFiltro}
          onChange={onAtendidoFiltroChange}
          options={atendidoPorOptions.filter(Boolean)}
          className="col-span-6 md:col-span-3"
          placeholder="Todos"
        />

        <DateField
          label="Desde"
          value={desde}
          onChange={onDesdeChange}
          className="col-span-6 md:col-span-3"
          placeholder="dd/mm/aaaa"
        />

        <DateField
          label="Hasta"
          value={hasta}
          onChange={onHastaChange}
          className="col-span-6 md:col-span-3"
          placeholder="dd/mm/aaaa"
        />

        <div className="col-span-12 flex items-end justify-end gap-2 md:col-span-6">
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] hover:bg-slate-50"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-xl bg-slate-900 px-4 py-2 text-[14px] text-white hover:bg-slate-800"
          >
            Aplicar
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-3 text-[13px] text-slate-500">Cargando bitácoras…</p>
      )}

      {loadError && (
        <p className="mt-3 text-[13px] text-rose-600">{loadError}</p>
      )}
    </section>
  );
}