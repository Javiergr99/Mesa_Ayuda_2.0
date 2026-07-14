import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

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
  options = [],
  className = "",
  placeholder = "Selecciona…",
  error = false,
  disabled = false,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const ref = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const currentIndex = value ? options.findIndex((o) => o === value) : -1;

  function scrollIntoView(idx: number) {
    const ul = listRef.current;
    if (!ul) return;
    const li = ul.children[idx] as HTMLElement | undefined;
    if (li) li.scrollIntoView({ block: "nearest" });
  }

  function onKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActive(Math.max(0, currentIndex));
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => {
        const next = Math.min(options.length - 1, i < 0 ? 0 : i + 1);
        scrollIntoView(next);
        return next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => {
        const next = Math.max(0, i < 0 ? 0 : i - 1);
        scrollIntoView(next);
        return next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) {
        onChange(options[active]);
        setOpen(false);
      }
    }

    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={className} ref={ref}>
      <label className="mb-1 block text-[13px] text-slate-600">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => {
            const next = !v;
            if (next) setActive(Math.max(0, currentIndex));
            return next;
          });
        }}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
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
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {error && (
        <div className="mt-1 text-[12px] text-rose-600">
          Selecciona una opción del catálogo.
        </div>
      )}

      {open && !disabled && (
        <div className="relative z-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-3 rounded-t-xl bg-gradient-to-b from-white" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 rounded-b-xl bg-gradient-to-t from-white" />

          <ul
            ref={listRef}
            role="listbox"
            className="absolute mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
          >
            {options.map((op, idx) => (
              <li key={op}>
                <button
                  type="button"
                  role="option"
                  aria-selected={op === value}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    onChange(op);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] hover:bg-slate-50 ${
                    idx === active ? "bg-slate-50" : ""
                  }`}
                >
                  {op === value ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span className="truncate">{op}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}