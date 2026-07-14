import { useEffect, useState } from "react";
import { Paperclip, Upload, X } from "lucide-react";

import CardSection from "../../../components/ui/CardSection";
import TextField from "../../../components/ui/TextField";
import TextAreaField from "../../../components/ui/TextAreaField";
import SelectField from "../../../components/ui/SelectField";
import ComboSelectField from "../../../components/ui/ComboSelectField";
import DateField from "../../../components/ui/DateField";
import TimeField from "../../../components/ui/TimeField";
import FileChips from "../../../components/ui/FileChips";

type Estatus = "Pendiente" | "Seguimiento" | "Finalizado";
type RegistroAbbr = "RMH" | "RMP" | "RDVF" | "RNOA";
type RegistroLabel =
  | "Registro de Movilidad Humana"
  | "Registro de Medidas de Protección"
  | "Registro de Derecho a Vivir en Familia"
  | "Registro Nacional de Obligaciones Alimentarias";

type BitacoraDetail = {
  id: number;
  folio: string;
  nombre: string;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  correo: string | null;
  telefono: string | null;
  estado: string;
  instancia: string | null;
  fecha: string;
  hora: string;
  tipo_caso: string;
  atendido_por: string;
  observaciones: string | null;
  estatus: Estatus | string;
  tipo_registro: string;
};

type ArchivoBitacoraItem = {
  id: number;
  original_name: string;
  stored_name: string;
  content_type: string | null;
  size_bytes: number;
  created_at: string;
};

type Props = {
  bitacora: BitacoraDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onUpdated?: (b: BitacoraDetail) => void;

  listBitacoraFiles: (id: number) => Promise<any>;
  uploadBitacoraFiles: (id: number, formData: FormData) => Promise<any>;
  deleteBitacoraFile: (bitacoraId: number, fileId: number) => Promise<any>;
  updateBitacora: (id: number, payload: Record<string, unknown>) => Promise<any>;
};

const ESTADOS_MX = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

const ESTATUS_OPTS = ["Pendiente", "Seguimiento", "Finalizado"];
const TIPOS_OPTS = [
  "Alta usuario",
  "Baja usuario",
  "Actualización de datos",
  "Recuperación de cuentas",
  "Fallas en el sistema",
  "Eliminación de registros",
  "Orientación por aplicación",
  "Formato de solicitud",
];

const REGISTROS_OPTS = ["RMH", "RMP", "RDVF", "RNOA"] as const;

const REGISTRO_LABEL_TO_CODE: Record<RegistroLabel, RegistroAbbr> = {
  "Registro de Movilidad Humana": "RMH",
  "Registro de Medidas de Protección": "RMP",
  "Registro de Derecho a Vivir en Familia": "RDVF",
  "Registro Nacional de Obligaciones Alimentarias": "RNOA",
};

const REGISTRO_CODE_TO_LABEL: Record<RegistroAbbr, RegistroLabel> = {
  RMH: "Registro de Movilidad Humana",
  RMP: "Registro de Medidas de Protección",
  RDVF: "Registro de Derecho a Vivir en Familia",
  RNOA: "Registro Nacional de Obligaciones Alimentarias",
};

const ATENDIDO_POR = [
  "Arturo Reyes Alcauter",
  "Brandon Joel Cabalceta Brenes",
  "Danton Bazaldua Morquecho",
  "Fabiola Azucena Gutierrez",
  "Gustavo Gonzalez Cabrera",
  "Javier Garcia Lucero",
  "Jocelyn Romero Carrillo",
  "Monica Gabriela De la Luz Eslava",
].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

