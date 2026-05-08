import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
      setSidebarCollapsed(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/contracts') return 'Contratos';
    if (path === '/alerts') return 'Alertas';
    if (path === '/reports') return 'Reportes';
    if (path === '/chat') return 'Chat IA';
    if (path.startsWith('/contract/')) return 'Detalle de Contrato';
    return 'GobIA Auditor';
  };

  const getPageDescription = () => {
    const title = getPageTitle();
    const descriptions = {
      Dashboard: 'Visión general de riesgos y alertas',
      Contratos: 'Gestión y análisis de contratos públicos',
      Alertas: 'Monitorización de anomalías en tiempo real',
      Reportes: 'Generación de informes ejecutivos',
      'Chat IA': 'Asistente inteligente para consultas',
      'Detalle de Contrato': 'Información completa del proceso',
    };
    return descriptions[title] || '';
  };

  const pageTitle = getPageTitle();
  const pageDescription = getPageDescription();

  const showSidebar = isMobile ? mobileSidebarOpen : !sidebarCollapsed;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={toggleSidebar} sidebarCollapsed={isMobile ? !mobileSidebarOpen : sidebarCollapsed} />
      <div className="flex relative">
        <div
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                  mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'relative'
          }`}
        >
          <Sidebar collapsed={isMobile ? false : sidebarCollapsed} />
        </div>
        {isMobile && mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setMobileSidebarOpen(false)} />
        )}
        <main
          className={`flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto transition-all duration-200 ${
            isMobile ? '' : 'ml-0'
          }`}
        >
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                {pageDescription}
              </p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;