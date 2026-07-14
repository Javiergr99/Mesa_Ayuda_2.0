export type EstatusBitacora = "Pendiente" | "Seguimiento" | "Finalizado";

export type RegistroAbbr = "RMH" | "RMP" | "RDVF" | "RNOA";

export type RegistroLabel =
  | "Registro de Movilidad Humana"
  | "Registro de Medidas de Protección"
  | "Registro de Derecho a Vivir en Familia"
  | "Registro Nacional de Obligaciones Alimentarias";

export type BitacoraRow = {
  id: number;
  folio: string;
  fecha: string;
  registro: RegistroAbbr;
  estado: string;
  tipo: string;
  estatus: EstatusBitacora;
  atendido_por: string;
  nombre: string;
};

export type BitacoraDetail = {
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
  estatus: EstatusBitacora | string;
  tipo_registro: string;
  created_at: string;
  updated_at: string | null;
  usuario_id: number;
};

export type ArchivoBitacoraItem = {
  id: number;
  original_name: string;
  stored_name: string;
  content_type: string | null;
  size_bytes: number;
  created_at: string;
};