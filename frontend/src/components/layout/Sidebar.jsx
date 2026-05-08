import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldAlert, BarChart3, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed = false }) => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/contracts', icon: FileText, label: 'Contratos' },
    { to: '/alerts', icon: ShieldAlert, label: 'Alertas' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
    { to: '/chat', icon: MessageSquare, label: 'Chat IA' },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto shadow-sm z-20"
    >
      <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(139,92,246,0.3)] border border-purple-200/50 dark:border-purple-800/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:shadow-md'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : ''}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm sm:text-base">{item.label}</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4 text-xs text-center text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
          v2.0 · IA Anticorrupción
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;