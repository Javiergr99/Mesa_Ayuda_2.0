export const API_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000";

export const BG_URL =
  import.meta.env.VITE_BG_URL?.trim() ||
  "https://concepto.de/wp-content/uploads/2022/06/dia-del-nino-scaled.jpg";

export const LOGOUT_PATH =
  import.meta.env.VITE_LOGOUT_PATH?.trim() || "/auth/logout";