import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../../components/ui/PageHeader";
import CardSection from "../../../components/ui/CardSection";
import TextField from "../../../components/ui/TextField";
import TextAreaField from "../../../components/ui/TextAreaField";
import SelectField from "../../../components/ui/SelectField";
import FileUploadField from "../../../components/ui/FileUploadField";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  AMBITO_SOL,
  ESTADOS_MX,
  ESTATUS_SOL,
  MUNICIPIOS_SOL,
  PERFIL_SOL,
  TIPOS_REGISTRO,
} from "../constants/solicitudes.constants";

type SolicitudForm = {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  nombre_usuario: string;
  correo: string;
  telefono: string;
  extension: string;
  celular: string;
  perfil: string;
  estatus: string;
  ambito: string;
  estado: string;
  municipio: string;
  area_adscripcion: string;
  atendido_por: string;
  observaciones: string;
  tipo_registro: string;
};

const INITIAL_FORM: SolicitudForm = {
  nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  nombre_usuario: "",
  correo: "",
  telefono: "",
  extension: "",
  celular: "",
  perfil: "",
  estatus: "",
  ambito: "",
  estado: "",
  municipio: "",
  area_adscripcion: "",
  atendido_por: "",
  observaciones: "",
  tipo_registro: "",
};

const REQUIRED_FIELDS: Array<keyof SolicitudForm> = [
  "nombre",
  "primer_apellido",
  "segundo_apellido",
  "nombre_usuario",
  "correo",
  "perfil",
  "estatus",
  "ambito",
  "estado",
  "area_adscripcion",
  "atendido_por",
  "tipo_registro",
];

const FIELD_LABELS: Record<keyof SolicitudForm, string> = {
  nombre: "Nombre",
  primer_apellido: "Primer apellido",
  segundo_apellido: "Segundo apellido",
  nombre_usuario: "Nombre de usuario",
  correo: "Correo",
  telefono: "Teléfono",
  extension: "Extensión",
  celular: "Celular",
  perfil: "Perfil",
  estatus: "Estatus",
  ambito: "Ámbito",
  estado: "Estado",
  municipio: "Municipio",
  area_adscripcion: "Área adscripción",
  atendido_por: "Atendido por",
  observaciones: "Observaciones",
  tipo_registro: "Tipo de registro",
};

