import { Bell, AlertTriangle, Clock, Shield, ChevronRight, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { useNotifications } from '../../hooks/useNotifications';
import { useState } from 'react';

const AlertsPanel = () => {
  const { notifications, loading, unreadCount, markAsRead } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const getSeverityColor = (type) => {
    if (type === 'high_risk') return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/20';
    return 'border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20';
  };

  return (
    <Card className="p-4 sm:p-5 h-full transition-all hover:shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <Bell className="text-purple-500" size={16} className="sm:size-20" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[9px] sm:text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white">Alertas</h3>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={handleRefresh} 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <RefreshCw size={12} className="sm:size-14 text-gray-400" />
          </button>
          <Shield size={12} className="sm:size-16 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 custom-scrollbar max-h-[300px] sm:max-h-none">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-2 sm:p-3 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-800 h-16 sm:h-20"></div>
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 sm:py-8 text-gray-400">
            <Bell size={24} className="sm:size-32" strokeWidth={1} />
            <p className="text-xs sm:text-sm mt-2">No hay alertas recientes</p>
          </div>
        ) : (
          notifications.map((alert) => (
            <div
              key={alert.id}
              className={`p-2 sm:p-3 rounded-lg ${getSeverityColor(alert.type)} transition-all hover:translate-x-1 cursor-pointer group`}
              onClick={() => {
                markAsRead(alert.id);
                if (alert.contractId) window.location.href = `/contract/${alert.contractId}`;
              }}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle size={12} className="sm:size-16 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">{alert.title}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">{alert.description}</p>
                  <p className="text-[9px] sm:text-xs text-gray-400 flex items-center gap-1 mt-1 sm:mt-2">
                    <Clock size={10} className="sm:size-12" /> {alert.time}
                  </p>
                </div>
                <ChevronRight size={12} className="sm:size-14 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AlertsPanel;