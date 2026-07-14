import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Filter, Search } from "lucide-react";
import {
  ESTADOS_MX,
  ESTATUS_SOL,
  TIPOS_REGISTRO,
  TIPOS_SOL,
} from "../constants/solicitudes.constants";
import type {
  EstatusSolicitud,
  TipoRegistroSolicitud,
} from "../types/solicitudes.types";

type Props = {
  q: string;
  onQChange: (value: string) => void;
  estado: string;
  onEstadoChange: (value: string) => void;
  estatus: EstatusSolicitud | "";
  onEstatusChange: (value: EstatusSolicitud | "") => void;
  tipo: string;
  onTipoChange: (value: string) => void;
  tipoRegistro: TipoRegistroSolicitud | "";
  onTipoRegistroChange: (value: TipoRegistroSolicitud | "") => void;
  desde: string;
  onDesdeChange: (value: string) => void;
  hasta: string;
  onHastaChange: (value: string) => void;
  onClear: () => void;
  onApply: () => void;
};

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const WEEK_DAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"] as const;

export default function SolicitudFilters({
  q,
  onQChange,
  estado,
  onEstadoChange,
  estatus,
  onEstatusChange,
  tipo,
  onTipoChange,
  tipoRegistro,
  onTipoRegistroChange,
  desde,
  onDesdeChange,
  hasta,
  onHastaChange,
  onClear,
  onApply,
}: Props) {
  const estadoOptions = useMemo(() => ["", ...ESTADOS_MX], []);
  const estatusOptions = useMemo(() => ["", ...ESTATUS_SOL], []);
  const tipoOptions = useMemo(() => ["", ...TIPOS_SOL], []);
  const tipoRegistroOptions = useMemo(() => ["", ...TIPOS_REGISTRO], []);

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
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Folio, nombre, estado, tipo, registro, estatus…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        <FilterSelect
          label="Estado"
          value={estado}
          onChange={onEstadoChange}
          options={estadoOptions}
          className="col-span-12 md:col-span-3"
        />

        <FilterSelect
          label="Estatus de la solicitud"
          value={estatus}
          onChange={(value) => onEstatusChange(value as EstatusSolicitud | "")}
          options={estatusOptions}
          className="col-span-6 md:col-span-2"
        />

        <FilterSelect
          label="Tipo de solicitud"
          value={tipo}
          onChange={onTipoChange}
          options={tipoOptions}
          className="col-span-6 md:col-span-3"
        />

        <FilterSelect
          label="Tipo de registro"
          value={tipoRegistro}
          onChange={(value) =>
            onTipoRegistroChange(value as TipoRegistroSolicitud | "")
          }
          options={tipoRegistroOptions}
          className="col-span-12 md:col-span-3"
        />

        <FilterDateField
          label="Desde"
          value={desde}
          onChange={onDesdeChange}
          className="col-span-6 md:col-span-3"
        />

        <FilterDateField
          label="Hasta"
          value={hasta}
          onChange={onHastaChange}
          className="col-span-6 md:col-span-3"
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
    </section>
  );
}

type FilterSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  className?: string;
  disabled?: boolean;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  disabled = false,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={className} ref={containerRef}>
      {label !== undefined && (
        <label className="mb-1 block text-[13px] text-slate-600">
          {label || "Todos"}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`w-full rounded-lg border px-3 py-2 text-left text-[14px] shadow-sm focus:outline-none focus:ring-2 ${
            disabled
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : "border-slate-300 bg-white focus:ring-slate-300"
          }`}
        >
          {value || "Todos"}

          <span
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-150 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            ▾
          </span>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
            <input
              autoFocus
              placeholder="Buscar…"
              className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="max-h-56 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option || "__all"}
                  type="button"
                  className="block w-full rounded-md px-3 py-2 text-left text-[14px] hover:bg-slate-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {option || "Todos"}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-[13px] text-slate-500">
                  Sin resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterDateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

function FilterDateField({
  label,
  value,
  onChange,
  className = "",
  disabled = false,
}: FilterDateFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [current, setCurrent] = useState<Date>(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }

    return new Date();
  });

  useEffect(() => {
    if (!value) return;

    const [year, month, day] = value.split("-").map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      setCurrent(new Date(year, month - 1, day));
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayValue = useMemo(() => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return "";
    return `${day}/${month}/${year}`;
  }, [value]);

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const weeks: (number | null)[][] = [];
  let dayCounter = 1 - firstDay;

  while (dayCounter <= daysInMonth) {
    const week: (number | null)[] = [];

    for (let i = 0; i < 7; i++) {
      if (dayCounter < 1 || dayCounter > daysInMonth) {
        week.push(null);
      } else {
        week.push(dayCounter);
      }
      dayCounter++;
    }

    weeks.push(week);
  }

  const selectedDay = value ? Number(value.split("-")[2]) : null;

  function toggleOpen() {
    if (disabled) return;
    setOpen((prev) => !prev);
  }

  function selectDay(day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${year}-${mm}-${dd}`);
    setOpen(false);
  }

  function goMonth(delta: number) {
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  function clearDate() {
    onChange("");
    setOpen(false);
  }

  function setToday() {
    const today = new Date();
    const yy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    onChange(`${yy}-${mm}-${dd}`);
    setCurrent(today);
    setOpen(false);
  }

  return (
    <div className={className} ref={containerRef}>
      <label className="mb-1 block text-[13px] text-slate-600">{label}</label>

      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder="dd/mm/aaaa"
          onClick={toggleOpen}
          disabled={disabled}
          className={`w-full rounded-lg border py-2 pl-3 pr-9 text-[14px] shadow-sm focus:outline-none focus:ring-2 ${
            disabled
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : "border-slate-300 bg-white focus:ring-slate-300"
          }`}
        />

        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
        >
          <CalendarDays className="h-4 w-4" />
        </button>

        {open && !disabled && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between text-[13px] text-slate-700">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="rounded-md px-2 py-1 hover:bg-slate-100"
              >
                ‹
              </button>

              <div className="font-medium capitalize">
                {MONTHS[month]} de {year}
              </div>

              <button
                type="button"
                onClick={() => goMonth(1)}
                className="rounded-md px-2 py-1 hover:bg-slate-100"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
              {WEEK_DAYS.map((weekDay) => (
                <span key={weekDay}>{weekDay}</span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1 text-[13px]">
              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="h-8 rounded-md"
                      />
                    );
                  }

                  const isSelected = day === selectedDay;

                  return (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`h-8 w-full rounded-md text-center ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[12px]">
              <button
                type="button"
                onClick={clearDate}
                className="text-slate-500 hover:text-slate-800"
              >
                Borrar
              </button>

              <button
                type="button"
                onClick={setToday}
                className="text-slate-700 hover:text-slate-900"
              >
                Hoy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}