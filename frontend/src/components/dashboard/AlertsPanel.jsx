import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, Shield, ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';
import { fetchAlerts } from '../../services/api';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts()
      .then(data => {
        setAlerts(data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        setAlerts([
          { id: 1, title: 'Alto riesgo en contrato CM-DTAM-035', severity: 'high', time: 'hace 5 min', description: 'Sobrecosto y única propuesta' },
          { id: 2, title: 'Sobrecosto detectado en Alcaldía de Cali', severity: 'medium', time: 'hace 20 min', description: 'Valor 23% por encima del promedio' },
          { id: 3, title: 'Único proponente recurrente en MinEducación', severity: 'high', time: 'hace 1 hora', description: 'Mismo contratista en 5 procesos' },
        ]);
        setLoading(false);
      });
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/20';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20';
      default: return 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20';
    }
  };

  return (
    <Card className="p-5 h-full transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-purple-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Alertas en tiempo real</h3>
        </div>
        <Shield size={16} className="text-gray-400" />
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No hay alertas recientes</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg ${getSeverityColor(alert.severity)} transition-all hover:translate-x-1 cursor-pointer`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.title}</p>
                  {alert.description && <p className="text-xs text-gray-500 mt-1">{alert.description}</p>}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                    <Clock size={12} /> {alert.time}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AlertsPanel;