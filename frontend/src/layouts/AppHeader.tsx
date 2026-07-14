import { Bell, LogOut, Settings, UserCircle } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

const TOP_LINKS = [
  "Home",
  "Por tus derechos",
  "RNOA",
  "Micrositio",
  "Honorarios",
  "Contactos",
] as const;

export default function AppHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="h-6 w-6 shrink-0 rounded-md bg-slate-700"
        />

        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex"
        >
          <span aria-hidden="true" className="h-4 w-4 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </span>

          <input
            type="search"
            aria-label="Buscar"
            placeholder="Buscar"
            className="w-44 bg-transparent text-sm text-slate-600 outline-none"
          />
        </form>
      </div>

      <nav
        aria-label="Accesos principales"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[15px] font-semibold text-slate-800 lg:flex"
      >
        {TOP_LINKS.map((label) => (
          <span
            key={label}
            className="inline-block transition-transform duration-200 ease-out hover:scale-[1.05] hover:brightness-110"
          >
            {label}
          </span>
        ))}
      </nav>

      <div className="relative flex items-center gap-3" ref={menuRef}>
        <button
          type="button"
          aria-label="Notificaciones"
          className="rounded-md p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        >
          <Bell aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => setProfileOpen((current) => !current)}
          aria-controls={profileMenuId}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
        >
          <span className="block h-8 w-8 overflow-visible rounded-full">
            <img
              src="https://img.freepik.com/vector-gratis/circulo-azul-usuario-blanco_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
              alt=""
              className="h-8 w-8 rounded-full border border-slate-200 object-cover shadow-sm transition-transform duration-200 ease-out hover:scale-105 hover:brightness-110"
            />
          </span>

          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[14px] font-medium text-slate-800">
              Javier Garcia
            </span>
            <span className="block text-[11px] text-slate-500">
              Programador Jr
            </span>
          </span>

          <span
            aria-hidden="true"
            className={`text-slate-400 transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {profileOpen && (
          <div
            id={profileMenuId}
            role="menu"
            className="absolute right-0 top-11 w-52 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[14px] hover:bg-slate-50"
            >
              <UserCircle
                aria-hidden="true"
                className="h-4 w-4 text-slate-600"
              />
              Mi perfil
            </button>

            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[14px] hover:bg-slate-50"
            >
              <Settings
                aria-hidden="true"
                className="h-4 w-4 text-slate-600"
              />
              Ajustes
            </button>

            <div aria-hidden="true" className="my-1 h-px bg-slate-200" />

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[14px] hover:bg-slate-50"
            >
              <LogOut
                aria-hidden="true"
                className="h-4 w-4 text-slate-600"
              />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
