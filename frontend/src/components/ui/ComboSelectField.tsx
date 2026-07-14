import { useId, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const EMPTY_OPTIONS: readonly string[] = [];

type ComboSelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: readonly string[];
  className?: string;
  placeholder?: string;
  error?: boolean;
};

export default function ComboSelectField({
  label,
  value,
  onChange,
  options = EMPTY_OPTIONS,
  className = "",
  placeholder = "",
  error = false,
}: ComboSelectFieldProps) {
  const inputId = useId();
  const listboxId = useId();
  const errorId = `${inputId}-error`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const displayValue = query !== "" ? query : value;

  function closeOptions() {
    setOpen(false);
    setQuery("");
  }

  function selectOption(option: string) {
    onChange(option);
    closeOptions();
  }

  function commitFirstMatch() {
    const firstOption = filteredOptions[0];

    if (firstOption) {
      selectOption(firstOption);
    }
  }

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          role="combobox"
          value={displayValue}
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-invalid={error || undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitFirstMatch();
            }

            if (event.key === "Escape") {
              closeOptions();
            }
          }}
          onBlur={() => {
            window.setTimeout(closeOptions, 120);
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
            aria-hidden="true"
            className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
          />
        )}

        {open && (
          <div
            id={listboxId}
            role="listbox"
            aria-label={`Opciones de ${label}`}
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg"
          >
            <div
              aria-hidden="true"
              className="px-3 py-2 text-[12px] text-slate-400"
            >
              Escribe para filtrar… (solo opciones del catálogo)
            </div>

            {filteredOptions.length === 0 && (
              <div
                role="status"
                className="px-3 py-2 text-[13px] text-slate-500"
              >
                Sin resultados
              </div>
            )}

            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === value}
                className="block w-full px-3 py-2 text-left text-[14px] hover:bg-slate-50"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div id={errorId} className="mt-1 text-[12px] text-rose-600">
          Selecciona una opción del catálogo.
        </div>
      )}
    </div>
  );
}