import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import {
  AlertTriangle,
  House,
  RefreshCw,
} from "lucide-react";

type ErrorDetails = {
  status: number | null;
  title: string;
  message: string;
};

function getErrorDetails(error: unknown): ErrorDetails {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title:
        error.status === 404
          ? "PÃ¡gina no encontrada"
          : "No fue posible mostrar esta pÃ¡gina",
      message:
        typeof error.data === "string"
          ? error.data
          : error.statusText ||
            "La aplicaciÃ³n encontrÃ³ un problema al procesar la solicitud.",
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      title: "OcurriÃ³ un error inesperado",
      message: import.meta.env.DEV
        ? error.message
        : "La aplicaciÃ³n encontrÃ³ un problema inesperado. Intenta nuevamente.",
    };
  }

  return {
    status: null,
    title: "OcurriÃ³ un error inesperado",
    message:
      "La aplicaciÃ³n encontrÃ³ un problema inesperado. Intenta nuevamente.",
  };
}

export default function RouteErrorPage() {
  const navigate = useNavigate();
  const routeError = useRouteError();
  const details = getErrorDetails(routeError);

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 px-6 py-12">
      <section
        aria-labelledby="route-error-title"
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle
            aria-hidden="true"
            className="h-7 w-7"
          />
        </div>

        {details.status !== null && (
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Error {details.status}
          </p>
        )}

        <h1
          id="route-error-title"
          className="mt-3 text-2xl font-semibold text-slate-900"
        >
          {details.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {details.message}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <House
              aria-hidden="true"
              className="h-4 w-4"
            />
            Ir al acceso
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <RefreshCw
              aria-hidden="true"
              className="h-4 w-4"
            />
            Recargar pÃ¡gina
          </button>
        </div>
      </section>
    </main>
  );
}