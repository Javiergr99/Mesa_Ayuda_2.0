import type {
  ActualizarBitacoraForm,
  BitacoraDetail,
  RegistroAbbr,
  RegistroLabel,
} from "./actualizarBitacoraDrawer.types";

export const ESTADOS_MX = [
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
] as const;

export const ESTATUS_OPTIONS = [
  "Pendiente",
  "Seguimiento",
  "Finalizado",
] as const;

export const TIPO_CASO_OPTIONS = [
  "Alta usuario",
  "Baja usuario",
  "Actualización de datos",
  "Recuperación de cuentas",
  "Fallas en el sistema",
  "Eliminación de registros",
  "Orientación por aplicación",
  "Formato de solicitud",
] as const;

export const REGISTRO_OPTIONS = [
  "RMH",
  "RMP",
  "RDVF",
  "RNOA",
] as const;

export const ATENDIDO_POR_OPTIONS = [
  "Arturo Reyes Alcauter",
  "Brandon Joel Cabalceta Brenes",
  "Danton Bazaldua Morquecho",
  "Fabiola Azucena Gutierrez",
  "Gustavo Gonzalez Cabrera",
  "Javier Garcia Lucero",
  "Jocelyn Romero Carrillo",
  "Monica Gabriela De la Luz Eslava",
].sort((first, second) =>
  first.localeCompare(second, "es", {
    sensitivity: "base",
  }),
);

export const REGISTRO_LABEL_TO_CODE: Record<
  RegistroLabel,
  RegistroAbbr
> = {
  "Registro de Movilidad Humana": "RMH",
  "Registro de Medidas de Protección": "RMP",
  "Registro de Derecho a Vivir en Familia": "RDVF",
  "Registro Nacional de Obligaciones Alimentarias": "RNOA",
};

export const REGISTRO_CODE_TO_LABEL: Record<
  RegistroAbbr,
  RegistroLabel
> = {
  RMH: "Registro de Movilidad Humana",
  RMP: "Registro de Medidas de Protección",
  RDVF: "Registro de Derecho a Vivir en Familia",
  RNOA: "Registro Nacional de Obligaciones Alimentarias",
};

export const INITIAL_ACTUALIZAR_BITACORA_FORM: ActualizarBitacoraForm = {
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
  estatus: "",
  registro: "RMH",
};

export function createFormFromBitacora(
  bitacora: BitacoraDetail,
): ActualizarBitacoraForm {
  const registroLabel =
    bitacora.tipo_registro as RegistroLabel;

  return {
    nombre: bitacora.nombre || "",
    primer_apellido: bitacora.primer_apellido || "",
    segundo_apellido: bitacora.segundo_apellido || "",
    correo: bitacora.correo || "",
    telefono: bitacora.telefono || "",
    folio: bitacora.folio || "",
    estado: bitacora.estado || "",
    instancia: bitacora.instancia || "",
    fecha: bitacora.fecha || "",
    hora: (bitacora.hora || "").slice(0, 5),
    tipo: bitacora.tipo_caso || "",
    atendido_por: bitacora.atendido_por || "",
    observaciones: bitacora.observaciones || "",
    estatus:
      (bitacora.estatus as ActualizarBitacoraForm["estatus"]) ||
      "Pendiente",
    registro:
      REGISTRO_LABEL_TO_CODE[registroLabel] ?? "RMH",
  };
}

export function nullIfEmpty(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue || null;
}
