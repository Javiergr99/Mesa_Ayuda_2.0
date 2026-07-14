import {
  useEffect,
  useMemo,
  useReducer,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createBitacora } from "../../../services/bitacoras.service";
import {
  getEstados,
  getEstatusBitacora,
  getPersonasAtendio,
  getTiposCaso,
  getTiposRegistro,
} from "../../../services/catalogos.service";

import PageHeader from "../../../components/ui/PageHeader";
import CardSection from "../../../components/ui/CardSection";
import TextField from "../../../components/ui/TextField";
import TextAreaField from "../../../components/ui/TextAreaField";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import SelectField from "../../../components/ui/SelectField";
import ComboSelectField from "../../../components/ui/ComboSelectField";
import DateField from "../../../components/ui/DateField";
import TimeField from "../../../components/ui/TimeField";
import FileUploadField from "../../../components/ui/FileUploadField";

type BitacoraForm = {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo: string;
  telefono: string;
  estado: string;
  instancia: string;
  fecha: string;
  hora: string;
  tipo_caso: string;
  atendido_por: string;
  observaciones: string;
  estatus: string;
  tipo_registro: string;
};

type CatalogosState = {
  estados: string[];
  tiposCaso: string[];
  personasAtiende: string[];
  estatus: string[];
  tiposRegistro: string[];
};

type PageState = {
  form: BitacoraForm;
  catalogs: CatalogosState;
  saving: boolean;
  successMessage: string;
  errorMessage: string;
  triedSubmit: boolean;
  files: File[];
  emailFile: File | null;
  showConfirm: boolean;
};

type PageAction =
  | {
      type: "catalogsLoaded";
      payload: CatalogosState;
    }
  | {
      type: "catalogsFailed";
      message: string;
    }
  | {
      type: "fieldChanged";
      key: keyof BitacoraForm;
      value: string;
    }
  | {
      type: "filesChanged";
      files: File[];
    }
  | {
      type: "emailFileChanged";
      file: File | null;
    }
  | {
      type: "confirmChanged";
      open: boolean;
    }
  | {
      type: "validationFailed";
      message: string;
    }
  | {
      type: "submitStarted";
    }
  | {
      type: "submitSucceeded";
      message: string;
    }
  | {
      type: "submitFailed";
      message: string;
    }
  | {
      type: "draftSaved";
    };

type ChangeField = <K extends keyof BitacoraForm>(
  key: K,
  value: BitacoraForm[K],
) => void;

const INITIAL_FORM: BitacoraForm = {
  nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  correo: "",
  telefono: "",
  estado: "",
  instancia: "",
  fecha: "",
  hora: "",
  tipo_caso: "",
  atendido_por: "",
  observaciones: "",
  estatus: "",
  tipo_registro: "",
};

const EMPTY_CATALOGS: CatalogosState = {
  estados: [],
  tiposCaso: [],
  personasAtiende: [],
  estatus: [],
  tiposRegistro: [],
};

const INITIAL_STATE: PageState = {
  form: INITIAL_FORM,
  catalogs: EMPTY_CATALOGS,
  saving: false,
  successMessage: "",
  errorMessage: "",
  triedSubmit: false,
  files: [],
  emailFile: null,
  showConfirm: false,
};

const REQUIRED_FIELDS: readonly (keyof BitacoraForm)[] = [
  "nombre",
  "estado",
  "fecha",
  "hora",
  "tipo_caso",
  "atendido_por",
  "estatus",
  "tipo_registro",
];

const REQUIRED_FIELD_LABELS: Partial<
  Record<keyof BitacoraForm, string>
> = {
  nombre: "Nombre",
  estado: "Estado",
  fecha: "Fecha",
  hora: "Hora",
  tipo_caso: "Tipo de caso",
  atendido_por: "Atendido por",
  estatus: "Estatus",
  tipo_registro: "Tipo de registro",
};

