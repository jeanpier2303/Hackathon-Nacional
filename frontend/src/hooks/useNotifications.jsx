import { useState, useEffect } from 'react';
import { useContracts } from './useContracts';

export const useNotifications = () => {
  const { contracts, summary, loading } = useContracts({ limit: 100 }); // obtener todos los contratos
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (loading || !contracts.length) return;

    // Generar notificaciones basadas en datos reales
    const newNotifications = [];

    // 1. Contratos con riesgo alto (score >= 70)
    const highRiskContracts = contracts.filter(c => c.riskScore >= 70);
    highRiskContracts.forEach(contract => {
      newNotifications.push({
        id: `high-risk-${contract.id}`,
        title: `Alto riesgo detectado`,
        description: `Contrato ${contract.processNumber} (${contract.entity}) tiene un riesgo del ${contract.riskScore}%`,
        time: formatRelativeTime(contract.date),
        read: false,
        type: 'high_risk',
        contractId: contract.id,
      });
    });

    // 2. Alertas por flags (banderas)
    contracts.forEach(contract => {
      if (contract.flags && contract.flags.length > 0) {
        contract.flags.forEach(flag => {
          const flagLabel = getFlagLabel(flag);
          newNotifications.push({
            id: `flag-${contract.id}-${flag}`,
            title: `Alerta: ${flagLabel}`,
            description: `En el contrato ${contract.processNumber} se detectó ${flagLabel.toLowerCase()}`,
            time: formatRelativeTime(contract.date),
            read: false,
            type: 'flag',
            contractId: contract.id,
            flag,
          });
        });
      }
    });

    // 3. Resumen de alertas (solo una notificación global si hay muchas)
    if (summary?.totalRedFlags > 0) {
      newNotifications.unshift({
        id: 'summary-alerts',
        title: `Total de alertas: ${summary.totalRedFlags}`,
        description: `Se han detectado ${summary.totalRedFlags} banderas de riesgo en ${summary.totalContracts} contratos auditados.`,
        time: 'ahora',
        read: false,
        type: 'summary',
      });
    }

    // Limitar a las 10 más recientes (por fecha). Ordenar por fecha descendente
    newNotifications.sort((a, b) => (a.time > b.time ? -1 : 1));
    setNotifications(newNotifications.slice(0, 10));
  }, [contracts, summary, loading]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markAsRead };
};

// Función auxiliar para formatear tiempo relativo
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'hace unos segundos';
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours} h`;
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 7) return `hace ${diffDays} días`;
  return date.toLocaleDateString('es-CO');
}

function getFlagLabel(flagKey) {
  const labels = {
    unique_bidder: 'Único proponente recurrente',
    overcost: 'Sobrecosto detectado',
    unusual_deadline: 'Plazo inusual',
    tailor_made_clause: 'Cláusula a medida',
  };
  return labels[flagKey] || flagKey;
}