import { Bell, AlertTriangle, Clock, Shield, ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';

// Datos mock estáticos para pruebas
const mockAlerts = [
  { id: 1, title: 'Alto riesgo detectado', description: 'Contrato CM-DTAM-035 supera el 85% de riesgo', time: 'hace 5 min', type: 'high_risk', contractId: '1' },
  { id: 2, title: 'Sobrecosto en proceso', description: 'Contrato con sobrecosto del 23%', time: 'hace 20 min', type: 'flag', contractId: '2' },
  { id: 3, title: 'Único proponente recurrente', description: 'Mismo contratista en múltiples procesos', time: 'hace 1 hora', type: 'flag', contractId: '3' },
];

const AlertsPanel = () => {
  const getSeverityColor = (type) => {
    if (type === 'high_risk') return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/20';
    return 'border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20';
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
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg ${getSeverityColor(alert.type)} transition-all hover:translate-x-1 cursor-pointer`}
            onClick={() => {
              if (alert.contractId) window.location.href = `/contract/${alert.contractId}`;
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.title}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                  <Clock size={12} /> {alert.time}
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertsPanel;