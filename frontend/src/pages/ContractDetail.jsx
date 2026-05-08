import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Building,
  FileText,
  Cpu,
  ShieldCheck,
  ExternalLink,
  BadgeDollarSign,
  Scale,
  UserCheck
} from 'lucide-react';
import { fetchContractById, analizarContrato } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  formatCurrency,
  formatDate,
  getRiskColor
} from '../utils/formatters';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchContractById(id)
      .then(data => {
        setContract(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await analizarContrato(id);
      const updatedContract = await fetchContractById(id);
      setContract(updatedContract);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando contrato...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-500">Contrato no encontrado</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Volver</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-2"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold break-words">
              {contract.processNumber}
            </h1>
            <div className="flex flex-wrap gap-3 mt-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Building size={16} />
                <span className="break-words">{contract.entity}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{contract.contractType}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
            {contract.riskScore > 0 ? (
              <div className={`px-4 py-2 rounded-2xl font-bold text-lg shadow-md ${getRiskColor(contract.riskScore)} bg-opacity-10 bg-gray-100 dark:bg-gray-800`}>
                Riesgo {contract.riskScore}%
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 text-sm sm:text-base"
              >
                {analyzing ? 'Analizando contrato...' : 'Calcular análisis de riesgo'}
              </button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Información General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs uppercase text-gray-500">Contratista</p>
              <p className="font-semibold break-words">{contract.contractor}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Valor contrato</p>
              <p className="font-semibold text-green-600 text-base sm:text-lg break-words">{formatCurrency(contract.value)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Fecha inicio</p>
              <p>{formatDate(contract.date)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Fecha fin</p>
              <p>{contract.endDate ? formatDate(contract.endDate) : 'No registrada'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={20} />
            <h3 className="font-bold">Dictamen IA</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Resultado</p>
              <p className="font-bold text-base sm:text-lg break-words">{contract.dictamenFinal}</p>
            </div>
            <div>
              <p className="text-sm leading-relaxed">{contract.resumenEjecutivo}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeDollarSign size={18} />
            <h3 className="font-semibold">Análisis financiero</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm">
            <p><strong>Evaluación:</strong> {contract.evaluacionPrecio}</p>
            <p><strong>Perfil riesgo:</strong> {contract.perfilRiesgo}</p>
            <p><strong>Sobre costo:</strong> {contract.sobrecostoDetectado ? 'Detectado' : 'No detectado'}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={18} />
            <h3 className="font-semibold">Cumplimiento legal</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm">
            <p>Transparencia: {contract.cumplimientoTransparencia}</p>
            <p>Economía: {contract.cumplimientoEconomia}</p>
            <p>Responsabilidad: {contract.cumplimientoResponsabilidad}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck size={18} />
            <h3 className="font-semibold">Contratista</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm">
            <p>Tipo: {contract.analisisContratista?.tipo || 'N/A'}</p>
            <p>Idoneidad: {contract.analisisContratista?.idoneidad || 'N/A'}</p>
            <p>Experiencia: {contract.analisisContratista?.experiencia_requerida || 'N/A'}</p>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <AlertTriangle size={20} />
          <h2 className="text-lg sm:text-xl font-semibold">Banderas rojas detectadas</h2>
        </div>
        <div className="space-y-3">
          {contract.flags.length > 0 ? (
            contract.flags.map((flag, index) => (
              <div key={index} className="p-3 sm:p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 text-sm">
                {flag}
              </div>
            ))
          ) : (
            <div className="p-3 sm:p-4 rounded-xl bg-green-50 border border-green-200 text-sm">
              No se detectaron alertas críticas
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <ShieldCheck size={20} />
          <h2 className="text-lg sm:text-xl font-semibold">Recomendaciones IA</h2>
        </div>
        <div className="space-y-3">
          {contract.recomendaciones?.map((item, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm">
              {item}
            </div>
          ))}
        </div>
      </Card>

      {contract.processUrl && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base sm:text-lg">Proceso SECOP</h2>
              <p className="text-xs sm:text-sm text-gray-500">Abrir proceso oficial</p>
            </div>
            <a
              href={contract.processUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            >
              Abrir SECOP
              <ExternalLink size={16} />
            </a>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ContractDetail;