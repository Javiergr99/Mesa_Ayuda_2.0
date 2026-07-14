import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";

const EMPTY_OPTIONS: readonly string[] = [];

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: readonly string[];
  className?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
};

export default function SelectField({
  label,
  value,
  onChange,
  options = EMPTY_OPTIONS,
  className = "",
  placeholder = "Selecciona…",
  error = false,
  disabled = false,
}: SelectFieldProps) {
  const triggerId = useId();
  const listboxId = useId();
  const errorId = `${triggerId}-error`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const currentIndex = value
    ? options.findIndex((option) => option === value)
    : -1;

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
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

  function scrollOptionIntoView(index: number) {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const option = list.querySelector<HTMLElement>(
      `[data-option-index="${index}"]`,
    );

    option?.scrollIntoView({ block: "nearest" });
  }

  function openOptions() {
    const nextActive =
      options.length > 0 ? Math.max(0, currentIndex) : -1;

    setActive(nextActive);
    setOpen(true);
  }

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (
      !open &&
      (event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " ")
    ) {
      event.preventDefault();
      openOptions();
      return;
    }

    if (!open) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      const next = Math.min(
        options.length - 1,
        active < 0 ? 0 : active + 1,
      );

      setActive(next);
      scrollOptionIntoView(next);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      const next = Math.max(0, active < 0 ? 0 : active - 1);

      setActive(next);
      scrollOptionIntoView(next);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedOption = options[active];

      if (selectedOption) {
        selectOption(selectedOption);
      }

      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
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
        role="combobox"
        disabled={disabled}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
        aria-activedescendant={
          open && active >= 0
            ? `${listboxId}-option-${active}`
            : undefined
        }
        onClick={() => {
          if (disabled) {
            return;
          }

          if (open) {
            setOpen(false);
          } else {
            openOptions();
          }
        }}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-[14px] focus:outline-none focus:ring-2 ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            : error
              ? "border-rose-400 hover:bg-slate-50 focus:ring-rose-200"
              : "border-slate-300 hover:bg-slate-50 focus:ring-slate-300"
        }`}
      >
        <span className={`truncate ${!value ? "text-slate-400" : ""}`}>
          {value || placeholder}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {error && (
        <div id={errorId} className="mt-1 text-[12px] text-rose-600">
          Selecciona una opción del catálogo.
        </div>
      )}

      {open && !disabled && (
        <div className="relative z-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-3 rounded-t-xl bg-gradient-to-b from-white" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 rounded-b-xl bg-gradient-to-t from-white" />

          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-label={`Opciones de ${label}`}
            className="absolute mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-[13px] text-slate-500">
                Sin opciones disponibles
              </li>
            )}

            {options.map((option, index) => (
              <li key={option}>
                <button
                  id={`${listboxId}-option-${index}`}
                  data-option-index={index}
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => selectOption(option)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                    index === active ? "bg-slate-50" : ""
                  }`}
                >
                  {option === value ? (
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4 text-emerald-600"
                    />
                  ) : (
                    <span aria-hidden="true" className="h-4 w-4" />
                  )}

                  <span className="truncate">{option}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}