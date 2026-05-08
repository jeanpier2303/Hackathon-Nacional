import { useState, useEffect, useRef } from 'react';
import { LogOut, Moon, Sun, User, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useModal } from '../../contexts/ModalContext';
import { Button } from '../common/Button';

const Header = ({ onMenuClick, sidebarCollapsed, isMobile, mobileSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { openContractModal } = useModal();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.contractId) openContractModal(notif.contractId);
    setNotificationsOpen(false);
  };

  const logoSrc = darkMode ? "../../../src/assets/logo-blanc.png" : "../../../src/assets/logo-oscuro.png";

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-white/20 dark:border-gray-800/50 rounded-none shadow-lg backdrop-blur-xl">
      <div className="px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onMenuClick} 
            className="p-1.5 sm:p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            {isMobile ? (mobileSidebarOpen ? <X size={20} className="sm:size-22" /> : <Menu size={20} className="sm:size-22" />) : (sidebarCollapsed ? <Menu size={20} className="sm:size-22" /> : <X size={20} className="sm:size-22" />)}
          </button>
          <div className="w-px h-5 sm:h-6 bg-gray-300 dark:bg-gray-700 hidden xs:block"></div>
          <div className="flex items-center">
            <div className="h-8 w-16 sm:h-10 sm:w-18 rounded-xl flex items-center justify-center overflow-hidden">
              <img src={logoSrc} alt="GobIA Auditor" className="h-full w-full object-contain" />
            </div>
            <span className="hidden md:inline-block ml-2 text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">GobIA Auditor</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)} 
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition"
              aria-label="Notifications"
            >
              <Bell size={18} className="sm:size-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[9px] sm:text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[70vh] flex flex-col animate-fade-in">
                <div className="p-2.5 sm:p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-white sticky top-0 bg-white dark:bg-gray-800 flex justify-between items-center text-sm sm:text-base">
                  <span>Notificaciones</span>
                  <span className="text-xs text-purple-500">{unreadCount} no leídas</span>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No hay notificaciones</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)} 
                        className={`p-2.5 sm:p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all ${!notif.read ? 'bg-purple-50/50 dark:bg-purple-900/20 border-l-4 border-l-purple-500' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{notif.title}</p>
                            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2">{notif.description}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1 animate-pulse"></div>}
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
          <button 
            onClick={toggleDarkMode} 
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} className="sm:size-5" /> : <Moon size={18} className="sm:size-5" />}
          </button>
          <div className="flex items-center gap-1 sm:gap-3 pl-1 sm:pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden xs:inline-block">{user?.name?.split(' ')[0] || 'Analista'}</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <LogOut size={14} className="sm:size-4 mr-0 sm:mr-1" />
            <span className="hidden xs:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;