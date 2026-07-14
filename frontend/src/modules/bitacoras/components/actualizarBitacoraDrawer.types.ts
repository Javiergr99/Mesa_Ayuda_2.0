export type EstatusBitacora =
  | "Pendiente"
  | "Seguimiento"
  | "Finalizado";

export type RegistroAbbr = "RMH" | "RMP" | "RDVF" | "RNOA";

export type RegistroLabel =
  | "Registro de Movilidad Humana"
  | "Registro de Medidas de Protección"
  | "Registro de Derecho a Vivir en Familia"
  | "Registro Nacional de Obligaciones Alimentarias";

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
};

export type ArchivoBitacoraItem = {
  id: number;
  original_name: string;
  stored_name: string;
  content_type: string | null;
  size_bytes: number;
  created_at: string;
};

export type ActualizarBitacoraForm = {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo: string;
  telefono: string;
  folio: string;
  estado: string;
  instancia: string;
  fecha: string;
  hora: string;
  tipo: string;
  atendido_por: string;
  observaciones: string;
  estatus: EstatusBitacora | "";
  registro: RegistroAbbr;
};

export type ChangeBitacoraField = <
  K extends keyof ActualizarBitacoraForm,
>(
  key: K,
  value: ActualizarBitacoraForm[K],
) => void;

export type ActualizarBitacoraDrawerProps = {
  bitacora: BitacoraDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onUpdated?: (bitacora: BitacoraDetail) => void;
  listBitacoraFiles: (
    id: number,
  ) => Promise<ArchivoBitacoraItem[]>;
  uploadBitacoraFiles: (
    id: number,
    formData: FormData,
  ) => Promise<unknown>;
  deleteBitacoraFile: (
    bitacoraId: number,
    fileId: number,
  ) => Promise<unknown>;
  updateBitacora: (
    id: number,
    payload: Record<string, unknown>,
  ) => Promise<BitacoraDetail>;
};
