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

export default function SolicitudDrawer({ row, onClose, onSave }: Props) {
  const [perfil, setPerfil] = useState("");
  const [estatus, setEstatus] = useState<EstatusSolicitud>("Pendiente");
  const [ambito, setAmbito] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [tipoRegistro, setTipoRegistro] =
    useState<TipoRegistroSolicitud>("RMH");
  const [atendidoPor, setAtendidoPor] = useState("");
  const [areaAdscripcion, setAreaAdscripcion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);

  useEffect(() => {
    if (!row) return;

    setEstado(row.estado);
    setEstatus(row.estatus);
    setTipoRegistro(row.registro);
    setObservaciones("");
    setPerfil("");
    setAmbito("");
    setMunicipio("");
    setAtendidoPor("");
    setAreaAdscripcion("");
    setAnexos([]);
  }, [row]);

  if (!row) return null;

  const currentRow: SolicitudRow = row;

  const [nombre, ...resto] = currentRow.nombre.split(" ");
  const primerApellido = resto[0] || "";
  const segundoApellido = resto.slice(1).join(" ");

  function handleSave() {
    const updatedRow: SolicitudRow = {
      ...currentRow,
      estado,
      estatus,
      registro: tipoRegistro,
    };

    onSave(updatedRow);
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

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
              Folio: <span className="font-medium">{currentRow.folio}</span>
            </p>
          </div>

          <button
            className="rounded-lg p-2 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            <X className="h-5 w-5" />
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
                value={perfil}
                onChange={setPerfil}
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
                value={estatus}
                onChange={(v) => setEstatus(v as EstatusSolicitud)}
                options={ESTATUS_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Ámbito"
                value={ambito}
                onChange={setAmbito}
                options={AMBITO_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Estado"
                value={estado}
                onChange={setEstado}
                options={ESTADOS_MX}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <SelectField
                label="Municipio"
                value={municipio}
                onChange={setMunicipio}
                options={MUNICIPIOS_SOL}
                className="col-span-12 md:col-span-4"
                placeholder="Selecciona…"
              />

              <TextField
                label="Área adscripción"
                value={areaAdscripcion}
                onChange={setAreaAdscripcion}
                className="col-span-12 md:col-span-4"
                placeholder="Nombre del área / adscripción"
              />

              <TextField
                label="Atendido por"
                value={atendidoPor}
                onChange={setAtendidoPor}
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
                value={tipoRegistro}
                onChange={(v) => setTipoRegistro(v as TipoRegistroSolicitud)}
                options={TIPOS_REGISTRO}
                className="col-span-12 md:col-span-6"
                placeholder="Selecciona…"
              />

              <TextAreaField
                label="Observaciones"
                value={observaciones}
                onChange={setObservaciones}
                className="col-span-12"
                placeholder="Notas u observaciones relevantes sobre la solicitud…"
              />
            </div>
          </CardSection>

          <CardSection title="Archivos">
            <FileUploadField
              label="Anexos (.pdf, .docx, .xlsx, .csv, .jpg, .png)"
              files={anexos}
              onChange={setAnexos}
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

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}