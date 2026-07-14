import {
  useId,
  type ChangeEvent,
} from "react";
import {
  Paperclip,
  Upload,
} from "lucide-react";

import CardSection from "../../../components/ui/CardSection";

import type {
  ArchivoBitacoraItem,
} from "./actualizarBitacoraDrawer.types";

type Props = {
  existingFiles: ArchivoBitacoraItem[];
  loadingFiles: boolean;
  deletingFileId: number | null;
  anexos: File[];
  msgFile: File | null;
  onDeleteExistingFile: (fileId: number) => void;
  onAddAnexos: (files: File[]) => void;
  onRemoveAnexo: (file: File) => void;
  onMsgFileChange: (file: File | null) => void;
};

const FILE_IDS = new WeakMap<File, string>();
let fileSequence = 0;

function getFileId(file: File) {
  const existingId = FILE_IDS.get(file);

  if (existingId) {
    return existingId;
  }

  fileSequence += 1;
  const newId = `bitacora-anexo-${fileSequence}`;
  FILE_IDS.set(file, newId);

  return newId;
}

function ExistingFiles({
  files,
  loading,
  deletingFileId,
  onDelete,
}: {
  files: ArchivoBitacoraItem[];
  loading: boolean;
  deletingFileId: number | null;
  onDelete: (fileId: number) => void;
}) {
  return (
    <div className="col-span-12">
      <div className="mb-1 text-[13px] text-slate-600">
        Archivos registrados en la bitácora
      </div>

      {loading && (
        <div className="text-[13px] text-slate-500">
          Cargando archivos…
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-[13px] text-slate-500">
          No hay archivos registrados.
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={file.id}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[12px]"
            >
              <Paperclip
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-500"
              />

              <span
                className="max-w-[220px] truncate"
                title={file.original_name}
              >
                {file.original_name}
              </span>

              <button
                type="button"
                aria-label={`Eliminar ${file.original_name}`}
                onClick={() => onDelete(file.id)}
                disabled={deletingFileId === file.id}
                className="text-rose-500 hover:text-rose-600 disabled:opacity-60"
              >
                {deletingFileId === file.id
                  ? "Eliminando…"
                  : "✕"}
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NewAttachments({
  inputId,
  files,
  onAdd,
  onRemove,
}: {
  inputId: string;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (file: File) => void;
}) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];

    onAdd(selectedFiles);
    event.target.value = "";
  }

  return (
    <div className="col-span-12">
      <label
        htmlFor={inputId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        Anexos nuevos (.pdf, .docx, .xlsx, .csv, .jpg,
        .png)
      </label>

      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Upload
          aria-hidden="true"
          className="h-4 w-4 text-slate-500"
        />
        <span>Elegir archivos</span>
      </label>

      <input
        id={inputId}
        type="file"
        className="sr-only"
        multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
        onChange={handleChange}
      />

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={getFileId(file)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm"
            >
              <Paperclip
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-500"
              />

              <span
                className="max-w-[220px] truncate"
                title={file.name}
              >
                {file.name}
              </span>

              <button
                type="button"
                aria-label={`Eliminar ${file.name}`}
                onClick={() => onRemove(file)}
                className="text-slate-400 hover:text-rose-500"
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

function MessageAttachment({
  inputId,
  file,
  onChange,
}: {
  inputId: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onChange(event.target.files?.[0] || null);
    event.target.value = "";
  }

  return (
    <div className="col-span-12">
      <label
        htmlFor={inputId}
        className="mb-1 block text-[13px] text-slate-600"
      >
        Correo (.MSG)
      </label>

      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Upload
          aria-hidden="true"
          className="h-4 w-4 text-slate-500"
        />
        <span>Subir correo</span>
      </label>

      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept=".msg"
        onChange={handleChange}
      />

      {file && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm">
          <Paperclip
            aria-hidden="true"
            className="h-3.5 w-3.5 text-slate-500"
          />

          <span
            className="max-w-[240px] truncate"
            title={file.name}
          >
            {file.name}
          </span>

          <button
            type="button"
            aria-label={`Eliminar ${file.name}`}
            onClick={() => onChange(null)}
            className="text-slate-400 hover:text-rose-500"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActualizarBitacoraFilesSection({
  existingFiles,
  loadingFiles,
  deletingFileId,
  anexos,
  msgFile,
  onDeleteExistingFile,
  onAddAnexos,
  onRemoveAnexo,
  onMsgFileChange,
}: Props) {
  const anexosInputId = useId();
  const msgInputId = useId();

  return (
    <CardSection title="Archivos">
      <div className="grid grid-cols-12 gap-4">
        <ExistingFiles
          files={existingFiles}
          loading={loadingFiles}
          deletingFileId={deletingFileId}
          onDelete={onDeleteExistingFile}
        />

        <NewAttachments
          inputId={anexosInputId}
          files={anexos}
          onAdd={onAddAnexos}
          onRemove={onRemoveAnexo}
        />

        <MessageAttachment
          inputId={msgInputId}
          file={msgFile}
          onChange={onMsgFileChange}
        />
      </div>
    </CardSection>
  );
}
