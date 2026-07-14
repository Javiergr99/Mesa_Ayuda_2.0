import type {
  EstatusSolicitud,
  SolicitudRow,
  TipoRegistroSolicitud,
} from "../types/solicitudes.types";

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
];

export const ESTATUS_SOL = [
  "Pendiente",
  "En proceso",
  "Cerrada",
  "Cancelada",
] as const satisfies readonly EstatusSolicitud[];

export const TIPOS_SOL = [
  "Alta de usuario",
  "Baja de usuario",
  "Cambio de rol / permisos",
  "Acceso a plataforma",
  "Soporte técnico",
  "Actualización de datos",
] as const;

export const TIPOS_REGISTRO = [
  "RMH",
  "RMP",
  "RDVF",
  "RNOA",
] as const satisfies readonly TipoRegistroSolicitud[];

export const PERFIL_SOL = [
  "Administrador",
  "Coordinador",
  "Operador / Capturista",
  "Consulta",
];

export const AMBITO_SOL = ["Federal", "Estatal", "Municipal", "Otro"];

export const MUNICIPIOS_SOL = [
  "Ahome",
  "Centro",
  "Culiacán",
  "Ecatepec",
  "Guadalajara",
  "Mérida",
  "Monterrey",
  "Puebla",
  "Querétaro",
  "Tijuana",
];

export const MOCK_SOLICITUDES: SolicitudRow[] = [
  {
    folio: "S-000210",
    fecha: "2025-11-05",
    nombre: "María López",
    estado: "Puebla",
    tipo: "Alta de usuario",
    registro: "RMH",
    estatus: "Pendiente",
  },
  {
    folio: "S-000211",
    fecha: "2025-11-05",
    nombre: "Juan Hernández",
    estado: "Ciudad de México",
    tipo: "Soporte técnico",
    registro: "RMP",
    estatus: "En proceso",
  },
  {
    folio: "S-000212",
    fecha: "2025-11-06",
    nombre: "Ana Ruiz",
    estado: "Querétaro",
    tipo: "Cambio de rol / permisos",
    registro: "RDVF",
    estatus: "Cerrada",
  },
  {
    folio: "S-000213",
    fecha: "2025-11-06",
    nombre: "Pedro Sánchez",
    estado: "Chihuahua",
    tipo: "Acceso a plataforma",
    registro: "RNOA",
    estatus: "En proceso",
  },
  {
    folio: "S-000214",
    fecha: "2025-11-07",
    nombre: "Luisa Romero",
    estado: "Nuevo León",
    tipo: "Baja de usuario",
    registro: "RMH",
    estatus: "Cancelada",
  },
];