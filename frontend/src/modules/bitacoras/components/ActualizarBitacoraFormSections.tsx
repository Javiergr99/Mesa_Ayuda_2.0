import CardSection from "../../../components/ui/CardSection";
import ComboSelectField from "../../../components/ui/ComboSelectField";
import DateField from "../../../components/ui/DateField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import TextField from "../../../components/ui/TextField";
import TimeField from "../../../components/ui/TimeField";

import {
  ATENDIDO_POR_OPTIONS,
  ESTADOS_MX,
  ESTATUS_OPTIONS,
  REGISTRO_OPTIONS,
  TIPO_CASO_OPTIONS,
} from "./actualizarBitacoraDrawer.constants";

import type {
  ActualizarBitacoraForm,
  ChangeBitacoraField,
  EstatusBitacora,
} from "./actualizarBitacoraDrawer.types";

type SectionProps = {
  form: ActualizarBitacoraForm;
  onChange: ChangeBitacoraField;
};

function PersonSection({
  form,
  onChange,
}: SectionProps) {
  return (
    <CardSection title="Datos de la persona">
      <div className="grid grid-cols-12 gap-4">
        <TextField
          label="Nombre"
          value={form.nombre}
          onChange={(value) => onChange("nombre", value)}
          className="col-span-12 md:col-span-4"
        />

        <TextField
          label="Primer apellido"
          value={form.primer_apellido}
          onChange={(value) =>
            onChange("primer_apellido", value)
          }
          className="col-span-12 md:col-span-4"
        />

        <TextField
          label="Segundo apellido"
          value={form.segundo_apellido}
          onChange={(value) =>
            onChange("segundo_apellido", value)
          }
          className="col-span-12 md:col-span-4"
        />

        <TextField
          label="Correo"
          value={form.correo}
          onChange={(value) => onChange("correo", value)}
          className="col-span-12 md:col-span-6"
        />

        <TextField
          label="Teléfono"
          value={form.telefono}
          onChange={(value) => onChange("telefono", value)}
          className="col-span-12 md:col-span-3"
        />

        <TextField
          label="Folio"
          value={form.folio}
          onChange={(value) => onChange("folio", value)}
          className="col-span-12 md:col-span-3"
          disabled
        />
      </div>
    </CardSection>
  );
}

function LocationSection({
  form,
  onChange,
}: SectionProps) {
  return (
    <CardSection title="Ubicación / Institución">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Estado"
          value={form.estado}
          onChange={(value) => onChange("estado", value)}
          options={ESTADOS_MX}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
        />

        <TextField
          label="Instancia"
          value={form.instancia}
          onChange={(value) =>
            onChange("instancia", value)
          }
          className="col-span-12 md:col-span-6"
          placeholder="Nombre de la institución / área"
        />
      </div>
    </CardSection>
  );
}

function CaseDetailsSection({
  form,
  onChange,
}: SectionProps) {
  return (
    <CardSection title="Detalles del caso">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Tipo de caso"
          value={form.tipo}
          onChange={(value) => onChange("tipo", value)}
          options={TIPO_CASO_OPTIONS}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
        />

        <ComboSelectField
          label="Atendido por"
          value={form.atendido_por}
          onChange={(value) =>
            onChange("atendido_por", value)
          }
          options={ATENDIDO_POR_OPTIONS}
          className="col-span-12 md:col-span-6"
          placeholder="Busca o selecciona…"
        />

        <DateField
          label="Fecha"
          value={form.fecha}
          onChange={(value) => onChange("fecha", value)}
          className="col-span-12 md:col-span-6"
          placeholder="dd/mm/aaaa"
        />

        <TimeField
          label="Hora"
          value={form.hora}
          onChange={(value) => onChange("hora", value)}
          className="col-span-12 md:col-span-6"
          placeholder="hh:mm"
        />

        <TextAreaField
          label="Observaciones"
          value={form.observaciones}
          onChange={(value) =>
            onChange("observaciones", value)
          }
          className="col-span-12"
          placeholder="Notas y observaciones relevantes del caso…"
        />
      </div>
    </CardSection>
  );
}

function MetadataSection({
  form,
  onChange,
}: SectionProps) {
  return (
    <CardSection title="Metadatos">
      <div className="grid grid-cols-12 gap-4">
        <SelectField
          label="Estatus"
          value={form.estatus}
          onChange={(value) =>
            onChange(
              "estatus",
              value as EstatusBitacora,
            )
          }
          options={ESTATUS_OPTIONS}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
        />

        <SelectField
          label="Tipo de registro"
          value={form.registro}
          onChange={() => {}}
          options={REGISTRO_OPTIONS}
          className="col-span-12 md:col-span-6"
          placeholder="Selecciona…"
          disabled
        />
      </div>
    </CardSection>
  );
}

export default function ActualizarBitacoraFormSections(
  props: SectionProps,
) {
  return (
    <>
      <PersonSection {...props} />
      <LocationSection {...props} />
      <CaseDetailsSection {...props} />
      <MetadataSection {...props} />
    </>
  );
}
