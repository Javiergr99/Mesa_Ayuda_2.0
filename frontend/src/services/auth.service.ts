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

export type LoginResponse = {
  ok: boolean;
  user: MeResponse;
};

export async function login(
  payload: LoginPayload,
) {
  const { data } = await http.post<LoginResponse>(
    "/auth/login",
    payload,
  );

  return data;
}

export async function me() {
  const { data } = await http.get<MeResponse>(
    "/auth/me",
  );

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
  await http.post(LOGOUT_PATH);
  return true;
}
