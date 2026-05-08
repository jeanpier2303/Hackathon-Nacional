import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldAlert, BarChart3, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed = false, onCollapse }) => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/contracts', icon: FileText, label: 'Contratos' },
    { to: '/alerts', icon: ShieldAlert, label: 'Alertas' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
    { to: '/chat', icon: MessageSquare, label: 'Chat IA' },
  ];

  // Auto-cerrar en móvil al hacer clic en un enlace
  const handleNavClick = () => {
    if (window.innerWidth < 768 && onCollapse) {
      onCollapse(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed && onCollapse) {
        onCollapse(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, onCollapse]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 0 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto relative shadow-sm z-20 overflow-x-hidden"
    >
      <nav className="p-2 sm:p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={handleNavClick}>
            {({ isActive }) => (
              <div className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(139,92,246,0.3)] border border-purple-200/50 dark:border-purple-800/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:shadow-md'
              }`}>
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm sm:text-base">{item.label}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;