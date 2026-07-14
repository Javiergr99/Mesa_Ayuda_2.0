import http from "../api/http";

export async function listSolicitudes() {
  const { data } = await http.get("/solicitudes");
  return data;
}

export async function getSolicitudById(id: number) {
  const { data } = await http.get(`/solicitudes/${id}`);
  return data;
}

export async function createSolicitud(payload: Record<string, unknown>) {
  const { data } = await http.post("/solicitudes", payload);
  return data;
}

export async function updateSolicitud(
  id: number,
  payload: Record<string, unknown>
) {
  const { data } = await http.patch(`/solicitudes/${id}`, payload);
  return data;
}

export async function deleteSolicitud(id: number) {
  const { data } = await http.delete(`/solicitudes/${id}`);
  return data;
}