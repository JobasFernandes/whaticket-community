import { useRef, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { i18n } from "../translate/i18n.js";
import {
  Home,
  MessageCircle,
  Settings,
  Phone,
  QrCode,
  Sun,
  Moon,
  Menu as MenuIcon,
  LogOut,
  User as UserIcon,
  Layers,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { useThemeContext } from "../context/DarkMode";
import { AuthContext } from "../context/Auth/AuthContext";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import clsx from "clsx";
import { Can } from "../components/Can";

const mainLinks = [
  {
    to: "/",
    label: i18n.t("mainDrawer.listItems.dashboard"),
    icon: <Home size={20} />,
    adminOnly: true
  },
  {
    label: i18n.t("mainDrawer.listItems.attendances"),
    icon: <MessageCircle size={20} />,
    submenu: [
      {
        to: "/tickets",
        label: i18n.t("mainDrawer.listItems.tickets"),
        icon: <MessageCircle size={18} />
      },
      {
        to: "/contacts",
        label: i18n.t("mainDrawer.listItems.contacts"),
        icon: <Phone size={18} />
      },
      {
        to: "/quickAnswers",
        label: i18n.t("mainDrawer.listItems.quickAnswers"),
        icon: <MessageSquare size={18} />
      }
    ],
    adminOnly: false
  },
  {
    label: i18n.t("mainDrawer.listItems.administration"),
    icon: <Settings size={20} />,
    submenu: [
      {
        to: "/users",
        label: i18n.t("mainDrawer.listItems.users"),
        icon: <UserIcon size={18} />,
        adminOnly: true
      },
      {
        to: "/queues",
        label: i18n.t("mainDrawer.listItems.queues"),
        icon: <Layers size={18} />,
        adminOnly: true
      },
      {
        to: "/connections",
        label: i18n.t("mainDrawer.listItems.connections"),
        icon: <QrCode size={18} />,
        adminOnly: true,
        showAlert: true // Indicador para mostrar alerta se houver conexões desconectadas
      },
      {
        to: "/settings",
        label: i18n.t("mainDrawer.listItems.settings"),
        icon: <Settings size={18} />,
        adminOnly: true
      }
    ],
    adminOnly: true
  }
];

export default function MainListItems() {
  const { darkMode, toggleTheme } = useThemeContext();
  const { user, handleLogout } = useContext(AuthContext);
  const { whatsApps } = useContext(WhatsAppsContext);

  if (!user) return null;

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeout = useRef();
  const location = useLocation();

  // Verifica se há conexões desconectadas
  const hasDisconnectedConnections =
    whatsApps?.some(whatsApp => whatsApp.status !== "CONNECTED") || false;

  const isActive = to => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(to);
  };

  const isSubmenuActive = submenu => {
    if (!submenu) return false;
    return submenu.some(sublink => isActive(sublink.to));
  };

  const renderLink = (link, isMobile = false) => {
    if (link.submenu) {
      const isDropdownOpen = openDropdown === link.label;
      const isSubmenuCurrentlyActive = isSubmenuActive(link.submenu);
      const DropdownWrapper = link.adminOnly
        ? Can
        : ({ yes, ...props }) => yes();
      const handleMouseEnter = () => {
        if (!isMobile) {
          clearTimeout(dropdownTimeout.current);
          setOpenDropdown(link.label);
        }
      };
      const handleMouseLeave = () => {
        if (!isMobile) {
          dropdownTimeout.current = setTimeout(() => {
            setOpenDropdown(null);
          }, 200);
        }
      };
      return (
        <DropdownWrapper
          key={link.label}
          role={user?.profile}
          perform="drawer-admin-items:view"
          yes={() => (
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={clsx(
                  "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium w-full",
                  isDropdownOpen || isSubmenuCurrentlyActive
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
                )}
                onClick={() =>
                  setOpenDropdown(isDropdownOpen ? null : link.label)
                }
              >
                {link.icon}
                <span>{link.label}</span>
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div
                  className={clsx(
                    "absolute z-40 left-0 mt-2 min-w-[200px] rounded-xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 shadow-lg py-2",
                    isMobile &&
                      "static shadow-none mt-2 ml-0 bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {link.submenu.map(sublink => {
                    const handleSubClick = () => {
                      setOpenDropdown(null);
                      setMobileMenuOpen(false);
                    };
                    if (sublink.adminOnly) {
                      return (
                        <Can
                          key={sublink.to}
                          role={user?.profile}
                          perform="drawer-admin-items:view"
                          yes={() => (
                            <Link
                              to={sublink.to}
                              className={clsx(
                                "flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150",
                                isActive(sublink.to) &&
                                  "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
                                isMobile && "pl-6"
                              )}
                              onClick={handleSubClick}
                            >
                              <div className="flex items-center gap-3">
                                {sublink.icon}
                                <span>{sublink.label}</span>
                              </div>
                              {sublink.showAlert &&
                                hasDisconnectedConnections && (
                                  <AlertTriangle
                                    size={14}
                                    className="text-orange-500"
                                    title="Há conexões desconectadas"
                                  />
                                )}
                            </Link>
                          )}
                        />
                      );
                    }
                    return (
                      <Link
                        key={sublink.to}
                        to={sublink.to}
                        className={clsx(
                          "flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150",
                          isActive(sublink.to) &&
                            "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
                          isMobile && "pl-6"
                        )}
                        onClick={handleSubClick}
                      >
                        <div className="flex items-center gap-3">
                          {sublink.icon}
                          <span>{sublink.label}</span>
                        </div>
                        {sublink.showAlert && hasDisconnectedConnections && (
                          <AlertTriangle
                            size={14}
                            className="text-orange-500"
                            title="Há conexões desconectadas"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        />
      );
    }
    if (link.adminOnly) {
      return (
        <Can
          key={link.to}
          role={user?.profile}
          perform="drawer-admin-items:view"
          yes={() => (
            <Link
              to={link.to}
              className={clsx(
                "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-150 w-full",
                isActive(link.to)
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          )}
        />
      );
    }
    return (
      <Link
        key={link.to}
        to={link.to}
        className={clsx(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-150 w-full",
          isActive(link.to)
            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {link.icon}
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo e Links - Lado Esquerdo */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
                WhaTicket
              </span>
            </div>

            {/* Desktop Nav - Próximo ao Logo */}
            <div className="hidden md:flex items-center gap-1">
              {mainLinks.map(link => renderLink(link, false))}
            </div>
          </div>

          {/* Botões de Ação - Lado Direito */}
          <div className="flex items-center gap-2">
            {/* Connection Alert */}
            {hasDisconnectedConnections && (
              <Can
                role={user?.profile}
                perform="drawer-admin-items:view"
                yes={() => (
                  <Link
                    to="/connections"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 transition-colors duration-150"
                    title="Há conexões desconectadas - Clique para gerenciar"
                  >
                    <AlertTriangle size={20} />
                  </Link>
                )}
              />
            )}
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150"
              title="Alternar tema"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150">
              <NotificationsPopOver />
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserModalOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150"
                title="Perfil do usuário"
              >
                <UserIcon size={20} />
              </button>
              <UserModal
                open={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                userId={user?.id}
              />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors duration-150"
              title="Sair"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150 ml-2"
              onClick={() => setMobileMenuOpen(v => !v)}
              title="Abrir menu"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-[#1e1e1e] shadow-xl transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
                  WhaTicket
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-150"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                  {mainLinks.map(link => renderLink(link, true))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-150"
                    title="Alternar tema"
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="text-sm font-medium">
                      {darkMode ? "Modo Claro" : "Modo Escuro"}
                    </span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors duration-150"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
