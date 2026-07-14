import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "../routes/ProtectedRoute";
import AppShell from "../layouts/AppShell";

import LoginPage from "../modules/auth/pages/LoginPage";
import HomePage from "../modules/dashboard/pages/HomePage";

import BitacoraRegistrarPage from "../modules/bitacoras/pages/BitacoraRegistrarPage";
import BitacoraSeguimientoPage from "../modules/bitacoras/pages/BitacoraSeguimientoPage";

import SolicitudRegistrarPage from "../modules/solicitudes/pages/SolicitudRegistrarPage";
import SolicitudSeguimientoPage from "../modules/solicitudes/pages/SolicitudSeguimientoPage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  { path: "/login", element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "bitacoras/nueva", element: <BitacoraRegistrarPage /> },
          {
            path: "bitacoras/seguimiento",
            element: <BitacoraSeguimientoPage />,
          },
          { path: "solicitudes/nueva", element: <SolicitudRegistrarPage /> },
          {
            path: "solicitudes/seguimiento",
            element: <SolicitudSeguimientoPage />,
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);

export default router;