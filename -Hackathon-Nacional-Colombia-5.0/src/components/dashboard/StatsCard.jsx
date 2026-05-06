import { motion } from 'framer-motion';
import Icon from '../common/Icon';

const colorClasses = {
  purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  red: 'bg-red-500/15 text-red-600 dark:text-red-400',
  green: 'bg-green-500/15 text-green-600 dark:text-green-400',
  yellow: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  orange: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
};

export const StatsCard = ({ title, value, iconName, color = 'purple' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl p-5 hover:shadow-xl transition-all border border-purple-500/20 dark:border-purple-500/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-800 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} shadow-inner`}>
          <Icon name={iconName} size={24} />
        </div>
      </div>
      {/* mini gráfico decorativo (simulado) */}
      <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-purple-500 rounded-full"></div>
      </div>
    </motion.div>
  );
};