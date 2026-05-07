// src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { useContracts } from './useContracts';

function formatRelativeTime(dateString) {
  if (!dateString) return 'fecha desconocida';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'fecha inválida';
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

export const useNotifications = () => {
  const { contracts, summary, loading } = useContracts({ limit: 1000 });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!contracts.length && !loading) {
      setIsLoading(false);
      setNotifications([]);
      return;
    }

    const newNotifications = [];

    // Contratos con riesgo alto
    contracts.forEach(contract => {
      if (contract.riskScore >= 70) {
        newNotifications.push({
          id: `risk-${contract.id}`,
          title: 'Alto riesgo detectado',
          description: `${contract.processNumber} (${contract.entity}) - Riesgo ${contract.riskScore}%`,
          time: formatRelativeTime(contract.date),
          read: false,
          type: 'high_risk',
          contractId: contract.id,
        });
      }
    });

    // Alertas por flags
    contracts.forEach(contract => {
      if (contract.flags && contract.flags.length) {
        contract.flags.forEach(flag => {
          newNotifications.push({
            id: `flag-${contract.id}-${flag}`,
            title: `Alerta: ${getFlagLabel(flag)}`,
            description: `En ${contract.processNumber} se detectó ${getFlagLabel(flag).toLowerCase()}`,
            time: formatRelativeTime(contract.date),
            read: false,
            type: 'flag',
            contractId: contract.id,
          });
        });
      }
    });

    // Resumen global
    if (summary?.totalRedFlags > 0) {
      newNotifications.unshift({
        id: 'summary',
        title: `Total de alertas: ${summary.totalRedFlags}`,
        description: `Se han detectado ${summary.totalRedFlags} alertas en ${summary.totalContracts} contratos.`,
        time: 'ahora',
        read: false,
        type: 'summary',
      });
    }

    newNotifications.sort((a, b) => (a.time > b.time ? -1 : 1));
    setNotifications(newNotifications.slice(0, 10));
    setIsLoading(false);
  }, [contracts, summary, loading]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markAsRead, loading: isLoading };
};