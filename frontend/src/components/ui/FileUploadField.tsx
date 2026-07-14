import { useId, type ChangeEvent } from "react";
import { Paperclip, Upload } from "lucide-react";

const FILE_IDS = new WeakMap<File, string>();
let fileSequence = 0;

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

function getFileId(file: File) {
  const existingId = FILE_IDS.get(file);

  if (existingId) {
    return existingId;
  }

  fileSequence += 1;
  const newId = `selected-file-${fileSequence}`;
  FILE_IDS.set(file, newId);

  return newId;
}

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
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const filesId = `${inputId}-files`;

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];

    onChange([...files, ...selectedFiles]);
    event.target.value = "";
  }

  function removeFile(targetFile: File) {
    const targetIndex = files.indexOf(targetFile);

    onChange(files.filter((_, index) => index !== targetIndex));
  }

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        {label}
      </label>

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50"
        >
          <Upload aria-hidden="true" className="h-4 w-4 text-slate-500" />
          <span className="text-[14px]">{buttonText}</span>
        </label>

        <input
          id={inputId}
          type="file"
          multiple={multiple}
          className="sr-only"
          accept={accept}
          aria-describedby={helperText ? helperId : undefined}
          aria-controls={files.length > 0 ? filesId : undefined}
          onChange={handleSelect}
        />

        {helperText && (
          <span id={helperId} className="text-[12px] text-slate-500">
            {helperText}
          </span>
        )}
      </div>

      {files.length > 0 && (
        <div
          id={filesId}
          aria-live="polite"
          className="mt-2 flex flex-wrap gap-2"
        >
          {files.map((file) => (
            <span
              key={getFileId(file)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm"
            >
              <Paperclip
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-500"
              />

              <span className="max-w-[220px] truncate" title={file.name}>
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(file)}
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
