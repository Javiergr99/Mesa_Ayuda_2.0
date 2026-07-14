import { useEffect, useId, useRef, useState } from "react";
import { Clock } from "lucide-react";

const HOURS = Array.from(
  { length: 24 },
  (_, index) => String(index).padStart(2, "0"),
);

const MINUTES = Array.from(
  { length: 60 },
  (_, index) => String(index).padStart(2, "0"),
);

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
  const triggerId = useId();
  const panelId = useId();
  const hoursLabelId = useId();
  const minutesLabelId = useId();
  const errorId = `${triggerId}-error`;

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentMouseDown,
      );
    };
  }, []);

  const [rawHour, rawMinute] = (value || "").split(":");

  const hour = Number.isNaN(Number(rawHour))
    ? ""
    : String(Number(rawHour)).padStart(2, "0");

  const minute = Number.isNaN(Number(rawMinute))
    ? ""
    : String(Number(rawMinute)).padStart(2, "0");

  const display = value ? `${hour}:${minute}` : "";

  function setHour(nextHour: string) {
    onChange(`${nextHour}:${minute || "00"}`);
  }

  function setMinute(nextMinute: string) {
    onChange(`${hour || "00"}:${nextMinute}`);
  }

  return (
    <div className={className} ref={containerRef}>
      <label
        htmlFor={triggerId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        {label}
      </label>

      <button
        id={triggerId}
        type="button"
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-[14px] hover:bg-slate-50 focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-400 focus:ring-rose-200"
            : "border-slate-300 focus:ring-slate-300"
        }`}
      >
        <span className={`truncate ${!value ? "text-slate-400" : ""}`}>
          {display || placeholder}
        </span>

        <Clock
          aria-hidden="true"
          className="h-4 w-4 text-slate-400"
        />
      </button>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="mt-1 text-[12px] text-rose-600"
        >
          Selecciona una hora.
        </div>
      )}

      {open && (
        <div className="relative z-20">
          <div
            id={panelId}
            className="absolute mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-3">
              <div role="group" aria-labelledby={hoursLabelId}>
                <div
                  id={hoursLabelId}
                  className="mb-1 text-[12px] text-slate-500"
                >
                  Horas
                </div>

                <div className="h-40 overflow-auto rounded-md border border-slate-100">
                  {HOURS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={option === hour}
                      onClick={() => setHour(option)}
                      className={`block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                        option === hour
                          ? "bg-slate-900 text-white"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div role="group" aria-labelledby={minutesLabelId}>
                <div
                  id={minutesLabelId}
                  className="mb-1 text-[12px] text-slate-500"
                >
                  Minutos
                </div>

                <div className="h-40 overflow-auto rounded-md border border-slate-100">
                  {MINUTES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={option === minute}
                      onClick={() => setMinute(option)}
                      className={`block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                        option === minute
                          ? "bg-slate-900 text-white"
                          : ""
                      }`}
                    >
                      {option}
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
                  if (!value) {
                    onChange("08:00");
                  }

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