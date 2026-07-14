import { useId } from "react";

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  maxLength,
  rows = 4,
  disabled = false,
  error = false,
  helperText,
}: TextAreaFieldProps) {
  const fieldId = useId();
  const helperId = `${fieldId}-helper`;
  const countId = `${fieldId}-count`;
  const count = value?.length || 0;

  const describedBy = [
    helperText ? helperId : null,
    maxLength ? countId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        {label}
      </label>

      <div className="relative">
        <textarea
          id={fieldId}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            disabled
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : error
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-300 focus:ring-slate-300"
          }`}
        />

        {maxLength ? (
          <div
            id={countId}
            className="absolute bottom-2 right-2 text-[11px] text-slate-400"
          >
            {count}/{maxLength}
          </div>
        ) : null}
      </div>

      {helperText ? (
        <div
          id={helperId}
          className={`mt-1 text-[12px] ${
            error ? "text-rose-600" : "text-slate-500"
          }`}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
