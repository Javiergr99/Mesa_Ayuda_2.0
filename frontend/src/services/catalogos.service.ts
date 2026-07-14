import http from "../api/http";

export async function getEstados() {
  const { data } = await http.get("/catalogos/estados");
  return data;
}

export async function getTiposCaso() {
  const { data } = await http.get("/catalogos/tipos-caso");
  return data;
}

export async function getPersonasAtendio() {
  const { data } = await http.get("/catalogos/personas-atendio");
  return data;
}

export async function getEstatusBitacora() {
  const { data } = await http.get("/catalogos/estatus-bitacora");
  return data;
}

export async function getTiposRegistro() {
  const { data } = await http.get("/catalogos/tipos-registro");
  return data;
}