export default function ActualizarBitacoraDrawer({
  bitacora,
  loading,
  error,
  onClose,
  onUpdated,
  listBitacoraFiles,
  uploadBitacoraFiles,
  deleteBitacoraFile,
  updateBitacora,
}: Props) {
  const [form, setForm] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    telefono: "",
    folio: "",
    estado: "",
    instancia: "",
    fecha: "",
    hora: "",
    tipo: "",
    atendido_por: "",
    observaciones: "",
    estatus: "" as Estatus | "",
    registro: "RMH" as RegistroAbbr,
  });

  const [existingFiles, setExistingFiles] = useState<ArchivoBitacoraItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null);

  const [anexos, setAnexos] = useState<File[]>([]);
  const [msgFile, setMsgFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

    useEffect(() => {
    if (!bitacora) return;

    const currentBitacora = bitacora;

    const registroLabel = currentBitacora.tipo_registro as RegistroLabel;
    const registroCode: RegistroAbbr =
        REGISTRO_LABEL_TO_CODE[registroLabel] ?? "RMH";

    setForm({
        nombre: currentBitacora.nombre || "",
        primer_apellido: currentBitacora.primer_apellido || "",
        segundo_apellido: currentBitacora.segundo_apellido || "",
        correo: currentBitacora.correo || "",
        telefono: currentBitacora.telefono || "",
        folio: currentBitacora.folio || "",
        estado: currentBitacora.estado || "",
        instancia: currentBitacora.instancia || "",
        fecha: currentBitacora.fecha || "",
        hora: (currentBitacora.hora || "").slice(0, 5),
        tipo: currentBitacora.tipo_caso || "",
        atendido_por: currentBitacora.atendido_por || "",
        observaciones: currentBitacora.observaciones || "",
        estatus: (currentBitacora.estatus as Estatus) || "Pendiente",
        registro: registroCode,
    });

    setAnexos([]);
    setMsgFile(null);

    async function fetchArchivos() {
        setLoadingFiles(true);
        try {
        const files = await listBitacoraFiles(currentBitacora.id);
        setExistingFiles(files || []);
        } catch (err) {
        console.error("Error cargando archivos de bitácora", err);
        } finally {
        setLoadingFiles(false);
        }
    }

    fetchArchivos();
}, [bitacora, listBitacoraFiles]);

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSelectAnexos(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setAnexos((prev) => [...prev, ...list]);
    e.target.value = "";
  }

  function removeAnexo(idx: number) {
    setAnexos((prev) => prev.filter((_, i) => i !== idx));
  }

  function onSelectMSG(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setMsgFile(f);
    e.target.value = "";
  }

  function nullIfEmpty(v: string) {
    const t = v?.trim();
    return t ? t : null;
  }

  async function handleDeleteExistingFile(fileId: number) {
    if (!bitacora) return;

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este archivo? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    setDeletingFileId(fileId);
    try {
      await deleteBitacoraFile(bitacora.id, fileId);
      setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
          err?.message ||
          "No se pudo eliminar el archivo. Inténtalo de nuevo."
      );
    } finally {
      setDeletingFileId(null);
    }
  }

  async function onSave() {
    if (!bitacora || saving) return;

    setSaving(true);

    try {
      const registroLabelFromCode: RegistroLabel =
        REGISTRO_CODE_TO_LABEL[form.registro] ??
        (bitacora.tipo_registro as RegistroLabel);

      const payload = {
        nombre: form.nombre,
        primer_apellido: nullIfEmpty(form.primer_apellido),
        segundo_apellido: nullIfEmpty(form.segundo_apellido),
        correo: nullIfEmpty(form.correo),
        telefono: nullIfEmpty(form.telefono),
        estado: form.estado,
        instancia: nullIfEmpty(form.instancia),
        fecha: form.fecha || bitacora.fecha,
        hora: form.hora || (bitacora.hora || "").slice(0, 5),
        tipo_caso: form.tipo || bitacora.tipo_caso,
        atendido_por: form.atendido_por || bitacora.atendido_por,
        observaciones: nullIfEmpty(form.observaciones),
        estatus: form.estatus || (bitacora.estatus as Estatus),
        tipo_registro: registroLabelFromCode,
      };

      const updated = await updateBitacora(bitacora.id, payload);

      if (anexos.length > 0 || msgFile) {
        const fd = new FormData();
        anexos.forEach((f) => fd.append("files", f));
        if (msgFile) fd.append("files", msgFile);
        await uploadBitacoraFiles(bitacora.id, fd);
      }

      onUpdated?.(updated);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
          err?.message ||
          "No se pudieron guardar los cambios de la bitácora."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!bitacora && !loading && !error) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[720px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <div className="text-[12px] text-slate-500">Bitácora › Actualizar</div>
            <h2 className="text-lg font-semibold text-slate-900">
              Actualizar Bitácora
            </h2>
            {bitacora && (
              <p className="text-[12px] text-slate-500">
                Folio: <span className="font-medium">{bitacora.folio}</span>
              </p>
            )}
          </div>

          <button
            className="rounded-lg p-2 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="p-4 text-[14px] text-slate-600">
            Cargando información completa de la bitácora…
          </div>
        )}

        {error && <div className="p-4 text-[13px] text-rose-600">{error}</div>}

        {!loading && !error && (
          <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
            <CardSection title="Datos de la persona">
              <div className="grid grid-cols-12 gap-4">
                <TextField
                  label="Nombre"
                  value={form.nombre}
                  onChange={(v) => onChange("nombre", v)}
                  className="col-span-12 md:col-span-4"
                />
                <TextField
                  label="Primer apellido"
                  value={form.primer_apellido}
                  onChange={(v) => onChange("primer_apellido", v)}
                  className="col-span-12 md:col-span-4"
                />
                <TextField
                  label="Segundo apellido"
                  value={form.segundo_apellido}
                  onChange={(v) => onChange("segundo_apellido", v)}
                  className="col-span-12 md:col-span-4"
                />
                <TextField
                  label="Correo"
                  value={form.correo}
                  onChange={(v) => onChange("correo", v)}
                  className="col-span-12 md:col-span-6"
                />
                <TextField
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(v) => onChange("telefono", v)}
                  className="col-span-12 md:col-span-3"
                />
                <TextField
                  label="Folio"
                  value={form.folio}
                  onChange={(v) => onChange("folio", v)}
                  className="col-span-12 md:col-span-3"
                  disabled
                />
              </div>
            </CardSection>

            <CardSection title="Ubicación / Institución">
              <div className="grid grid-cols-12 gap-4">
                <SelectField
                  label="Estado"
                  value={form.estado}
                  onChange={(v) => onChange("estado", v)}
                  options={ESTADOS_MX}
                  className="col-span-12 md:col-span-6"
                  placeholder="Selecciona…"
                />
                <TextField
                  label="Instancia"
                  value={form.instancia}
                  onChange={(v) => onChange("instancia", v)}
                  className="col-span-12 md:col-span-6"
                  placeholder="Nombre de la institución / área"
                />
              </div>
            </CardSection>

            <CardSection title="Detalles del caso">
              <div className="grid grid-cols-12 gap-4">
                <SelectField
                  label="Tipo de caso"
                  value={form.tipo}
                  onChange={(v) => onChange("tipo", v)}
                  options={TIPOS_OPTS}
                  className="col-span-12 md:col-span-6"
                  placeholder="Selecciona…"
                />
                <ComboSelectField
                  label="Atendido por"
                  value={form.atendido_por}
                  onChange={(v) => onChange("atendido_por", v)}
                  options={ATENDIDO_POR}
                  className="col-span-12 md:col-span-6"
                  placeholder="Busca o selecciona…"
                />
                <DateField
                  label="Fecha"
                  value={form.fecha}
                  onChange={(v) => onChange("fecha", v)}
                  className="col-span-12 md:col-span-6"
                  placeholder="dd/mm/aaaa"
                />
                <TimeField
                  label="Hora"
                  value={form.hora}
                  onChange={(v) => onChange("hora", v)}
                  className="col-span-12 md:col-span-6"
                  placeholder="hh:mm"
                />
                <TextAreaField
                  label="Observaciones"
                  value={form.observaciones}
                  onChange={(v) => onChange("observaciones", v)}
                  className="col-span-12"
                  placeholder="Notas y observaciones relevantes del caso…"
                />
              </div>
            </CardSection>

            <CardSection title="Metadatos">
              <div className="grid grid-cols-12 gap-4">
                <SelectField
                  label="Estatus"
                  value={form.estatus}
                  onChange={(v) => onChange("estatus", v as Estatus)}
                  options={ESTATUS_OPTS}
                  className="col-span-12 md:col-span-6"
                  placeholder="Selecciona…"
                />
                <SelectField
                  label="Tipo de registro"
                  value={form.registro}
                  onChange={() => {}}
                  options={[...REGISTROS_OPTS]}
                  className="col-span-12 md:col-span-6"
                  placeholder="Selecciona…"
                  disabled
                />
              </div>
            </CardSection>

            <CardSection title="Archivos">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                    <div className="mb-1 text-[13px] text-slate-600">
                        Archivos registrados en la bitácora
                    </div>

                    {loadingFiles && (
                        <div className="text-[13px] text-slate-500">Cargando archivos…</div>
                    )}

                    {!loadingFiles && existingFiles.length === 0 && (
                        <div className="text-[13px] text-slate-500">
                        No hay archivos registrados.
                        </div>
                    )}

                    {!loadingFiles && existingFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                        {existingFiles.map((f) => (
                            <span
                            key={f.id}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[12px]"
                            >
                            <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                            <span className="max-w-[220px] truncate" title={f.original_name}>
                                {f.original_name}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeleteExistingFile(f.id)}
                                className="text-rose-500 hover:text-rose-600 disabled:opacity-60"
                                disabled={deletingFileId === f.id}
                            >
                                {deletingFileId === f.id ? "Eliminando…" : "✕"}
                            </button>
                            </span>
                        ))}
                        </div>
                    )}
                    </div>

                    <div className="col-span-12">
                    <label className="mb-1 block text-[13px] text-slate-600">
                        Anexos nuevos (.pdf, .docx, .xlsx, .csv, .jpg, .png)
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>Elegir archivos</span>
                        <input
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
                        onChange={onSelectAnexos}
                        />
                    </label>

                    {anexos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                        {anexos.map((f, i) => (
                            <span
                            key={i}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm"
                            >
                            <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                            <span className="max-w-[220px] truncate" title={f.name}>
                                {f.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeAnexo(i)}
                                className="text-slate-400 hover:text-rose-500"
                            >
                                ×
                            </button>
                            </span>
                        ))}
                        </div>
                    )}
                    </div>

                    <div className="col-span-12">
                    <label className="mb-1 block text-[13px] text-slate-600">
                        Correo (.MSG)
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <Upload className="h-4 w-4 text-slate-500" />
                        <span>Subir correo</span>
                        <input
                        type="file"
                        className="sr-only"
                        accept=".msg"
                        onChange={onSelectMSG}
                        />
                    </label>

                    {msgFile && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm">
                        <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                        <span className="max-w-[240px] truncate" title={msgFile.name}>
                            {msgFile.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => setMsgFile(null)}
                            className="text-slate-400 hover:text-rose-500"
                        >
                            ×
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                </CardSection>
                        </div>
                        )}

        {!loading && (
          <div className="border-t border-slate-200 bg-white px-6 py-3">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px] hover:bg-slate-50"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-xl bg-slate-900 px-4 py-2 text-[14px] text-white hover:bg-slate-800 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}