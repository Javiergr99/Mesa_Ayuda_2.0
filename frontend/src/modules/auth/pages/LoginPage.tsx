import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BG_URL } from "../../../app/env";
import { login, me } from "../../../services/auth.service";

export default function LoginPage() {
  const nav = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const main = document.querySelector("#login-section");
    if (main) main.classList.add("animate-fade-zoom");
  }, []);

  useEffect(() => {
    me()
      .then(() => nav("/app", { replace: true }))
      .catch(() => {});
  }, [nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const username = (document.getElementById("email") as HTMLInputElement).value;
      const password = (document.getElementById("password") as HTMLInputElement).value;

      await login({
        username: username.trim(),
        password,
      });

      await me();

      nav("/app", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Error al iniciar sesión"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: "cover" }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[6px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/50" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16">
        <section
          id="login-section"
          className="w-full max-w-md scale-95 rounded-3xl border border-white/40 bg-white/25 p-8 opacity-0 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          <div className="mb-6 flex items-center gap-3 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            <div className="grid h-11 w-11 place-content-center rounded-2xl bg-black/30 ring-1 ring-white/30 animate-fade-in">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="animate-fade-in-delay">
              <h1 className="text-xl font-semibold leading-tight">Mesa de Ayuda</h1>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-white/50 animate-fade-up">
            <h2 className="mb-1 text-2xl font-semibold tracking-tight text-neutral-800">
              Bienvenido 👋
            </h2>
            <p className="mb-6 text-sm text-neutral-600">
              Accede para gestionar solicitudes y dar seguimiento.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-neutral-700" htmlFor="email">
                Usuario o correo
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  type="text"
                  placeholder="usuario@dominio"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
                  autoComplete="username"
                />
              </div>

              <label
                className="mt-3 block text-sm font-medium text-neutral-700"
                htmlFor="password"
              >
                Contraseña
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-500 hover:bg-slate-100"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm animate-fade-in-delay">
                <a className="text-fuchsia-600 hover:underline" href="#recuperar">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-3 text-center text-[15px] font-semibold text-white shadow-lg transition-transform focus:outline-none focus:ring-2 focus:ring-fuchsia-200 animate-fade-up-delay ${
                  isSubmitting ? "cursor-not-allowed opacity-70" : "hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="relative py-3 animate-fade-in-delay">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative mx-auto w-fit bg-white px-2 text-xs text-neutral-500">
                  o
                </div>
              </div>

              <a
                href="#"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] font-medium text-neutral-700 transition hover:bg-slate-50 animate-fade-up-delay"
              >
                Ir al Repositorio de Formatos
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              {error && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{error}</p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}