import React, { useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";

type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
};

export default function TimeField({
  label,
  value,
  onChange,
  className = "",
  placeholder = "hh:mm",
  error = false,
}: TimeFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const [h, m] = (value || "").split(":");
  const hour = isNaN(Number(h)) ? "" : String(Number(h)).padStart(2, "0");
  const minute = isNaN(Number(m)) ? "" : String(Number(m)).padStart(2, "0");

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
    []
  );

  const mins = useMemo(
    () => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")),
    []
  );

  function setHour(v: string) {
    onChange(`${v}:${minute || "00"}`);
  }

  function setMin(v: string) {
    onChange(`${hour || "00"}:${v}`);
  }

  const display = value ? `${hour}:${minute}` : "";

  return (
    <div className={className} ref={ref}>
      <label className="block text-[13px] text-slate-600 mb-1">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-left text-[14px] hover:bg-slate-50 focus:outline-none focus:ring-2 flex items-center justify-between ${
          error
            ? "border-rose-400 focus:ring-rose-200"
            : "border-slate-300 focus:ring-slate-300"
        }`}
      >
        <span className={`truncate ${!value ? "text-slate-400" : ""}`}>
          {display || placeholder}
        </span>
        <Clock className="h-4 w-4 text-slate-400" />
      </button>

      {error && (
        <div className="mt-1 text-[12px] text-rose-600">
          Selecciona una hora.
        </div>
      )}

      {open && (
        <div className="relative z-20">
          <div className="absolute mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[12px] text-slate-500">Horas</div>
                <div className="h-40 overflow-auto rounded-md border border-slate-100">
                  {hours.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setHour(v)}
                      className={`block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                        v === hour ? "bg-slate-900 text-white" : ""
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-[12px] text-slate-500">Minutos</div>
                <div className="h-40 overflow-auto rounded-md border border-slate-100">
                  {mins.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMin(v)}
                      className={`block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                        v === minute ? "bg-slate-900 text-white" : ""
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[12px]">
              <button
                type="button"
                className="text-slate-500 hover:text-slate-900"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Borrar
              </button>

              <button
                type="button"
                className="text-slate-600 hover:text-slate-900"
                onClick={() => {
                  if (!value) onChange("08:00");
                  setOpen(false);
                }}
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}