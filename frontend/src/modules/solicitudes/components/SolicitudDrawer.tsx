import { useEffect, useState } from "react";
import { X } from "lucide-react";

import CardSection from "../../../components/ui/CardSection";
import TextField from "../../../components/ui/TextField";
import TextAreaField from "../../../components/ui/TextAreaField";
import SelectField from "../../../components/ui/SelectField";
import FileUploadField from "../../../components/ui/FileUploadField";

import {
  AMBITO_SOL,
  ESTADOS_MX,
  ESTATUS_SOL,
  MUNICIPIOS_SOL,
  PERFIL_SOL,
  TIPOS_REGISTRO,
} from "../constants/solicitudes.constants";

import type {
  EstatusSolicitud,
  SolicitudRow,
  TipoRegistroSolicitud,
} from "../types/solicitudes.types";

type Props = {
  row: SolicitudRow | null;
  onClose: () => void;
  onSave: (updated: SolicitudRow) => void;
};

type SolicitudDrawerForm = {
  perfil: string;
  estatus: EstatusSolicitud;
  ambito: string;
  estado: string;
  municipio: string;
  tipoRegistro: TipoRegistroSolicitud;
  atendidoPor: string;
  areaAdscripcion: string;
  observaciones: string;
  anexos: File[];
};

function createInitialForm(): SolicitudDrawerForm {
  return {
    perfil: "",
    estatus: "Pendiente",
    ambito: "",
    estado: "",
    municipio: "",
    tipoRegistro: "RMH",
    atendidoPor: "",
    areaAdscripcion: "",
    observaciones: "",
    anexos: [],
  };
}

function createFormFromRow(row: SolicitudRow): SolicitudDrawerForm {
  return {
    perfil: "",
    estatus: row.estatus,
    ambito: "",
    estado: row.estado,
    municipio: "",
    tipoRegistro: row.registro,
    atendidoPor: "",
    areaAdscripcion: "",
    observaciones: "",
    anexos: [],
  };
}

export default function SolicitudDrawer({
  row,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<SolicitudDrawerForm>(
    createInitialForm,
  );

  useEffect(() => {
    if (row) {
      setForm(createFormFromRow(row));
    }
  }, [row]);

  if (!row) {
    return null;
  }

  const currentRow = row;
  const [nombre, ...resto] = currentRow.nombre.split(" ");
  const primerApellido = resto[0] || "";
  const segundoApellido = resto.slice(1).join(" ");

  function updateField<K extends keyof SolicitudDrawerForm>(
    key: K,
    value: SolicitudDrawerForm[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleSave() {
    const updatedRow: SolicitudRow = {
      ...currentRow,
      estado: form.estado,
      estatus: form.estatus,
      registro: form.tipoRegistro,
    };

    onSave(updatedRow);
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Cerrar actualización de solicitud"
        className="absolute inset-0 border-0 bg-slate-900/40 p-0"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[720px] animate-[fadeIn_100ms_ease-out] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <div className="text-[12px] text-slate-500">
              Solicitudes › Actualizar
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Actualizar Solicitud
            </h2>

            <p className="text-[12px] text-slate-500">
              Folio:{" "}
              <span className="font-medium">
                {currentRow.folio}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
          <CardSection title="Datos de la persona">
            <div className="grid grid-cols-12 gap-4">
              <TextField
                label="Nombre"
                value={nombre}
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                disabled
              />

              <TextField
                label="Primer apellido"
                value={primerApellido}
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                disabled
              />

              <TextField
                label="Segundo apellido"
                value={segundoApellido}
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                disabled
              />

              <TextField
                label="Folio"
                value={currentRow.folio}
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                disabled
              />

              <TextField
                label="Correo"
                value=""
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                placeholder="correo@dominio"
              />

              <TextField
                label="Teléfono"
                value=""
                onChange={() => {}}
                className="col-span-12 md:col-span-4"
                placeholder="+52 ___ ___ ____"
              />

              <SelectField
                label="Perfil"
                value={form.perfil}
                onChange={(value) =>
                  updateField("perfil", value)
                }
                options={PERFIL_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />
            </div>
          </CardSection>

          <CardSection title="Ubicación / Institución">
            <div className="grid grid-cols-12 gap-4">
              <SelectField
                label="Estatus"
                value={form.estatus}
                onChange={(value) =>
                  updateField(
                    "estatus",
                    value as EstatusSolicitud,
                  )
                }
                options={ESTATUS_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Ámbito"
                value={form.ambito}
                onChange={(value) =>
                  updateField("ambito", value)
                }
                options={AMBITO_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Estado"
                value={form.estado}
                onChange={(value) =>
                  updateField("estado", value)
                }
                options={ESTADOS_MX}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Municipio"
                value={form.municipio}
                onChange={(value) =>
                  updateField("municipio", value)
                }
                options={MUNICIPIOS_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <TextField
                label="Área adscripción"
                value={form.areaAdscripcion}
                onChange={(value) =>
                  updateField("areaAdscripcion", value)
                }
                className="col-span-12 md:col-span-4"
                placeholder="Nombre del área / adscripción"
              />

              <TextField
                label="Atendido por"
                value={form.atendidoPor}
                onChange={(value) =>
                  updateField("atendidoPor", value)
                }
                className="col-span-12 md:col-span-4"
                placeholder="Nombre de la persona que atiende"
              />
            </div>
          </CardSection>

          <CardSection title="Detalles de la solicitud">
            <div className="grid grid-cols-12 gap-4">
              <TextField
                label="Tipo de solicitud"
                value={currentRow.tipo}
                onChange={() => {}}
                className="col-span-12 md:col-span-6"
                disabled
              />

              <SelectField
                label="Tipo de registro"
                value={form.tipoRegistro}
                onChange={(value) =>
                  updateField(
                    "tipoRegistro",
                    value as TipoRegistroSolicitud,
                  )
                }
                options={TIPOS_REGISTRO}
                className="col-span-12 md:col-span-6"
                placeholder="Selecciona…"
              />

              <TextAreaField
                label="Observaciones"
                value={form.observaciones}
                onChange={(value) =>
                  updateField("observaciones", value)
                }
                className="col-span-12"
                placeholder="Notas u observaciones relevantes sobre la solicitud…"
              />
            </div>
          </CardSection>

          <CardSection title="Archivos">
            <FileUploadField
              label="Anexos (.pdf, .docx, .xlsx, .csv, .jpg, .png)"
              files={form.anexos}
              onChange={(files) =>
                updateField("anexos", files)
              }
              helperText=""
              buttonText="Elegir archivos"
            />
          </CardSection>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-5 py-2 text-[14px] font-medium text-white hover:bg-slate-800"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}