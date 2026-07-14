export type TipoRegistroSolicitud = "RMH" | "RMP" | "RDVF" | "RNOA";

export type EstatusSolicitud =
  | "Pendiente"
  | "En proceso"
  | "Cerrada"
  | "Cancelada";

export type SolicitudRow = {
  folio: string;
  fecha: string;
  nombre: string;
  tipo: string;
  estado: string;
  estatus: EstatusSolicitud;
  registro: TipoRegistroSolicitud;
};