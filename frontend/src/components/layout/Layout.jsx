import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) setMobileSidebarOpen(false);
  }, [location, isMobile]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/contracts') return 'Contratos';
    if (path === '/alerts') return 'Alertas';
    if (path === '/reports') return 'Reportes';
    if (path === '/chat') return 'Chat IA';
    if (path.startsWith('/contract/')) return 'Detalle de Contrato';
    return 'GobIA Auditor';
  };

  const pageTitle = getPageTitle();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={toggleSidebar} sidebarCollapsed={sidebarCollapsed} isMobile={isMobile} mobileSidebarOpen={mobileSidebarOpen} />
      <div className="flex relative">
        {/* Sidebar para desktop */}
        {!isMobile && (
          <Sidebar collapsed={sidebarCollapsed} />
        )}
        {/* Sidebar overlay para móvil */}
        {isMobile && mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
        )}
        {isMobile && (
          <div className={`fixed top-0 left-0 z-50 h-full transition-transform duration-300 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar collapsed={false} isMobile={true} onClose={() => setMobileSidebarOpen(false)} />
          </div>
        )}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto transition-all duration-200 w-full ${!isMobile && sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              {pageTitle === 'Dashboard' && 'Visión general de riesgos y alertas'}
              {pageTitle === 'Contratos' && 'Gestión y análisis de contratos públicos'}
              {pageTitle === 'Alertas' && 'Monitorización de anomalías en tiempo real'}
              {pageTitle === 'Reportes' && 'Generación de informes ejecutivos'}
              {pageTitle === 'Chat IA' && 'Asistente inteligente para consultas'}
              {pageTitle === 'Detalle de Contrato' && 'Información completa del proceso'}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;