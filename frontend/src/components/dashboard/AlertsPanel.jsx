import { Bell, AlertTriangle, Clock, Shield, ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';
import { useNotifications } from '../../hooks/useNotifications';

const AlertsPanel = () => {
  const { notifications, loading } = useNotifications();
  
  // Tomar solo las 3 primeras alertas para el panel del dashboard
  const recentAlerts = notifications.slice(0, 3);

  const getSeverityColor = (type) => {
    if (type === 'high_risk') return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/20';
    return 'border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20';
  };

  if (loading) {
    return (
      <Card className="p-5 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="text-purple-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Alertas en tiempo real</h3>
          </div>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="p-3 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5 h-full transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-purple-500" size={18} sm:size={20} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Alertas en tiempo real</h3>
        </div>
        <Shield size={14} sm:size={16} className="text-gray-400" />
      </div>
      <div className="space-y-2 sm:space-y-3">
        {recentAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No hay alertas recientes</div>
        ) : (
          recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-2 sm:p-3 rounded-lg ${getSeverityColor(alert.type)} transition-all hover:translate-x-1 cursor-pointer`}
              onClick={() => {
                if (alert.contractId) window.location.href = `/contract/${alert.contractId}`;
              }}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle size={14} sm:size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 break-words line-clamp-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                    <Clock size={10} sm:size={12} /> {alert.time}
                  </p>
                </div>
                <ChevronRight size={12} sm:size={14} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>
      {recentAlerts.length > 0 && (
        <div className="mt-4 text-center">
          <a href="/alerts" className="text-xs text-purple-600 hover:underline">Ver todas las alertas →</a>
        </div>
      )}
    </Card>
  );
};

export default AlertsPanel;