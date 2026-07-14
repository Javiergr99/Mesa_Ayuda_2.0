import {
  BarChart2,
  ClipboardList,
  FileText,
  FolderTree,
  Home,
  LogOut,
  Settings,
  UserCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

function clsx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SubItem({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "block w-full rounded px-2 py-1 text-left text-[14px] hover:bg-slate-50 hover:text-slate-900",
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppSidebar() {
  const hoverTimer = useRef<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const enterSidebar = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setSidebarOpen(true), 120);
  };

  const leaveSidebar = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setSidebarOpen(false);
      setOpenMenu(null);
    }, 220);
  };

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  function MenuItem({
    icon: Icon,
    label,
    to,
    children,
    onClick,
  }: {
    icon: any;
    label: string;
    to?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }) {
    const isOpen = openMenu === label;

    const content = (
      <>
        <span className={clsx("flex items-center gap-3", sidebarOpen && "pl-2")}>
          <Icon className="h-[22px] w-[22px]" />
          <span className={sidebarOpen ? "" : "hidden"}>{label}</span>
        </span>
        {sidebarOpen && children && (
          <ChevronRight
            className={clsx(
              "h-4 w-4 text-slate-400 transition-transform",
              isOpen ? "rotate-90" : "rotate-0"
            )}
          />
        )}
      </>
    );

    if (children) {
      return (
        <div>
          <button
            type="button"
            onClick={() => setOpenMenu(isOpen ? null : label)}
            className={clsx(
              "flex w-full items-center rounded-md py-2 text-[15px] text-slate-700 transition-colors hover:bg-slate-100",
              sidebarOpen ? "justify-between px-3" : "justify-center px-0"
            )}
          >
            {content}
          </button>

          {sidebarOpen && isOpen && <div className="ml-8 mt-1 space-y-1">{children}</div>}
        </div>
      );
    }

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={clsx(
            "flex w-full items-center rounded-md py-2 text-[15px] text-slate-700 transition-colors hover:bg-slate-100",
            sidebarOpen ? "justify-between px-3" : "justify-center px-0"
          )}
        >
          {content}
        </button>
      );
    }

    return (
      <NavLink
        to={to || "/app"}
        className={({ isActive }) =>
          clsx(
            "flex w-full items-center rounded-md py-2 text-[15px] transition-colors hover:bg-slate-100",
            sidebarOpen ? "justify-between px-3" : "justify-center px-0",
            isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"
          )
        }
      >
        {content}
      </NavLink>
    );
  }

  return (
    <aside
      onMouseEnter={enterSidebar}
      onMouseLeave={leaveSidebar}
      className={clsx(
        "sticky top-16 self-start overflow-y-auto border-r border-slate-200 bg-white shadow-sm transition-[width] duration-300 h-[calc(100vh-64px)]",
        sidebarOpen ? "w-52" : "w-[68px]"
      )}
    >
      <nav className="space-y-1 p-3">
        <MenuItem icon={Home} label="Inicio" to="/app" />

        <MenuItem icon={ClipboardList} label="Bitácora">
          <SubItem to="/app/bitacoras/nueva" label="Registrar Nueva Bitácora" />
          <SubItem to="/app/bitacoras/seguimiento" label="Seguimiento Bitácoras" />
        </MenuItem>

        <MenuItem icon={FileText} label="Solicitudes">
          <SubItem to="/app/solicitudes/nueva" label="Registrar Nueva Solicitud" />
          <SubItem
            to="/app/solicitudes/seguimiento"
            label="Seguimiento de Solicitudes"
          />
        </MenuItem>

        <MenuItem icon={FolderTree} label="Atenciones" />
        <MenuItem icon={BarChart2} label="Minería" />
        <MenuItem icon={Users} label="Organizador" />
        <MenuItem icon={Users} label="Usuarios" />
        <MenuItem icon={Settings} label="Ajustes" />
        <MenuItem icon={UserCircle} label="Mi perfil" />
        <MenuItem icon={LogOut} label="Salir" onClick={handleLogout} />
      </nav>
    </aside>
  );
}