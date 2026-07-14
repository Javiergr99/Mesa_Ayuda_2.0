import http from "../api/http";

export async function listBitacoras() {
  const { data } = await http.get("/bitacoras");
  return data;
}

export async function getBitacoraById(id: number) {
  const { data } = await http.get(`/bitacoras/${id}`);
  return data;
}

export async function createBitacora(payload: Record<string, unknown>) {
  const { data } = await http.post("/bitacoras", payload);
  return data;
}

export async function updateBitacora(
  id: number,
  payload: Record<string, unknown>
) {
  const { data } = await http.patch(`/bitacoras/${id}`, payload);
  return data;
}

export async function deleteBitacora(id: number) {
  const { data } = await http.delete(`/bitacoras/${id}`);
  return data;
}

export async function listBitacoraFiles(id: number) {
  const { data } = await http.get(`/bitacoras/${id}/archivos`);
  return data;
}

export async function uploadBitacoraFiles(id: number, formData: FormData) {
  const { data } = await http.post(`/bitacoras/${id}/archivos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteBitacoraFile(bitacoraId: number, fileId: number) {
  const { data } = await http.delete(
    `/bitacoras/${bitacoraId}/archivos/${fileId}`
  );
  return data;
}