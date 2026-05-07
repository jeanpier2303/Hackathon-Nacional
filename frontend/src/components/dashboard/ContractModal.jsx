import { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  Calendar,
  Building,
  FileText,
  Cpu,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Hash,
  User,
  Download,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchContractById } from '../../services/api';
import {
  formatCurrency,
  formatDate,
  getFlagLabel
} from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ContractModal = ({ contractId, isOpen, onClose }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen && contractId) {
      setLoading(true);
      setError(null);
      fetchContractById(contractId)
        .then((data) => {
          setContract(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setContract(null);
    }
  }, [contractId, isOpen]);

  const getAiExplanation = () => {
    if (!contract) return '';
    const flagsCount = contract.flags?.length || 0;
    let explanation = `Análisis inteligente: El contrato presenta ${flagsCount} bandera${flagsCount !== 1 ? 's' : ''} de riesgo. `;
    if (contract.riskScore > 70) {
      explanation += 'Alta probabilidad de opacidad. Se recomienda revisión profunda de los siguientes factores: ';
      explanation += contract.flags?.map((f) => getFlagLabel(f)).join(', ') || 'Sin detalles';
    } else if (contract.riskScore > 40) {
      explanation += `Riesgo moderado. Factores clave: ${
        flagsCount
          ? contract.flags?.map((f) => getFlagLabel(f)).join(', ')
          : 'ninguna anomalía destacable.'
      }`;
    } else {
      explanation += 'Riesgo bajo. El proceso parece transparente.';
    }
    return explanation;
  };

  const getRiskFactors = () => {
    if (!contract) return [];
    const factors = [];
    const value = contract.value;
    if (value > 200000000) factors.push({ name: 'Valor elevado', impact: 'Alto', description: 'El monto del contrato supera los 200 millones, lo que incrementa el riesgo de corrupción.' });
    if (value > 50000000 && value <= 200000000) factors.push({ name: 'Valor moderado', impact: 'Medio', description: 'Monto significativo que requiere supervisión.' });
    if (contract.flags.includes('unique_bidder')) factors.push({ name: 'Único proponente', impact: 'Alto', description: 'Solo un oferente, ausencia de competencia.' });
    if (contract.flags.includes('overcost')) factors.push({ name: 'Sobrecosto', impact: 'Alto', description: 'Valor por encima del promedio del mercado.' });
    if (contract.flags.includes('unusual_deadline')) factors.push({ name: 'Plazo inusual', impact: 'Medio', description: 'Plazos atípicos que pueden afectar la ejecución.' });
    if (contract.flags.includes('tailor_made_clause')) factors.push({ name: 'Cláusula a medida', impact: 'Alto', description: 'Condiciones hechas para favorecer a un contratista.' });
    if (factors.length === 0) factors.push({ name: 'Sin factores de riesgo significativos', impact: 'Bajo', description: 'El contrato parece regular.' });
    return factors;
  };

  const getChartData = () => {
    if (!contract) return [];
    const flagScores = {
      unique_bidder: 30,
      overcost: 40,
      unusual_deadline: 20,
      tailor_made_clause: 35
    };
    const data = Object.keys(flagScores).map(flag => ({
      name: flagScores[flag] ? getFlagLabel(flag).substring(0, 15) : flag,
      score: contract.flags.includes(flag) ? flagScores[flag] : 0,
      fullName: getFlagLabel(flag)
    })).filter(d => d.score > 0);
    if (data.length === 0) {
      return [{ name: 'Sin alertas', score: 0 }];
    }
    return data;
  };

  const getRiskDonutData = () => {
    if (!contract) return [];
    const riskLevel = contract.riskScore;
    return [
      { name: 'Riesgo detectado', value: riskLevel, color: riskLevel >= 70 ? '#EF4444' : riskLevel >= 40 ? '#F59E0B' : '#22C55E' },
      { name: 'Riesgo restante', value: 100 - riskLevel, color: '#E5E7EB' }
    ];
  };

  const exportToPDF = async () => {
    if (!modalContentRef.current) return;
    setGeneratingPdf(true);
    try {
      const element = modalContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`contrato_${contract.processNumber}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const rawContract = contract?.raw || {};
  const nitEntidad = rawContract.nit_entidad || contract?.nit_entidad || 'No disponible';
  const departamento = rawContract.departamento || 'No especificado';
  const ciudad = rawContract.ciudad || 'No especificada';
  const modalidad = rawContract.modalidad_de_contratacion || contract?.modalidad || 'No especificada';
  const estado = rawContract.estado_contrato || contract?.estado || 'Activo';
  const documentoProveedor = rawContract.documento_proveedor || contract?.documento_proveedor || 'No disponible';

  const riskFactors = getRiskFactors();
  const chartData = getChartData();
  const donutData = getRiskDonutData();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              {loading && (
                <div className="p-10 text-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles del contrato...</p>
                </div>
              )}
              {error && (
                <div className="p-10 text-center">
                  <p className="text-red-500 text-lg">Error: {error}</p>
                  <button onClick={onClose} className="mt-5 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Cerrar</button>
                </div>
              )}
              {contract && !loading && (
                <div ref={modalContentRef} className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{contract.processNumber}</h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex items-center gap-1"><Building size={14} /><span>{contract.entity}</span></div>
                        <span className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="flex items-center gap-1"><FileText size={14} /><span>{contract.contractType}</span></div>
                        <span className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="flex items-center gap-1"><MapPin size={14} /><span>{ciudad}, {departamento}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={exportToPDF} disabled={generatingPdf} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1 text-sm font-medium text-purple-600" title="Exportar a PDF">
                        <Download size={20} />
                        {generatingPdf ? 'Generando...' : 'PDF'}
                      </button>
                      <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X size={22} /></button>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 shadow-sm font-semibold text-gray-800" style={{ backgroundColor: contract.riskScore >= 70 ? '#fee2e2' : contract.riskScore >= 40 ? '#fef9c3' : '#dcfce7', color: '#1f2937' }}>
                    <Shield size={18} /><span>Riesgo: {contract.riskScore}%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><User size={12} /> Contratista</label><p className="text-base font-medium text-gray-800 dark:text-white mt-1">{contract.contractor}</p></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Hash size={12} /> Documento proveedor</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{documentoProveedor}</p></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Building size={12} /> NIT entidad</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{nitEntidad}</p></div>
                    </div>
                    <div className="space-y-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><CreditCard size={12} /> Valor</label><p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(contract.value)}</p></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><FileText size={12} /> Modalidad</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{modalidad}</p></div>
                    </div>
                    <div className="space-y-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> Estado</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-1"><CheckCircle size={14} className="text-green-500" />{estado}</p></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Fecha inicio</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatDate(contract.date)}</p></div>
                      {contract.endDate && <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider"><Calendar size={12} /> Fecha fin</label><p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatDate(contract.endDate)}</p></div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3"><TrendingUp size={16} /> Puntuación de riesgo por alerta</h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(value) => `${value}%`} labelFormatter={(label) => `Alerta: ${label}`} />
                          <Bar dataKey="score" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.score > 30 ? '#EF4444' : '#F59E0B'} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-gray-500 mt-2">* Puntuación estimada de cada alerta sobre el riesgo total</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3"><AlertCircle size={16} /> Distribución del riesgo</h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={donutData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {donutData.map((entry, index) => <PieCell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Info size={14} /> Factores que influyen en el riesgo</label>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {riskFactors.map((factor, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800 dark:text-white">{factor.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${factor.impact === 'Alto' ? 'bg-red-100 text-red-800' : factor.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{factor.impact}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><AlertTriangle size={14} /> Alertas detectadas</label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(contract.flags?.length || 0) > 0 ? contract.flags?.map((flag) => <span key={flag} className="px-3 py-1.5 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-medium">{getFlagLabel(flag)}</span>) : <span className="text-gray-500">Sin alertas</span>}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
                    <div className="flex items-center gap-2 mb-3"><Cpu size={20} className="text-purple-600 dark:text-purple-400" /><h3 className="font-semibold text-gray-800 dark:text-white">Inteligencia IA</h3></div>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{getAiExplanation()}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContractModal;