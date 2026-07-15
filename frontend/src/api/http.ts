import axios from "axios";

import { API_URL } from "../app/env";

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    if (
      status === 401 &&
      currentPath !== "/login"
    ) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default http;
