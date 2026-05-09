import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, CheckCircle, AlertTriangle, Clock, User, Building, 
  DollarSign, TrendingUp, Eye, EyeOff, ExternalLink, X, 
  Calendar, FileText, Shield, Send
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useModal } from '../../contexts/ModalContext';

const EmailHistoryPanel = ({ emails, unreadCount, markAsRead, markAllAsRead, onClose }) => {
  const { openContractModal } = useModal();
  const [selectedEmail, setSelectedEmail] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={18} className="text-green-500" />;
      case 'alert': return <AlertTriangle size={18} className="text-red-500" />;
      case 'manual_review': return <Clock size={18} className="text-yellow-500" />;
      default: return <Mail size={18} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'alert': return 'Alerta de corrupción';
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
      {/* Panel principal más ancho y con mejor estructura */}
      <div className="w-[95vw] sm:w-[600px] md:w-[700px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Cabecera con contador y botones */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Send size={20} className="text-purple-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
              Historial de correos enviados
            </h3>
            {unreadCount > 0 && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                {unreadCount} nuevos
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-600 hover:underline px-2 py-1"
              >
                Marcar todos como leídos
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lista de correos con tarjetas mejoradas */}
        <div className="overflow-y-auto flex-1 custom-scrollbar p-3 space-y-3">
          {emails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="mx-auto mb-3 opacity-30" size={48} />
              <p>No hay correos enviados</p>
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  !email.read 
                    ? 'bg-purple-50/50 dark:bg-purple-900/20 border-l-4 border-l-purple-500 border-purple-200 dark:border-purple-800' 
                    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(email.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white break-words">
                        {email.subject}
                      </p>
                      {!email.read && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                          Nuevo
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={12} className="flex-shrink-0" />
                        <span className="truncate">Para: {email.to}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="flex-shrink-0" />
                        <span>{formatDate(email.sentAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building size={12} className="flex-shrink-0" />
                        <span className="truncate">{email.summary.entity || 'Entidad no especificada'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} className="flex-shrink-0" />
                        <span>{formatCurrency(email.summary.value)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(email.status)}`}>
                        {getStatusText(email.status)}
                      </span>
                      {email.summary.riskScore !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          email.summary.riskScore >= 70 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          Riesgo: {email.summary.riskScore}%
                        </span>
                      )}
                      {email.summary.confidence && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Confianza: {email.summary.confidence}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalle del correo (tamaño mejorado) */}
      <AnimatePresence>
        {selectedEmail && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setSelectedEmail(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800">
                {/* Cabecera del modal */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedEmail.status)}
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                      Detalle del correo
                    </h3>
                  </div>
                  <button onClick={() => setSelectedEmail(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                    <X size={22} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Información del destinatario */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Para</label>
                        <p className="text-base font-medium mt-1 break-words">{selectedEmail.to}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Fecha de envío</label>
                        <p className="text-base font-medium mt-1">{formatDate(selectedEmail.sentAt)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Asunto</label>
                        <p className="text-base font-medium mt-1 break-words">{selectedEmail.subject}</p>
                      </div>
                    </div>
                  </div>

                  {/* Resumen del contrato (estructura mejorada) */}
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <FileText size={18} /> Información del contrato
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500">Entidad contratante</label>
                          <p className="text-sm font-medium mt-0.5 break-words">{selectedEmail.summary.entity || 'No especificada'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Contratista</label>
                          <p className="text-sm font-medium mt-0.5 break-words">{selectedEmail.summary.contractor}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Valor del contrato</label>
                          <p className="text-lg font-bold text-green-600 mt-0.5">{formatCurrency(selectedEmail.summary.value)}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {selectedEmail.summary.riskScore !== undefined && (
                          <div>
                            <label className="text-xs text-gray-500">Score de riesgo</label>
                            <p className={`text-lg font-bold mt-0.5 ${selectedEmail.summary.riskScore >= 70 ? 'text-red-600' : selectedEmail.summary.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {selectedEmail.summary.riskScore}/100
                            </p>
                          </div>
                        )}
                        {selectedEmail.summary.confidence && (
                          <div>
                            <label className="text-xs text-gray-500">Confiabilidad</label>
                            <p className="text-lg font-bold text-blue-600 mt-0.5">{selectedEmail.summary.confidence}%</p>
                          </div>
                        )}
                        {selectedEmail.summary.priority && (
                          <div>
                            <label className="text-xs text-gray-500">Prioridad</label>
                            <p className="text-sm font-medium mt-0.5">{selectedEmail.summary.priority}</p>
                          </div>
                        )}
                        {selectedEmail.summary.savingsMetric && (
                          <div>
                            <label className="text-xs text-gray-500">Métrica ahorro</label>
                            <p className="text-sm mt-0.5">{selectedEmail.summary.savingsMetric}</p>
                          </div>
                        )}
                        {selectedEmail.summary.dictamenIA && (
                          <div>
                            <label className="text-xs text-gray-500">Dictamen IA</label>
                            <p className="text-sm font-semibold text-purple-600 mt-0.5">{selectedEmail.summary.dictamenIA}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Justificación (si existe) */}
                  {selectedEmail.summary.justification && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Shield size={18} /> Justificación del análisis
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm leading-relaxed">
                        {selectedEmail.summary.justification}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {selectedEmail.contractId && (
                      <button
                        onClick={() => handleContractClick(selectedEmail.contractId)}
                        className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition flex items-center justify-center gap-2 font-medium"
                      >
                        Ver contrato en el sistema <ExternalLink size={16} />
                      </button>
                    )}
                    {selectedEmail.summary.link && (
                      <a
                        href={selectedEmail.summary.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2 font-medium"
                      >
                        Abrir en SECOP <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
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