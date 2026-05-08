/* 
import { useState, useEffect, useMemo } from 'react';
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

  const filters = useMemo(() => ({
    limit: 1000
  }), []);

  const { contracts, loading } = useContracts(filters);

  const [notifications, setNotifications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    if (loading) return;

    const newNotifications = [];

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

    newNotifications.sort((a, b) => a.id < b.id ? 1 : -1);

    setNotifications(newNotifications.slice(0, 10));

    setIsLoading(false);

  }, [contracts, loading]);

  const markAsRead = (id) => {

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, read: true }
          : n
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    loading: isLoading
  };
}; */


import { useState, useEffect, useMemo } from 'react';
import { useContracts } from './useContracts';

// Datos de prueba para notificaciones (fallback)
const mockNotifications = [
  {
    id: 'mock-ntf-1',
    title: 'Alto riesgo detectado',
    description: 'Contrato CM-DTAM-035 supera el 85% de riesgo',
    time: 'hace 5 min',
    type: 'high_risk',
    contractId: 'mock-1',
    read: false,
    timestamp: Date.now() - 5 * 60 * 1000,
  },
  {
    id: 'mock-ntf-2',
    title: 'Sobrecosto en proceso',
    description: 'Contrato CON-2024-0012 con sobrecosto del 23%',
    time: 'hace 20 min',
    type: 'flag',
    contractId: 'mock-4',
    read: false,
    timestamp: Date.now() - 20 * 60 * 1000,
  },
  {
    id: 'mock-ntf-3',
    title: 'Único proponente recurrente',
    description: 'Mismo contratista en múltiples procesos de la Alcaldía',
    time: 'hace 1 hora',
    type: 'flag',
    contractId: 'mock-1',
    read: true,
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 'mock-ntf-4',
    title: 'Plazo inusual',
    description: 'Contrato de consultoría con plazo de 10 años',
    time: 'hace 2 horas',
    type: 'flag',
    contractId: 'mock-2',
    read: false,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'mock-ntf-5',
    title: 'Alerta: Cláusula a medida',
    description: 'Condiciones exclusivas para un solo proveedor',
    time: 'hace 1 día',
    type: 'flag',
    contractId: 'mock-3',
    read: false,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
];

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'fecha desconocida';
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'hace unos segundos';
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours} h`;
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 7) return `hace ${diffDays} días`;
  return new Date(timestamp).toLocaleDateString('es-CO');
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
  const filters = useMemo(() => ({ limit: 1000 }), []);
  const { contracts, loading } = useContracts(filters);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return; // esperar a que useContracts termine (aunque ya tiene mock)
    setIsLoading(true);
    const newNotifications = [];
    if (contracts && contracts.length > 0) {
      contracts.forEach(contract => {
        if (contract.riskScore >= 70) {
          newNotifications.push({
            id: `risk-${contract.id}`,
            title: 'Alto riesgo detectado',
            description: `${contract.processNumber} (${contract.entity}) - Riesgo ${contract.riskScore}%`,
            time: formatRelativeTime(new Date(contract.date).getTime()),
            read: false,
            type: 'high_risk',
            contractId: contract.id,
            timestamp: new Date(contract.date).getTime(),
          });
        }
        if (contract.flags && contract.flags.length) {
          contract.flags.forEach(flag => {
            newNotifications.push({
              id: `flag-${contract.id}-${flag}`,
              title: `Alerta: ${getFlagLabel(flag)}`,
              description: `En ${contract.processNumber} se detectó ${getFlagLabel(flag).toLowerCase()}`,
              time: formatRelativeTime(new Date(contract.date).getTime()),
              read: false,
              type: 'flag',
              contractId: contract.id,
              timestamp: new Date(contract.date).getTime(),
            });
          });
        }
      });
    }
    if (newNotifications.length > 0) {
      newNotifications.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(newNotifications.slice(0, 20));
    } else {
      // Si no hay contratos o no generan alertas, mantenemos los mock
      setNotifications(mockNotifications);
    }
    setIsLoading(false);
  }, [contracts, loading]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markAsRead, loading: isLoading };
};