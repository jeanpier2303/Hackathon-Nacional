import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, AlertTriangle, CheckCircle, Calendar, 
  X, Eye, EyeOff, BarChart3,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNotifications } from '../hooks/useNotifications';
import { useModal } from '../contexts/ModalContext';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#10B981'];
const ITEMS_PER_PAGE = 10;

const Alerts = () => {
  const { notifications, unreadCount, markAsRead, loading } = useNotifications();
  const { openContractModal } = useModal();
  const [filterType, setFilterType] = useState('all'); // all, unread, high_risk, flag
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar alertas
  const filteredAlerts = useMemo(() => {
    let filtered = [...notifications];
    
    if (filterType === 'unread') {
      filtered = filtered.filter(a => !a.read);
    } else if (filterType === 'high_risk') {
      filtered = filtered.filter(a => a.type === 'high_risk');
    } else if (filterType === 'flag') {
      filtered = filtered.filter(a => a.type === 'flag');
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(term) || 
        a.description.toLowerCase().includes(term)
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(a => a.timestamp ? new Date(a.timestamp) >= start : true);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(a => a.timestamp ? new Date(a.timestamp) <= end : true);
    }
    
    return filtered;
  }, [notifications, filterType, searchTerm, startDate, endDate]);

  // Paginación
  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAlerts.slice(start, end);
  }, [filteredAlerts, currentPage]);

  // Resetear página cuando cambian los filtros
  useMemo(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm, startDate, endDate]);

  // Datos para gráfico
  const chartData = useMemo(() => {
    const typeCount = {
      'Alto riesgo': notifications.filter(a => a.type === 'high_risk').length,
      'Alertas generales': notifications.filter(a => a.type === 'flag').length,
    };
    return Object.entries(typeCount).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [notifications]);

  const markAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.read) markAsRead(notif.id);
    });
  };

  const clearFilters = () => {
    setFilterType('all');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0}>
            <CheckCircle size={16} className="mr-2" />
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition">
          <Bell className="mx-auto text-purple-500 mb-2" size={24} />
          <p className="text-2xl font-bold">{notifications.length}</p>
          <p className="text-xs text-gray-500">Total alertas</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition">
          <EyeOff className="mx-auto text-orange-500 mb-2" size={24} />
          <p className="text-2xl font-bold">{unreadCount}</p>
          <p className="text-xs text-gray-500">No leídas</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition">
          <AlertTriangle className="mx-auto text-red-500 mb-2" size={24} />
          <p className="text-2xl font-bold">{notifications.filter(a => a.type === 'high_risk').length}</p>
          <p className="text-xs text-gray-500">Alto riesgo</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition">
          <BarChart3 className="mx-auto text-blue-500 mb-2" size={24} />
          <p className="text-2xl font-bold">{notifications.filter(a => a.type === 'flag').length}</p>
          <p className="text-xs text-gray-500">Otras alertas</p>
        </Card>
      </div>

      {/* Gráfico de distribución */}
      {chartData.length > 0 && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 size={18} /> Distribución por tipo de alerta
            </h3>
            <button onClick={() => setShowStats(!showStats)} className="text-gray-500 text-sm">
              {showStats ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showStats && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      )}

      {/* Filtros */}
      <Card className="p-5">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Button variant={filterType === 'all' ? 'primary' : 'outline'} onClick={() => setFilterType('all')} size="sm">Todas</Button>
            <Button variant={filterType === 'unread' ? 'primary' : 'outline'} onClick={() => setFilterType('unread')} size="sm">No leídas ({unreadCount})</Button>
            <Button variant={filterType === 'high_risk' ? 'primary' : 'outline'} onClick={() => setFilterType('high_risk')} size="sm">Alto riesgo</Button>
            <Button variant={filterType === 'flag' ? 'primary' : 'outline'} onClick={() => setFilterType('flag')} size="sm">Otras alertas</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg dark:bg-gray-800 w-full sm:w-auto" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg dark:bg-gray-800" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg dark:bg-gray-800" />
            <Button onClick={clearFilters} variant="outline" size="sm"><X size={14} className="mr-1" /> Limpiar</Button>
          </div>
        </div>
      </Card>

      {/* Lista de alertas paginada */}
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <AnimatePresence>
            {paginatedAlerts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <Bell className="mx-auto mb-3 opacity-30" size={48} />
                <p>No hay alertas con los filtros seleccionados.</p>
              </div>
            ) : (
              paginatedAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => { if (alert.contractId) openContractModal(alert.contractId); }}
                  className={`p-4 sm:p-5 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    !alert.read ? 'bg-purple-50/30 dark:bg-purple-900/10 border-l-4 border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.type === 'high_risk' ? <AlertTriangle className="text-red-500" size={20} /> : <Bell className="text-yellow-500" size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white break-words">{alert.title}</h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{alert.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">{alert.description}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(alert.id); }}
                      className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition ${alert.read ? 'opacity-30' : ''}`}
                      title={alert.read ? 'Leída' : 'Marcar como leída'}
                    >
                      {alert.read ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 p-4 border-t bg-gray-50/30 dark:bg-gray-800/20">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Primera página"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm whitespace-nowrap">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Última página"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Alerts;