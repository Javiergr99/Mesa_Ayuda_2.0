import {
  BarChart2,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderTree,
  Home,
  LogOut,
  Settings,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

function clsx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

type SubItemProps = {
  to: string;
  label: string;
};

function SubItem({ to, label }: SubItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "block w-full rounded px-2 py-1 text-left text-[14px] hover:bg-slate-50 hover:text-slate-900",
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-600",
        )
      }
    >
      {label}
    </NavLink>
  );
}

type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  sidebarOpen: boolean;
  to?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
};

function MenuItem({
  icon: Icon,
  label,
  sidebarOpen,
  to,
  children,
  isOpen = false,
  onToggle,
  onClick,
}: MenuItemProps) {
  const accessibleLabel = sidebarOpen ? undefined : label;

  const content = (
    <>
      <span className={clsx("flex items-center gap-3", sidebarOpen && "pl-2")}>
        <Icon aria-hidden="true" className="h-[22px] w-[22px]" />
        <span className={sidebarOpen ? "" : "hidden"}>{label}</span>
      </span>

      {sidebarOpen && children && (
        <ChevronRight
          aria-hidden="true"
          className={clsx(
            "h-4 w-4 text-slate-400 transition-transform",
            isOpen ? "rotate-90" : "rotate-0",
          )}
        />
      )}
    </>
  );

  const itemClassName = clsx(
    "flex w-full items-center rounded-md py-2 text-[15px] text-slate-700 transition-colors hover:bg-slate-100",
    sidebarOpen ? "justify-between px-3" : "justify-center px-0",
  );

  if (children) {
    return (
      <div>
        <button
          type="button"
          aria-label={accessibleLabel}
          aria-expanded={isOpen}
          onClick={onToggle}
          className={itemClassName}
        >
          {content}
        </button>

        {sidebarOpen && isOpen && (
          <div className="ml-8 mt-1 space-y-1">{children}</div>
        )}
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        aria-label={accessibleLabel}
        onClick={onClick}
        className={itemClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to || "/app"}
      aria-label={accessibleLabel}
      className={({ isActive }) =>
        clsx(
          "flex w-full items-center rounded-md py-2 text-[15px] transition-colors hover:bg-slate-100",
          sidebarOpen ? "justify-between px-3" : "justify-center px-0",
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-700",
        )
      }
    >
      {content}
    </NavLink>
  );
}

export default function AppSidebar() {
  const hoverTimer = useRef<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (hoverTimer.current !== null) {
        window.clearTimeout(hoverTimer.current);
      }
    };
  }, []);

  function enterSidebar() {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
    }

    hoverTimer.current = window.setTimeout(() => {
      setSidebarOpen(true);
    }, 120);
  }

  function leaveSidebar() {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
    }

    hoverTimer.current = window.setTimeout(() => {
      setSidebarOpen(false);
      setOpenMenu(null);
    }, 220);
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  function toggleMenu(label: string) {
    setOpenMenu((current) => (current === label ? null : label));
  }

  return (
    <aside
      onMouseEnter={enterSidebar}
      onMouseLeave={leaveSidebar}
      className={clsx(
        "sticky top-16 h-[calc(100vh-64px)] self-start overflow-y-auto border-r border-slate-200 bg-white shadow-sm transition-[width] duration-300",
        sidebarOpen ? "w-52" : "w-[68px]",
      )}
    >
      <nav aria-label="Navegación lateral" className="space-y-1 p-3">
        <MenuItem
          icon={Home}
          label="Inicio"
          to="/app"
          sidebarOpen={sidebarOpen}
        />

        <MenuItem
          icon={ClipboardList}
          label="Bitácora"
          sidebarOpen={sidebarOpen}
          isOpen={openMenu === "Bitácora"}
          onToggle={() => toggleMenu("Bitácora")}
        >
          <SubItem
            to="/app/bitacoras/nueva"
            label="Registrar nueva bitácora"
          />
          <SubItem
            to="/app/bitacoras/seguimiento"
            label="Seguimiento de bitácoras"
          />
        </MenuItem>

        <MenuItem
          icon={FileText}
          label="Solicitudes"
          sidebarOpen={sidebarOpen}
          isOpen={openMenu === "Solicitudes"}
          onToggle={() => toggleMenu("Solicitudes")}
        >
          <SubItem
            to="/app/solicitudes/nueva"
            label="Registrar nueva solicitud"
          />
          <SubItem
            to="/app/solicitudes/seguimiento"
            label="Seguimiento de solicitudes"
          />
        </MenuItem>

        <MenuItem
          icon={FolderTree}
          label="Atenciones"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={BarChart2}
          label="Minería"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={Users}
          label="Organizador"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={Users}
          label="Usuarios"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={Settings}
          label="Ajustes"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={UserCircle}
          label="Mi perfil"
          sidebarOpen={sidebarOpen}
        />
        <MenuItem
          icon={LogOut}
          label="Salir"
          sidebarOpen={sidebarOpen}
          onClick={handleLogout}
        />
      </nav>
    </aside>
  );
}
