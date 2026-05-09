// src/components/layout/EmailHistoryPanel.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, CheckCircle, AlertTriangle, Clock, User, Building, 
  DollarSign, TrendingUp, Eye, EyeOff, ExternalLink, X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useModal } from '../../contexts/ModalContext';

const EmailHistoryPanel = ({ emails, unreadCount, markAsRead, markAllAsRead, onClose }) => {
  const { openContractModal } = useModal();
  const [selectedEmail, setSelectedEmail] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'manual_review':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Mail size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'alert': return 'Alerta';
      case 'manual_review': return 'Revisión manual';
      default: return 'Enviado';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'alert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'manual_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    if (!email.read) markAsRead(email.id);
  };

  const handleContractClick = (contractId) => {
    if (contractId) {
      openContractModal(contractId);
      setSelectedEmail(null);
      onClose();
    }
  };

  return (
    <>
      <div className="w-80 sm:w-96 max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-purple-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Correos enviados ({unreadCount} no leídos)
            </h3>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-600 hover:underline px-2 py-1"
              >
                Marcar todos
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Lista de correos */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {emails.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No hay correos enviados</div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  !email.read ? 'bg-purple-50/50 dark:bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {getStatusIcon(email.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Para: {email.to}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(email.status)}`}>
                        {getStatusText(email.status)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(email.sentAt)}
                      </span>
                    </div>
                  </div>
                  {!email.read && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalle del correo */}
      <AnimatePresence>
        {selectedEmail && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedEmail(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800">
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 dark:text-white">Detalle del correo</h3>
                  <button onClick={() => setSelectedEmail(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Para</p>
                    <p className="text-sm font-medium">{selectedEmail.to}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Asunto</p>
                    <p className="text-sm font-medium">{selectedEmail.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(selectedEmail.status)}`}>
                      {getStatusText(selectedEmail.status)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Resumen del contrato</p>
                    <div className="space-y-2 text-sm">
                      {selectedEmail.summary.entity && (
                        <div className="flex items-start gap-2">
                          <Building size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{selectedEmail.summary.entity}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{selectedEmail.summary.contractor}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <DollarSign size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{formatCurrency(selectedEmail.summary.value)}</span>
                      </div>
                      {selectedEmail.summary.riskScore !== undefined && (
                        <div className="flex items-start gap-2">
                          <TrendingUp size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>Riesgo: {selectedEmail.summary.riskScore}%</span>
                        </div>
                      )}
                      {selectedEmail.summary.confidence && (
                        <div className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>Confiabilidad: {selectedEmail.summary.confidence}%</span>
                        </div>
                      )}
                      {selectedEmail.summary.dictamenIA && (
                        <div className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Dictamen IA: {selectedEmail.summary.dictamenIA}</span>
                        </div>
                      )}
                      {selectedEmail.summary.justification && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                          {selectedEmail.summary.justification}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedEmail.contractId && (
                    <button
                      onClick={() => handleContractClick(selectedEmail.contractId)}
                      className="w-full mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                    >
                      Ver contrato <ExternalLink size={14} />
                    </button>
                  )}
                  {selectedEmail.summary.link && (
                    <a
                      href={selectedEmail.summary.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-sm text-purple-600 hover:underline"
                    >
                      Abrir en SECOP →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailHistoryPanel;