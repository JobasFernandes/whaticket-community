import { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  AlertTriangle,
  Globe
} from "lucide-react";
import { useThemeContext } from "../context/DarkMode";
import { AuthContext } from "../context/Auth/AuthContext";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { useI18n } from "../context/I18n";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import clsx from "clsx";
import { Can } from "../components/Can";

const mainLinks = [
  {
    to: "/",
    label: "dashboard",
    icon: <Home size={20} />,
    adminOnly: true
  },
  {
    label: "attendances",
    icon: <MessageCircle size={20} />,
    submenu: [
      {
        to: "/tickets",
        label: "tickets",
        icon: <MessageCircle size={18} />
      },
      {
        to: "/contacts",
        label: "contacts",
        icon: <Phone size={18} />
      },
      {
        to: "/quickAnswers",
        label: "quickAnswers",
        icon: <MessageSquare size={18} />
      }
    ],
    adminOnly: false
  },
  {
    label: "administration",
    icon: <Settings size={20} />,
    submenu: [
      {
        to: "/users",
        label: "users",
        icon: <UserIcon size={18} />,
        adminOnly: true
      },
      {
        to: "/queues",
        label: "queues",
        icon: <Layers size={18} />,
        adminOnly: true
      },
      {
        to: "/connections",
        label: "connections",
        icon: <QrCode size={18} />,
        adminOnly: true,
        showAlert: true
      },
      {
        to: "/settings",
        label: "settings",
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
  const { currentLanguage, changeLanguage, t, isLoading } = useI18n();

  if (!user) return null;

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const dropdownTimeout = useRef();
  const isMountedRef = useRef(true);
  const location = useLocation();

  const languages = [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" }
  ];

  const currentLang =
    languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = async languageCode => {
    if (languageCode !== currentLanguage) {
      setLanguageDropdownOpen(false);

      try {
        await changeLanguage(languageCode);
      } catch (error) {
        console.error("Erro ao trocar idioma:", error);
        if (isMountedRef.current) {
          setLanguageDropdownOpen(true);
        }
      }
    } else {
      if (isMountedRef.current) {
        setLanguageDropdownOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      setOpenDropdown(null);
      setLanguageDropdownOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
      }
    };
  }, []);

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
    const getTranslatedLabel = labelKey => {
      return t(`mainDrawer.listItems.${labelKey}`);
    };

    if (link.submenu) {
      const isDropdownOpen = openDropdown === link.label;
      const isSubmenuCurrentlyActive = isSubmenuActive(link.submenu);
      const DropdownWrapper = link.adminOnly
        ? Can
        : ({ yes, ...props }) => yes();
      const handleMouseEnter = () => {
        if (!isMobile && isMountedRef.current) {
          clearTimeout(dropdownTimeout.current);
          setOpenDropdown(link.label);
        }
      };
      const handleMouseLeave = () => {
        if (!isMobile && isMountedRef.current) {
          dropdownTimeout.current = setTimeout(() => {
            if (isMountedRef.current) {
              setOpenDropdown(null);
            }
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
                onClick={() => {
                  if (isMountedRef.current) {
                    setOpenDropdown(isDropdownOpen ? null : link.label);
                  }
                }}
              >
                {link.icon}
                <span>{getTranslatedLabel(link.label)}</span>
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
                      if (isMountedRef.current) {
                        setOpenDropdown(null);
                        setMobileMenuOpen(false);
                      }
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
                                <span>{getTranslatedLabel(sublink.label)}</span>
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
                          <span>{getTranslatedLabel(sublink.label)}</span>
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
              onClick={() => {
                if (isMountedRef.current) {
                  setMobileMenuOpen(false);
                }
              }}
            >
              {link.icon}
              <span>{getTranslatedLabel(link.label)}</span>
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
        onClick={() => {
          if (isMountedRef.current) {
            setMobileMenuOpen(false);
          }
        }}
      >
        {link.icon}
        <span>{getTranslatedLabel(link.label)}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo e Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
                WhaTicket
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {mainLinks.map(link => renderLink(link, false))}
            </div>
          </div>

          {/* Botões de Ação */}
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

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isMountedRef.current) {
                    setLanguageDropdownOpen(!languageDropdownOpen);
                  }
                }}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150"
                title="Alterar idioma"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <Globe size={20} />
                )}
              </button>

              {/* Language Dropdown */}
              {languageDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                      if (isMountedRef.current) {
                        setLanguageDropdownOpen(false);
                      }
                    }}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-20">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                          currentLang.code === language.code
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLang.code === language.code && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isMountedRef.current) {
                    setUserModalOpen(true);
                  }
                }}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-300 transition-colors duration-150"
                title="Perfil do usuário"
              >
                <UserIcon size={20} />
              </button>
              <UserModal
                open={userModalOpen}
                onClose={() => {
                  if (isMountedRef.current) {
                    setUserModalOpen(false);
                  }
                }}
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
              onClick={() => {
                if (isMountedRef.current) {
                  setMobileMenuOpen(v => !v);
                }
              }}
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
            onClick={() => {
              if (isMountedRef.current) {
                setMobileMenuOpen(false);
              }
            }}
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
                  onClick={() => {
                    if (isMountedRef.current) {
                      setMobileMenuOpen(false);
                    }
                  }}
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
                <div className="flex items-center justify-between mb-3">
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

                {/* Language Selector Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Globe size={16} />
                    <span>Idioma</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                          currentLang.code === language.code
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300"
                        }`}
                      >
                        <span className="text-sm">{language.flag}</span>
                        <span className="hidden sm:inline">
                          {language.code.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
