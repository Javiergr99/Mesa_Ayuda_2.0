import React from "react";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
  maxLength?: number;
};

export default function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  icon,
  disabled = false,
  error = false,
  helperText,
  autoComplete,
  maxLength,
}: TextFieldProps) {
  return (
    <div className={className}>
      <label className="block text-[13px] text-slate-600 mb-1">{label}</label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            icon ? "pl-9" : ""
          } ${
            disabled
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : error
              ? "border-rose-400 focus:ring-rose-200"
              : "border-slate-300 focus:ring-slate-300"
          }`}
        />
      </div>

      {helperText ? (
        <div
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