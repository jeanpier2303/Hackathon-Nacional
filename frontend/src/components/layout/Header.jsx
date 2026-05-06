import { useState, useEffect, useRef } from 'react';
import { Menu, LogOut, Moon, Sun, User, Bell, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../common/Button';

const Header = ({ onMenuClick, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.contractId) {
      window.location.href = `/contract/${notif.contractId}`;
    }
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-white/20 dark:border-gray-800/50 rounded-none shadow-lg backdrop-blur-xl">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Botón de colapso del sidebar */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition group relative"
            title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
              {sidebarCollapsed ? "Expandir" : "Colapsar"}
            </span>
          </button>

          {/* LOGO */}
          <div className="hidden md:flex items-center">
            <div className="h-65 w-auto">
              <img
                src="../../../src/assets/logo_uno.png"
                alt="GobIA Auditor"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Botón de notificaciones con datos reales */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition"
            >
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[70vh] flex flex-col">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-white sticky top-0 bg-white dark:bg-gray-800">
                  Notificaciones ({unreadCount} no leídas)
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all ${
                          !notif.read ? 'bg-purple-50/50 dark:bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {notif.type === 'high_risk' && <AlertTriangle size={14} className="text-red-500" />}
                              <p className="text-sm font-medium text-gray-800 dark:text-white">{notif.title}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notif.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1"></div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center sticky bottom-0 bg-white dark:bg-gray-800">
                  <a href="/alerts" className="text-xs text-purple-600 hover:underline">Ver todas las alertas</a>
                </div>
              </div>
            )}
          </div>

          {/* Botón modo oscuro */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline-block">
              {user?.name || 'Analista'}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={logout} className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <LogOut size={16} className="mr-1" /> Salir
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;