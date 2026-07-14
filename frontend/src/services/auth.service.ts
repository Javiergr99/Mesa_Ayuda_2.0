import http from "../api/http";
import { LOGOUT_PATH } from "../app/env";

export type LoginPayload = {
  username: string;
  password: string;
};

export type MeResponse = {
  id: number;
  email: string;
  username: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await http.post("/auth/login", payload);

  const token =
    data?.access_token || data?.token || data?.accessToken || null;

  if (token) {
    localStorage.setItem("token", token);
  }

  return data;
}

export async function me() {
  const { data } = await http.get<MeResponse>("/auth/me");
  return data;
}

export async function checkSession() {
  try {
    await me();
    return true;
  } catch {
    return false;
  }
}

export async function logout() {
  try {
    await http.post(LOGOUT_PATH);
  } catch {
    // no-op
  } finally {
    localStorage.removeItem("token");
  }

  return true;
}