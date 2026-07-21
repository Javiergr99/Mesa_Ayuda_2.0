import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Mail,
} from "lucide-react";
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

type ChangeField = <K extends keyof SolicitudForm>(
  key: K,
  value: SolicitudForm[K],
) => void;

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

const REQUIRED_FIELDS: readonly (keyof SolicitudForm)[] = [
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

const FIELD_LABELS: Record<
  keyof SolicitudForm,
  string
> = {
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

function FeedbackMessages({
  successMessage,
  errorMessage,
}: {
  successMessage: string;
  errorMessage: string;
}) {
  return (
    <>
      {successMessage && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5"
          />
          <div>{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 h-5 w-5"
          />
          <div>{errorMessage}</div>
        </div>
      )}
    </>
  );
}

function PersonSection({
  form,
  triedSubmit,
  onChange,
}: {
  form: SolicitudForm;
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Datos de la persona">
      <div className="grid grid-cols-12 gap-4">
        <TextField
          label="Nombre *"
          value={form.nombre}
          onChange={(value) => onChange("nombre", value)}
          className="col-span-12 md:col-span-4"
          placeholder="Nombre"
          error={triedSubmit && !form.nombre}
        />

        <TextField
          label="Primer apellido *"
          value={form.primer_apellido}
          onChange={(value) =>
            onChange("primer_apellido", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Primer apellido"
          error={
            triedSubmit && !form.primer_apellido
          }
        />

        <TextField
          label="Segundo apellido *"
          value={form.segundo_apellido}
          onChange={(value) =>
            onChange("segundo_apellido", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Segundo apellido"
          error={
            triedSubmit && !form.segundo_apellido
          }
        />

        <TextField
          label="Nombre de usuario *"
          value={form.nombre_usuario}
          onChange={(value) =>
            onChange("nombre_usuario", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="nombre.apellido"
          error={
            triedSubmit && !form.nombre_usuario
          }
        />

        <TextField
          label="Correo *"
          type="email"
          value={form.correo}
          onChange={(value) => onChange("correo", value)}
          className="col-span-12 md:col-span-4"
          placeholder="correo@dominio"
          error={triedSubmit && !form.correo}
          icon={
            <Mail
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
            />
          }
        />

        <TextField
          label="Teléfono"
          value={form.telefono}
          onChange={(value) =>
            onChange("telefono", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="+52 ___ ___ ____"
        />

        <TextField
          label="Extensión"
          value={form.extension}
          onChange={(value) =>
            onChange("extension", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="EXT"
        />

        <TextField
          label="Celular"
          value={form.celular}
          onChange={(value) => onChange("celular", value)}
          className="col-span-12 md:col-span-4"
          placeholder="CELULAR"
        />

        <SelectField
          label="Perfil *"
          value={form.perfil}
          onChange={(value) => onChange("perfil", value)}
          options={PERFIL_SOL}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
          error={triedSubmit && !form.perfil}
        />
      </div>
    </CardSection>
  );
}

function LocationSection({
  form,
  triedSubmit,
  onChange,
}: {
  form: SolicitudForm;
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Ubicación / Institución">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Estatus *"
          value={form.estatus}
          onChange={(value) => onChange("estatus", value)}
          options={ESTATUS_SOL}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
          error={triedSubmit && !form.estatus}
        />

        <SelectField
          label="Ámbito *"
          value={form.ambito}
          onChange={(value) => onChange("ambito", value)}
          options={AMBITO_SOL}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
          error={triedSubmit && !form.ambito}
        />

        <SelectField
          label="Estado *"
          value={form.estado}
          onChange={(value) => onChange("estado", value)}
          options={ESTADOS_MX}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
          error={triedSubmit && !form.estado}
        />

        <SelectField
          label="Municipio"
          value={form.municipio}
          onChange={(value) =>
            onChange("municipio", value)
          }
          options={MUNICIPIOS_SOL}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
        />

        <TextField
          label="Área adscripción *"
          value={form.area_adscripcion}
          onChange={(value) =>
            onChange("area_adscripcion", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Nombre del área / adscripción"
          error={
            triedSubmit && !form.area_adscripcion
          }
        />

        <TextField
          label="Atendido por *"
          value={form.atendido_por}
          onChange={(value) =>
            onChange("atendido_por", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Nombre de la persona que atiende"
          error={triedSubmit && !form.atendido_por}
        />
      </div>
    </CardSection>
  );
}

function DetailsSection({
  form,
  triedSubmit,
  onChange,
}: {
  form: SolicitudForm;
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Detalles de la solicitud">
      <div className="grid grid-cols-12 gap-4">
        <TextAreaField
          label="Observaciones"
          value={form.observaciones}
          onChange={(value) =>
            onChange("observaciones", value)
          }
          className="col-span-12 md:col-span-8"
          placeholder="Observaciones…"
          maxLength={1500}
        />

        <SelectField
          label="Tipo de registro *"
          value={form.tipo_registro}
          onChange={(value) =>
            onChange("tipo_registro", value)
          }
          options={TIPOS_REGISTRO}
          className="col-span-12 md:col-span-4"
          placeholder="Selecciona…"
          error={
            triedSubmit && !form.tipo_registro
          }
        />
      </div>
    </CardSection>
  );
}

function StickyActions({
  saving,
  showConfirm,
  onCancel,
  onSaveDraft,
}: {
  saving: boolean;
  showConfirm: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/90 shadow-[0_-4px_12px_rgba(2,6,23,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-3 px-6 py-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={showConfirm}
          className="rounded-xl px-3 py-2 text-[14px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
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
  );
}

export default function SolicitudRegistrarPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState<SolicitudForm>(
    INITIAL_FORM,
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const formIsDirty = useMemo(() => {
    const hasValue = Object.values(form).some(
      (value) => value.trim().length > 0,
    );

    return hasValue || files.length > 0;
  }, [form, files]);

  useEffect(() => {
    if (!showConfirm) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showConfirm]);

  function navigateHome() {
    navigate("/app", { replace: false });
  }

  function changeField<K extends keyof SolicitudForm>(
    key: K,
    value: SolicitudForm[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleCancel() {
    if (formIsDirty) {
      setShowConfirm(true);
      return;
    }

    navigateHome();
  }

  function confirmLeave() {
    setShowConfirm(false);
    navigateHome();
  }

  function saveDraft() {
    setSuccessMessage("Borrador guardado (preview).");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const missingFields = REQUIRED_FIELDS.filter(
      (key) => !form[key].trim(),
    );

    if (missingFields.length > 0) {
      setTriedSubmit(true);
      setErrorMessage(
        `Revisa campos requeridos: ${missingFields
          .map((key) => FIELD_LABELS[key])
          .join(", ")}`,
      );
      setSuccessMessage("");
      return;
    }

    setTriedSubmit(false);
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    window.setTimeout(() => {
      setSaving(false);
      setSuccessMessage(
        "Solicitud (preview) validada. Lista para conectar a API.",
      );
      setForm(INITIAL_FORM);
      setFiles([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 700);
  }

  return (
    <div className="min-h-dvh bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Solicitudes › Registrar"
        title="Registrar solicitud"
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1200px] px-6 pb-28"
      >
        <FeedbackMessages
          successMessage={successMessage}
          errorMessage={errorMessage}
        />

        <PersonSection
          form={form}
          triedSubmit={triedSubmit}
          onChange={changeField}
        />

        <LocationSection
          form={form}
          triedSubmit={triedSubmit}
          onChange={changeField}
        />

        <DetailsSection
          form={form}
          triedSubmit={triedSubmit}
          onChange={changeField}
        />

        <CardSection title="Archivos">
          <FileUploadField
            label="Adjuntos (.pdf, .docx, .xlsx, .csv, .jpg, .png)"
            files={files}
            onChange={setFiles}
            helperText="Hasta 10MB por archivo"
            buttonText="Elegir archivos"
          />
        </CardSection>

        <StickyActions
          saving={saving}
          showConfirm={showConfirm}
          onCancel={handleCancel}
          onSaveDraft={saveDraft}
        />
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
        <Info
          aria-hidden="true"
          className="mt-1 h-4 w-4"
        />
        <p>
          Vista previa del formulario. Al conectar la API,
          este envío utilizará JSON y archivos mediante
          multipart/form-data.
        </p>
      </div>
    </div>
  );
}
