// src/hooks/useEmailHistory.js
import { useState, useEffect } from 'react';

// Datos mock de correos enviados (basados en las imágenes)
const mockEmails = [
  {
    id: 'email-1',
    to: 'gustavomenap434@gmail.com',
    subject: '[GOBIA] Contrato APROBADO - CO1.BDOS.848814',
    contractId: 'CO1.BDOS.848814',
    status: 'approved', // approved, alert, manual_review
    summary: {
      entity: 'PARQUES NACIONALES NATURALES DE COLOMBIA - DIRECCION TERRITORIAL AMAZONIA',
      contractor: 'INDUSTRIAS GUERRERO Y COMPAÑÍA S.A.S.',
      value: 17987916,
      riskScore: null,
      confidence: 80,
      priority: 'NORMAL',
      savingsMetric: 'Precio dentro del rango de mercado',
      link: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.848428'
    },
    sentAt: '2026-05-09T11:20:06-05:00',
    read: false
  },
  {
    id: 'email-2',
    to: 'gustavomenap434@gmail.com',
    subject: '[GOBIA] ALERTA RIESGO DE CORRUPCIÓN - CO1.BDOS.848814',
    contractId: 'CO1.BDOS.848814',
    status: 'alert',
    summary: {
      entity: 'No disponible',
      contractor: 'INDUSTRIAS GUERRERO Y COMPAÑÍA S.A.S.',
      value: 17987916,
      riskScore: 78,
      dictamen: 'FISCALIZAR',
      link: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=DTAM_NACION-CS_NO_020-2019'
    },
    sentAt: '2026-05-09T10:30:00-05:00',
    read: false
  },
  {
    id: 'email-3',
    to: 'gustavomenap434@gmail.com',
    subject: '[GOBIA] Informe de Análisis - CPS-2024-0622 (REVISIÓN MANUAL)',
    contractId: 'CPS-2024-0622',
    status: 'manual_review',
    summary: {
      entity: 'INSTITUTO DISTRITAL DE CIENCIA BIOTECNOLOGIA E INNOVACIÓN EN SALUD - IDCBIS',
      contractor: 'NATALIA RAGA RUIZ',
      value: 27600000,
      riskScore: 5,
      confidence: 95,
      priority: 'ALTA',
      savingsMetric: 'Precio dentro del rango de mercado',
      dictamenIA: 'APROBADO',
      justification: 'Proceso eficiente: El inicio inmediato es una práctica legal y recomendada...',
      link: null
    },
    sentAt: '2026-05-08T15:45:00-05:00',
    read: true
  }
];

export const useEmailHistory = () => {
  const [emails, setEmails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar datos mock al iniciar (simular historial)
  useEffect(() => {
    setEmails(mockEmails);
    setUnreadCount(mockEmails.filter(e => !e.read).length);
  }, []);

  // Marcar un correo como leído
  const markAsRead = (id) => {
    setEmails(prev =>
      prev.map(email =>
        email.id === id ? { ...email, read: true } : email
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marcar todos como leídos
  const markAllAsRead = () => {
    setEmails(prev =>
      prev.map(email => ({ ...email, read: true }))
    );
    setUnreadCount(0);
  };

  // Función para enviar un nuevo correo (simulado, añadir al historial)
  const sendEmail = (emailData) => {
    const newEmail = {
      id: `email-${Date.now()}`,
      ...emailData,
      sentAt: new Date().toISOString(),
      read: false
    };
    setEmails(prev => [newEmail, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  return {
    emails,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendEmail
  };
};