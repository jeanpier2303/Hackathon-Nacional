import { motion } from 'framer-motion';
import { useContracts } from '../hooks/useContracts';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ContractsTable } from '../components/dashboard/ContractsTable';
import RedFlagsChart from '../components/dashboard/RedFlagsChart';
import RiskScoreGauge from '../components/dashboard/RiskScoreGauge';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import { TableSkeleton } from '../components/common/Skeleton';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { contracts, summary, loading, error, refetch } = useContracts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (error) return (
    <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-sm sm:text-base">Error: {error}</span>
      <button onClick={handleRefresh} className="px-3 py-1 bg-red-100 dark:bg-red-800 rounded-lg text-sm">Reintentar</button>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Visión general de riesgos y alertas</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="p-2 rounded-full glass-card hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats grid - 2 columnas en móvil, 4 en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <motion.div variants={itemVariants} className="col-span-1">
          <StatsCard title="Contratos auditados" value={summary?.totalContracts || 0} iconName="FileCheck" color="purple" tooltip="Total de contratos cargados en el sistema" />
        </motion.div>
        <motion.div variants={itemVariants} className="col-span-1">
          <StatsCard title="Alertas detectadas" value={summary?.totalRedFlags || 0} iconName="AlertTriangle" color="red" tooltip="Número total de banderas rojas" />
        </motion.div>
        <motion.div variants={itemVariants} className="col-span-1">
          <StatsCard title="Riesgo promedio" value={`${summary?.avgRiskScore || 0}%`} iconName="Gauge" color="yellow" tooltip="Promedio de riesgo de todos los contratos" />
        </motion.div>
        <motion.div variants={itemVariants} className="col-span-1">
          <StatsCard title="Alto riesgo" value={summary?.highRiskCount || 0} iconName="ShieldAlert" color="orange" tooltip="Contratos con riesgo >= 70%" />
        </motion.div>
      </div>

      {/* Gráficos principales - columna en móvil, fila en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div variants={itemVariants}>
          <RiskScoreGauge score={summary?.avgRiskScore || 0} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AlertsPanel />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <RedFlagsChart distribution={summary?.flagsDistribution || {}} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Contratos recientes</h2>
          <a href="/contracts" className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 transition flex items-center gap-1">
            Ver todos → 
          </a>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          <ContractsTable
            contracts={contracts.slice(0, 5)}
            pagination={null}
            onPageChange={() => {}}
            globalFilter=""
            onGlobalFilterChange={() => {}}
            hideSearch
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;