export default function SolicitudRegistrarPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState<SolicitudForm>(INITIAL_FORM);
  const [showConfirm, setShowConfirm] = useState(false);

  const formIsDirty = useMemo(() => {
    const anyValue = Object.values(form).some((value) => value.trim().length > 0);
    return anyValue || files.length > 0;
  }, [form, files]);

  function safeNavigateHome() {
    navigate("/app", { replace: false });
  }

  function onChange<K extends keyof SolicitudForm>(key: K, value: SolicitudForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const missing = REQUIRED_FIELDS.filter((key) => !form[key].trim());

    if (missing.length > 0) {
      const missingLabels = missing.map((key) => FIELD_LABELS[key]);
      setErrMsg(`Revisa campos requeridos: ${missingLabels.join(", ")}`);
      setOkMsg("");
      return false;
    }

    setErrMsg("");
    return true;
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowConfirm(false);
      }
    }

    document.addEventListener("keydown", onKey);

    if (showConfirm) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = previousOverflow;
      };
    }

    return () => document.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  function onCancelClick() {
    if (formIsDirty) {
      setShowConfirm(true);
      return;
    }

    safeNavigateHome();
  }

  function confirmLeave() {
    setShowConfirm(false);
    safeNavigateHome();
  }

  function onSaveDraftClick() {
    setOkMsg("Borrador guardado (preview).");
    setErrMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      setTriedSubmit(true);
      return;
    }

    setTriedSubmit(false);
    setSaving(true);
    setOkMsg("");
    setErrMsg("");

    setTimeout(() => {
      setSaving(false);
      setOkMsg("Solicitud (preview) validada. Lista para conectar a API.");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setForm(INITIAL_FORM);
      setFiles([]);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Solicitudes › Registrar"
        title="Registrar solicitud"
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-[1200px] px-6 pb-28">
        {okMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>{okMsg}</div>
          </div>
        )}

        {errMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>{errMsg}</div>
          </div>
        )}

        <CardSection title="Datos de la persona">
          <div className="grid grid-cols-12 gap-4">
            <TextField
              label="Nombre *"
              value={form.nombre}
              onChange={(v) => onChange("nombre", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Nombre"
            />

            <TextField
              label="Primer apellido *"
              value={form.primer_apellido}
              onChange={(v) => onChange("primer_apellido", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Primer apellido"
            />

            <TextField
              label="Segundo apellido *"
              value={form.segundo_apellido}
              onChange={(v) => onChange("segundo_apellido", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Segundo apellido"
            />

            <TextField
              label="Nombre de usuario *"
              value={form.nombre_usuario}
              onChange={(v) => onChange("nombre_usuario", v)}
              className="col-span-12 md:col-span-4"
              placeholder="nombre.apellido"
            />

            <TextField
              label="Correo *"
              type="email"
              value={form.correo}
              onChange={(v) => onChange("correo", v)}
              className="col-span-12 md:col-span-4"
              placeholder="correo@dominio"
              icon={<Mail className="h-4 w-4 text-slate-400" />}
            />

            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => onChange("telefono", v)}
              className="col-span-12 md:col-span-4"
              placeholder="+52 ___ ___ ____"
            />

            <TextField
              label="Extensión"
              value={form.extension}
              onChange={(v) => onChange("extension", v)}
              className="col-span-12 md:col-span-4"
              placeholder="EXT"
            />

            <TextField
              label="Celular"
              value={form.celular}
              onChange={(v) => onChange("celular", v)}
              className="col-span-12 md:col-span-4"
              placeholder="CELULAR"
            />

            <SelectField
              label="Perfil *"
              value={form.perfil}
              onChange={(v) => onChange("perfil", v)}
              options={PERFIL_SOL}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
              error={triedSubmit && !form.perfil}
            />
          </div>
        </CardSection>

        <CardSection title="Ubicación / Institución">
          <div className="grid grid-cols-12 gap-4">
            <SelectField
              label="Estatus *"
              value={form.estatus}
              onChange={(v) => onChange("estatus", v)}
              options={ESTATUS_SOL}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
              error={triedSubmit && !form.estatus}
            />

            <SelectField
              label="Ámbito *"
              value={form.ambito}
              onChange={(v) => onChange("ambito", v)}
              options={AMBITO_SOL}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
              error={triedSubmit && !form.ambito}
            />

            <SelectField
              label="Estado *"
              value={form.estado}
              onChange={(v) => onChange("estado", v)}
              options={ESTADOS_MX}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
              error={triedSubmit && !form.estado}
            />

            <SelectField
              label="Municipio"
              value={form.municipio}
              onChange={(v) => onChange("municipio", v)}
              options={MUNICIPIOS_SOL}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
            />

            <TextField
              label="Área adscripción *"
              value={form.area_adscripcion}
              onChange={(v) => onChange("area_adscripcion", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Nombre del área / adscripción"
            />

            <TextField
              label="Atendido por *"
              value={form.atendido_por}
              onChange={(v) => onChange("atendido_por", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Nombre de la persona que atiende"
            />
          </div>
        </CardSection>

        <CardSection title="Detalles de la solicitud">
          <div className="grid grid-cols-12 gap-4">
            <TextAreaField
              label="Observaciones"
              value={form.observaciones}
              onChange={(v) => onChange("observaciones", v)}
              className="col-span-12 md:col-span-8"
              placeholder="Observaciones…"
              maxLength={1500}
            />

            <SelectField
              label="Tipo de registro *"
              value={form.tipo_registro}
              onChange={(v) => onChange("tipo_registro", v)}
              options={TIPOS_REGISTRO}
              className="col-span-12 md:col-span-4"
              placeholder="Selecciona…"
              error={triedSubmit && !form.tipo_registro}
            />
          </div>
        </CardSection>

        <CardSection title="Archivos">
          <FileUploadField
            label="Adjuntos (.pdf, .docx, .xlsx, .csv, .jpg, .png)"
            files={files}
            onChange={setFiles}
            helperText="Hasta 10MB por archivo"
            buttonText="Elegir archivos"
          />
        </CardSection>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/90 shadow-[0_-4px_12px_rgba(2,6,23,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-3 px-6 py-3">
            <button
              type="button"
              onClick={onCancelClick}
              disabled={showConfirm}
              className="rounded-xl px-3 py-2 text-[14px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onSaveDraftClick}
              disabled={showConfirm}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Guardar borrador
            </button>

            <button
              type="submit"
              disabled={saving || showConfirm}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-[14px] text-white shadow-md transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showConfirm}
        title="¿Salir sin guardar?"
        message="Los cambios no guardados se perderán."
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmLeave}
        cancelText="Seguir editando"
        confirmText="Salir sin guardar"
        confirmVariant="danger"
      />

      <div className="mx-auto flex max-w-[1200px] items-start gap-2 px-6 py-8 text-sm text-slate-500">
        <Info className="mt-1 h-4 w-4" />
        <p>
          Vista previa del formulario. Al conectar API, este submit enviará JSON
          + archivos por multipart/form-data.
        </p>
      </div>
    </div>
  );
}