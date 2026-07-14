import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkSession } from "../services/auth.service";
import SplashScreen from "../layouts/SplashScreen";

export default function ProtectedRoute() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    checkSession()
      .then((v) => {
        if (alive) setOk(v);
      })
      .catch(() => {
        if (alive) setOk(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (ok === null) return <SplashScreen />;
  if (!ok) return <Navigate to="/login" replace />;

  return <Outlet />;
}