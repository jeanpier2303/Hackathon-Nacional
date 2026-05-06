import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, Calendar, DollarSign, Building, FileText, Cpu, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchContractById } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { formatCurrency, formatDate, getRiskColor, getFlagLabel } from '../utils/formatters';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState('');

  useEffect(() => {
    fetchContractById(id).then(data => {
      setContract(data);
      let explanation = `Análisis inteligente: El contrato presenta ${data.flags.length} banderas de riesgo. `;
      if (data.riskScore > 70) {
        explanation += 'Alta probabilidad de opacidad. Se recomienda revisión profunda de los siguientes factores: ';
        explanation += data.flags.map(f => getFlagLabel(f)).join(', ');
      } else if (data.riskScore > 40) {
        explanation += `Riesgo moderado. Factores clave: ${data.flags.join(', ') || 'ninguna anomalía destacable.'}`;
      } else {
        explanation += 'Riesgo bajo. El proceso parece transparente.';
      }
      setAiExplanation(explanation);
      setLoading(false);
    }).catch(err => { setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Cargando contrato...</div>;
  if (!contract) return <div className="p-8 text-center">No encontrado</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft size={16} className="mr-2" /> Volver
      </Button>
      
      <Card className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{contract.processNumber}</h1>
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Building size={16} />
              <span>{contract.entity}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <FileText size={16} />
              <span>{contract.contractType}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-lg shadow-md ${getRiskColor(contract.riskScore)} bg-opacity-10 bg-current`}>
            Riesgo: {contract.riskScore}%
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText size={20} /> Detalles del contrato</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase">Contratista</label>
              <p className="font-medium">{contract.contractor}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase">Valor</label>
              <p className="font-medium text-lg text-green-600 dark:text-green-400">{formatCurrency(contract.value)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase">Fecha inicio</label>
              <p className="flex items-center gap-1"><Calendar size={14} /> {formatDate(contract.date)}</p>
            </div>
            {contract.endDate && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase">Fecha fin</label>
                <p className="flex items-center gap-1"><Calendar size={14} /> {formatDate(contract.endDate)}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Cpu className="text-purple-600" size={18} />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Inteligencia IA</h3>
          </div>
          <p className="text-sm leading-relaxed">{aiExplanation}</p>
          <div className="mt-4 pt-3 border-t border-purple-200 dark:border-purple-800/30 text-xs text-gray-500">
            Confianza del análisis: <span className="font-bold">{contract.riskScore > 70 ? 'Media' : 'Alta'}</span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Clock size={20} /> Línea de tiempo</h2>
        <div className="relative space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute -left-8 mt-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            <div className="flex gap-4">
              <Calendar size={18} className="text-gray-500" />
              <div>
                <p className="font-medium">Fecha de creación</p>
                <p className="text-sm text-gray-500">{formatDate(contract.date)}</p>
              </div>
            </div>
          </div>
          {contract.endDate && (
            <div className="relative">
              <div className="absolute -left-8 mt-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div className="flex gap-4">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="font-medium">Fecha de finalización</p>
                  <p className="text-sm text-gray-500">{formatDate(contract.endDate)}</p>
                </div>
              </div>
            </div>
          )}
          <div className="relative">
            <div className={`absolute -left-8 mt-1 w-4 h-4 ${contract.flags.length ? 'bg-red-500' : 'bg-green-500'} rounded-full border-2 border-white dark:border-gray-800`}></div>
            <div className="flex gap-4">
              <AlertTriangle size={18} className="text-gray-500" />
              <div>
                <p className="font-medium">Alertas detectadas</p>
                <p className="text-sm text-gray-500">{contract.flags.length ? contract.flags.map(f => getFlagLabel(f)).join(', ') : 'Ninguna'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContractDetail;