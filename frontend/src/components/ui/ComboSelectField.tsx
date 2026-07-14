import React, { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type ComboSelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  className?: string;
  placeholder?: string;
  error?: boolean;
};

export default function ComboSelectField({
  label,
  value,
  onChange,
  options = [],
  className = "",
  placeholder = "",
  error = false,
}: ComboSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(q.toLowerCase())),
    [options, q]
  );

  const display = q !== "" ? q : value || "";

  function commitFirstMatch() {
    if (filtered.length > 0) {
      onChange(filtered[0]);
      setQ("");
      setOpen(false);
    }
  }

  return (
    <div className={className}>
      <label className="block text-[13px] text-slate-600 mb-1">{label}</label>

      <div className="relative">
        <input
          aria-invalid={error}
          value={display}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitFirstMatch();
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
              setQ("");
            }, 120);
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-400 focus:ring-rose-200"
              : "border-slate-300 focus:ring-slate-300"
          }`}
        />

        {!!value && !open && (
          <CheckCircle2
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"
            aria-label="válido"
          />
        )}

        {open && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
            <div className="px-3 py-2 text-[12px] text-slate-400">
              Escribe para filtrar… (solo opciones del catálogo)
            </div>

            {filtered.length === 0 && (
              <div className="px-3 py-2 text-[13px] text-slate-500">
                Sin resultados
              </div>
            )}

            {filtered.map((op) => (
              <button
                key={op}
                type="button"
                className="block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(op);
                  setQ("");
                  setOpen(false);
                }}
              >
                {op}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-1 text-[12px] text-rose-600">
          Selecciona una opción del catálogo.
        </div>
      )}
    </div>
  );
}