function pageReducer(
  state: PageState,
  action: PageAction,
): PageState {
  switch (action.type) {
    case "catalogsLoaded":
      return {
        ...state,
        catalogs: action.payload,
        errorMessage: "",
      };

    case "catalogsFailed":
      return {
        ...state,
        errorMessage: action.message,
      };

    case "fieldChanged":
      return {
        ...state,
        form: {
          ...state.form,
          [action.key]: action.value,
        },
      };

    case "filesChanged":
      return {
        ...state,
        files: action.files,
      };

    case "emailFileChanged":
      return {
        ...state,
        emailFile: action.file,
      };

    case "confirmChanged":
      return {
        ...state,
        showConfirm: action.open,
      };

    case "validationFailed":
      return {
        ...state,
        triedSubmit: true,
        errorMessage: action.message,
        successMessage: "",
      };

    case "submitStarted":
      return {
        ...state,
        saving: true,
        triedSubmit: false,
        successMessage: "",
        errorMessage: "",
      };

    case "submitSucceeded":
      return {
        ...state,
        form: INITIAL_FORM,
        saving: false,
        successMessage: action.message,
        errorMessage: "",
        triedSubmit: false,
        files: [],
        emailFile: null,
      };

    case "submitFailed":
      return {
        ...state,
        saving: false,
        successMessage: "",
        errorMessage: action.message,
      };

    case "draftSaved":
      return {
        ...state,
        successMessage: "Borrador guardado (preview).",
        errorMessage: "",
      };

    default:
      return state;
  }
}

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
  onChange,
}: {
  form: BitacoraForm;
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
        />

        <TextField
          label="Primer apellido"
          value={form.primer_apellido}
          onChange={(value) =>
            onChange("primer_apellido", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Primer apellido"
        />

        <TextField
          label="Segundo apellido"
          value={form.segundo_apellido}
          onChange={(value) =>
            onChange("segundo_apellido", value)
          }
          className="col-span-12 md:col-span-4"
          placeholder="Segundo apellido"
        />

        <TextField
          label="Correo"
          type="email"
          value={form.correo}
          onChange={(value) => onChange("correo", value)}
          className="col-span-12 md:col-span-6"
          placeholder="correo@dominio"
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
          onChange={(value) => onChange("telefono", value)}
          className="col-span-12 md:col-span-6"
          placeholder="+52 ___ ___ ____"
        />
      </div>
    </CardSection>
  );
}

function LocationSection({
  form,
  estados,
  triedSubmit,
  onChange,
}: {
  form: BitacoraForm;
  estados: readonly string[];
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Ubicación / Institución">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Estado *"
          value={form.estado}
          onChange={(value) => onChange("estado", value)}
          options={estados}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
          error={triedSubmit && !form.estado}
        />

        <TextField
          label="Instancia"
          value={form.instancia}
          onChange={(value) => onChange("instancia", value)}
          className="col-span-12 md:col-span-6"
          placeholder="Dependencia / área"
        />
      </div>
    </CardSection>
  );
}

function CaseDetailsSection({
  form,
  tiposCaso,
  atendidoPorOptions,
  triedSubmit,
  onChange,
}: {
  form: BitacoraForm;
  tiposCaso: readonly string[];
  atendidoPorOptions: readonly string[];
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Detalles del caso">
      <div className="grid grid-cols-12 gap-4">
        <DateField
          label="Fecha *"
          value={form.fecha}
          onChange={(value) => onChange("fecha", value)}
          className="col-span-12 md:col-span-3"
          placeholder="dd/mm/aaaa"
          error={triedSubmit && !form.fecha}
        />

        <TimeField
          label="Hora *"
          value={form.hora}
          onChange={(value) => onChange("hora", value)}
          className="col-span-12 md:col-span-3"
          placeholder="hh:mm"
          error={triedSubmit && !form.hora}
        />

        <SelectField
          label="Tipo de caso *"
          value={form.tipo_caso}
          onChange={(value) => onChange("tipo_caso", value)}
          options={tiposCaso}
          className="col-span-12 md:col-span-3"
          placeholder="Selecciona…"
          error={triedSubmit && !form.tipo_caso}
        />

        <ComboSelectField
          label="Atendido por *"
          value={form.atendido_por}
          onChange={(value) =>
            onChange("atendido_por", value)
          }
          options={atendidoPorOptions}
          className="col-span-12 md:col-span-3"
          placeholder="Busca o selecciona…"
          error={triedSubmit && !form.atendido_por}
        />

        <TextAreaField
          label="Observaciones"
          value={form.observaciones}
          onChange={(value) =>
            onChange("observaciones", value)
          }
          className="col-span-12"
          placeholder="Notas de la atención…"
          maxLength={1500}
        />
      </div>
    </CardSection>
  );
}

function MetadataSection({
  form,
  estatusOptions,
  tiposRegistro,
  triedSubmit,
  onChange,
}: {
  form: BitacoraForm;
  estatusOptions: readonly string[];
  tiposRegistro: readonly string[];
  triedSubmit: boolean;
  onChange: ChangeField;
}) {
  return (
    <CardSection title="Metadatos">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Estatus *"
          value={form.estatus}
          onChange={(value) => onChange("estatus", value)}
          options={estatusOptions}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
          error={triedSubmit && !form.estatus}
        />

        <SelectField
          label="Tipo de registro *"
          value={form.tipo_registro}
          onChange={(value) =>
            onChange("tipo_registro", value)
          }
          options={tiposRegistro}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
          error={triedSubmit && !form.tipo_registro}
        />
      </div>
    </CardSection>
  );
}

function FilesSection({
  files,
  emailFile,
  onFilesChange,
  onEmailFileChange,
}: {
  files: File[];
  emailFile: File | null;
  onFilesChange: (files: File[]) => void;
  onEmailFileChange: (file: File | null) => void;
}) {
  return (
    <CardSection title="Archivos">
      <div className="grid grid-cols-12 gap-4">
        <FileUploadField
          label="Anexos (.pdf, .docx, .xlsx, .csv, .jpg, .png)"
          files={files}
          onChange={onFilesChange}
          className="col-span-12"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
          helperText="Hasta 10MB por archivo"
          buttonText="Elegir archivos"
        />

        <FileUploadField
          label="Correo (.MSG)"
          files={emailFile ? [emailFile] : []}
          onChange={(selectedFiles) =>
            onEmailFileChange(
              selectedFiles[selectedFiles.length - 1] ?? null,
            )
          }
          className="col-span-12"
          accept=".msg"
          multiple={false}
          helperText="Máximo 15MB"
          buttonText="Subir .MSG"
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

function useBitacoraRegistration() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    pageReducer,
    INITIAL_STATE,
  );

  const atendidoPorOptions = useMemo(
    () =>
      [...state.catalogs.personasAtiende].sort((a, b) =>
        a.localeCompare(b, "es", {
          sensitivity: "base",
        }),
      ),
    [state.catalogs.personasAtiende],
  );

  const formIsDirty = useMemo(() => {
    const hasValue = Object.values(state.form).some(
      (value) => value.trim().length > 0,
    );

    return (
      hasValue ||
      state.files.length > 0 ||
      Boolean(state.emailFile)
    );
  }, [state.form, state.files, state.emailFile]);

  useEffect(() => {
    let active = true;

    async function loadCatalogs() {
      try {
        const [
          estadosResponse,
          tiposCasoResponse,
          personasResponse,
          estatusResponse,
          tiposRegistroResponse,
        ] = await Promise.all([
          getEstados(),
          getTiposCaso(),
          getPersonasAtendio(),
          getEstatusBitacora(),
          getTiposRegistro(),
        ]);

        if (!active) {
          return;
        }

        dispatch({
          type: "catalogsLoaded",
          payload: {
            estados: estadosResponse.map(
              (item: any) => item.nombre,
            ),
            tiposCaso: tiposCasoResponse.map(
              (item: any) => item.nombre,
            ),
            personasAtiende: personasResponse.map(
              (item: any) =>
                item.nombre_completo ?? item.nombre,
            ),
            estatus: estatusResponse.map(
              (item: any) => item.nombre,
            ),
            tiposRegistro: tiposRegistroResponse.map(
              (item: any) => item.nombre,
            ),
          },
        });
      } catch (loadError) {
        console.error(
          "Error cargando catálogos",
          loadError,
        );

        if (active) {
          dispatch({
            type: "catalogsFailed",
            message:
              "No se pudieron cargar los catálogos. Intenta de nuevo.",
          });
        }
      }
    }

    void loadCatalogs();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.showConfirm) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [state.showConfirm]);

  function navigateHome() {
    navigate("/app", { replace: false });
  }

  function changeField<K extends keyof BitacoraForm>(
    key: K,
    value: BitacoraForm[K],
  ) {
    dispatch({
      type: "fieldChanged",
      key,
      value,
    });
  }

  function handleCancel() {
    if (formIsDirty) {
      dispatch({
        type: "confirmChanged",
        open: true,
      });
      return;
    }

    navigateHome();
  }

  function closeConfirm() {
    dispatch({
      type: "confirmChanged",
      open: false,
    });
  }

  function handleConfirmLeave() {
    closeConfirm();
    navigateHome();
  }

  function handleSaveDraft() {
    dispatch({ type: "draftSaved" });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const missingFields = REQUIRED_FIELDS.filter(
      (key) => !state.form[key]?.trim(),
    );

    if (missingFields.length > 0) {
      const labels = missingFields.map(
        (key) => REQUIRED_FIELD_LABELS[key] ?? key,
      );

      dispatch({
        type: "validationFailed",
        message: `Revisa campos requeridos: ${labels.join(", ")}`,
      });
      return;
    }

    dispatch({ type: "submitStarted" });

    try {
      const payload = {
        nombre: state.form.nombre.trim(),
        primer_apellido:
          state.form.primer_apellido.trim() || null,
        segundo_apellido:
          state.form.segundo_apellido.trim() || null,
        correo: state.form.correo.trim() || null,
        telefono: state.form.telefono.trim() || null,
        estado: state.form.estado,
        instancia: state.form.instancia.trim() || null,
        fecha: state.form.fecha,
        hora: state.form.hora,
        tipo_caso: state.form.tipo_caso,
        atendido_por: state.form.atendido_por,
        observaciones:
          state.form.observaciones.trim() || null,
        estatus: state.form.estatus,
        tipo_registro: state.form.tipo_registro,
      };

      const response = await createBitacora(payload);

      dispatch({
        type: "submitSucceeded",
        message: `Bitácora registrada correctamente. Folio: ${response.folio}`,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError: any) {
      console.error(submitError);

      dispatch({
        type: "submitFailed",
        message:
          submitError?.response?.data?.detail ||
          submitError?.message ||
          "Ocurrió un error al guardar la bitácora.",
      });
    }
  }

  return {
    state,
    atendidoPorOptions,
    changeField,
    handleCancel,
    closeConfirm,
    handleConfirmLeave,
    handleSaveDraft,
    handleSubmit,
    dispatch,
  };
}

export default function BitacoraRegistrarPage() {
  const {
    state,
    atendidoPorOptions,
    changeField,
    handleCancel,
    closeConfirm,
    handleConfirmLeave,
    handleSaveDraft,
    handleSubmit,
    dispatch,
  } = useBitacoraRegistration();

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Bitácora › Registrar"
        title="Registrar atención"
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1200px] px-6 pb-28"
      >
        <FeedbackMessages
          successMessage={state.successMessage}
          errorMessage={state.errorMessage}
        />

        <PersonSection
          form={state.form}
          onChange={changeField}
        />

        <LocationSection
          form={state.form}
          estados={state.catalogs.estados}
          triedSubmit={state.triedSubmit}
          onChange={changeField}
        />

        <CaseDetailsSection
          form={state.form}
          tiposCaso={state.catalogs.tiposCaso}
          atendidoPorOptions={atendidoPorOptions}
          triedSubmit={state.triedSubmit}
          onChange={changeField}
        />

        <MetadataSection
          form={state.form}
          estatusOptions={state.catalogs.estatus}
          tiposRegistro={state.catalogs.tiposRegistro}
          triedSubmit={state.triedSubmit}
          onChange={changeField}
        />

        <FilesSection
          files={state.files}
          emailFile={state.emailFile}
          onFilesChange={(files) =>
            dispatch({
              type: "filesChanged",
              files,
            })
          }
          onEmailFileChange={(file) =>
            dispatch({
              type: "emailFileChanged",
              file,
            })
          }
        />

        <StickyActions
          saving={state.saving}
          showConfirm={state.showConfirm}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
        />
      </form>

      <ConfirmDialog
        open={state.showConfirm}
        title="¿Salir sin guardar?"
        message="Los cambios no guardados se perderán."
        onCancel={closeConfirm}
        onConfirm={handleConfirmLeave}
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
          Este formulario envía la información de la
          bitácora al backend de Mesa de Ayuda 2.0 y utiliza
          catálogos desde la base de datos.
        </p>
      </div>
    </div>
  );
}