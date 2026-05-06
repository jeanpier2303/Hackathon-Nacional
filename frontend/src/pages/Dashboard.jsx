import { motion } from 'framer-motion';
import { useContracts } from '../hooks/useContracts';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ContractsTable } from '../components/dashboard/ContractsTable';
import RedFlagsChart from '../components/dashboard/RedFlagsChart';
import RiskScoreGauge from '../components/dashboard/RiskScoreGauge';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import { TableSkeleton } from '../components/common/Skeleton';

const Dashboard = () => {
  const contracts = [];
  const loading = false;
  const error = null;

  const summary = {
    totalContracts: 120,
    totalRedFlags: 18,
    avgRiskScore: 37,
    highRiskCount: 5,
    flagsDistribution: {
      "Contratación directa": 10,
      "Sobreprecio": 5,
      "Riesgo documental": 3
    }
  };

  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg">Error: {error}</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.4 } }
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
      className="space-y-6"
    >
      {/* KPIs con diseño premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <StatsCard title="Contratos auditados" value={summary?.totalContracts || 0} iconName="FileCheck" color="purple" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Alertas detectadas" value={summary?.totalRedFlags || 0} iconName="AlertTriangle" color="red" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Riesgo promedio" value={`${summary?.avgRiskScore || 0}%`} iconName="Gauge" color="yellow" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Alto riesgo" value={summary?.highRiskCount || 0} iconName="ShieldAlert" color="orange" />
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <RiskScoreGauge score={summary?.avgRiskScore || 0} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AlertsPanel />
        </motion.div>
      </div>

      {/* Gráfico de distribución */}
      <motion.div variants={itemVariants}>
        <RedFlagsChart distribution={summary?.flagsDistribution || {}} />
      </motion.div>

      {/* Tabla de contratos recientes */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Contratos recientes</h2>
          <a href="/contracts" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 transition flex items-center gap-1">
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