import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

const MONTH_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
});

const DISPLAY_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"] as const;

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
  disableFuture?: boolean;
};

function startOfDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  return normalized;
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;

  const parsed = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date | null) {
  return date ? DISPLAY_FORMATTER.format(date) : "";
}

export default function DateField({
  label,
  value,
  onChange,
  className = "",
  placeholder = "dd/mm/aaaa",
  error = false,
  disableFuture = true,
}: DateFieldProps) {
  const triggerId = useId();
  const panelId = useId();
  const errorId = `${triggerId}-error`;

  const [open, setOpen] = useState(false);
  const [today] = useState(() => startOfDay(new Date()));

  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => parseIsoDate(value), [value]);

  const [cursor, setCursor] = useState<Date>(() =>
    selected ? new Date(selected) : new Date(),
  );

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

  const monthLabel = MONTH_FORMATTER.format(cursor);

  const start = new Date(
    cursor.getFullYear(),
    cursor.getMonth(),
    1,
  );

  const end = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  );

  const firstWeekday = (start.getDay() + 6) % 7;

  const days = Array.from(
    { length: firstWeekday + end.getDate() },
    (_, index) =>
      index < firstWeekday
        ? null
        : new Date(
            cursor.getFullYear(),
            cursor.getMonth(),
            index - firstWeekday + 1,
          ),
  );

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
          {selected ? formatDisplayDate(selected) : placeholder}
        </span>

        <CalendarDays
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
          Selecciona una fecha.
        </div>
      )}

      {open && (
        <div className="relative z-20">
          <div
            id={panelId}
            className="absolute mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label="Mes anterior"
                className="rounded-md p-1 hover:bg-slate-50"
                onClick={() =>
                  setCursor(
                    new Date(
                      cursor.getFullYear(),
                      cursor.getMonth() - 1,
                      1,
                    ),
                  )
                }
              >
                ‹
              </button>

              <div className="text-[14px] font-medium capitalize">
                {monthLabel}
              </div>

              <button
                type="button"
                aria-label="Mes siguiente"
                className="rounded-md p-1 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() =>
                  setCursor(
                    new Date(
                      cursor.getFullYear(),
                      cursor.getMonth() + 1,
                      1,
                    ),
                  )
                }
                disabled={
                  disableFuture &&
                  new Date(
                    cursor.getFullYear(),
                    cursor.getMonth() + 1,
                    1,
                  ) > today
                }
              >
                ›
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[12px] text-slate-500">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((date, index) => {
                const isFuture = date
                  ? startOfDay(date) > today
                  : false;

                const blocked = disableFuture && isFuture;

                const isSelected =
                  Boolean(selected) &&
                  Boolean(date) &&
                  selected?.toDateString() === date?.toDateString();

                return (
                  <button
                    key={
                      date
                        ? formatIsoDate(date)
                        : `empty-${index}`
                    }
                    type="button"
                    disabled={!date || blocked}
                    aria-label={
                      date
                        ? DISPLAY_FORMATTER.format(date)
                        : undefined
                    }
                    aria-pressed={isSelected || undefined}
                    onClick={() => {
                      if (date && !blocked) {
                        onChange(formatIsoDate(date));
                        setOpen(false);
                      }
                    }}
                    className={`h-8 rounded-md text-[13px] ${
                      !date ? "invisible" : ""
                    } ${
                      blocked
                        ? "cursor-not-allowed text-slate-300"
                        : "hover:bg-slate-50"
                    } ${
                      isSelected
                        ? "bg-slate-900 text-white hover:bg-slate-900"
                        : ""
                    }`}
                  >
                    {date ? date.getDate() : ""}
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
                  const currentDate = startOfDay(new Date());

                  onChange(formatIsoDate(currentDate));
                  setCursor(currentDate);
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