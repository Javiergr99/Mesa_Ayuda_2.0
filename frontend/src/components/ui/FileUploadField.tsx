import type { ChangeEvent } from "react";
import { Paperclip, Upload } from "lucide-react";

type Props = {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
  buttonText?: string;
};

export default function FileUploadField({
  label,
  files,
  onChange,
  className = "",
  accept = ".pdf,.doc,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png",
  multiple = true,
  helperText = "Hasta 10MB por archivo",
  buttonText = "Elegir archivos",
}: Props) {
  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    onChange([...files, ...selectedFiles]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={className}>
      <label className="mb-1 block text-[13px] text-slate-600">{label}</label>

      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">
          <Upload className="h-4 w-4 text-slate-500" />
          <span className="text-[14px]">{buttonText}</span>
          <input
            type="file"
            multiple={multiple}
            className="hidden"
            accept={accept}
            onChange={handleSelect}
          />
        </label>

        {helperText && (
          <span className="text-[12px] text-slate-500">{helperText}</span>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <span
              key={`${file.name}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm"
            >
              <Paperclip className="h-3.5 w-3.5 text-slate-500" />

              <span className="max-w-[220px] truncate" title={file.name}>
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-rose-500"
                aria-label={`Eliminar ${file.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}