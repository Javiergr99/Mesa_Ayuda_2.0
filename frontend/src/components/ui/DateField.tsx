import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
  disableFuture?: boolean;
};

export default function DateField({
  label,
  value,
  onChange,
  className = "",
  placeholder = "dd/mm/aaaa",
  error = false,
  disableFuture = true,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = value ? new Date(value) : null;
  const [cursor, setCursor] = useState<Date>(() =>
    selected ? new Date(selected) : new Date()
  );

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const monthLabel = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const firstWeekday = (start.getDay() + 6) % 7;

  const days = Array.from(
    { length: firstWeekday + end.getDate() },
    (_, i) =>
      i < firstWeekday
        ? null
        : new Date(cursor.getFullYear(), cursor.getMonth(), i - firstWeekday + 1)
  );

  function fmtOut(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function fmtDisplay(d?: Date | null) {
    if (!d) return "";
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

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
          {value ? fmtDisplay(new Date(value)) : placeholder}
        </span>
        <CalendarDays className="h-4 w-4 text-slate-400" />
      </button>

      {error && (
        <div className="mt-1 text-[12px] text-rose-600">
          Selecciona una fecha.
        </div>
      )}

      {open && (
        <div className="relative z-20">
          <div className="absolute mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                className="rounded-md p-1 hover:bg-slate-50"
                onClick={() =>
                  setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                }
              >
                ‹
              </button>

              <div className="text-[14px] font-medium capitalize">
                {monthLabel}
              </div>

              <button
                type="button"
                className="rounded-md p-1 hover:bg-slate-50"
                onClick={() =>
                  setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                }
                disabled={
                  disableFuture &&
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) > today
                }
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[12px] text-slate-500 mb-1">
              {["lu", "ma", "mi", "ju", "vi", "sá", "do"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((d, idx) => {
                const isFuture = d
                  ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) > today
                  : false;

                const blocked = disableFuture ? isFuture : false;

                const isSelected =
                  selected && d && selected.toDateString() === d.toDateString();

                return (
                  <button
                    key={idx}
                    disabled={!d || blocked}
                    onClick={() => {
                      if (d && !blocked) {
                        onChange(fmtOut(d));
                        setOpen(false);
                      }
                    }}
                    className={`h-8 rounded-md text-[13px] ${
                      !d ? "invisible" : ""
                    } ${
                      blocked
                        ? "text-slate-300 cursor-not-allowed"
                        : "hover:bg-slate-50"
                    } ${
                      isSelected ? "bg-slate-900 text-white hover:bg-slate-900" : ""
                    }`}
                  >
                    {d ? d.getDate() : ""}
                  </button>
                );
              })}
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
                  const t = new Date();
                  t.setHours(0, 0, 0, 0);
                  onChange(fmtOut(t));
                  setCursor(t);
                  setOpen(false);
                }}
              >
                Hoy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}