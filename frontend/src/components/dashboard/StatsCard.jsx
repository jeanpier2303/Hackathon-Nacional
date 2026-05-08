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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-xl p-4 sm:p-5 hover:shadow-xl transition-all border border-purple-500/20"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 text-gray-800 dark:text-white break-words">
            {value}
          </p>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} flex-shrink-0 ml-3`}>
          <Icon name={iconName} size={20} sm:size={24} />
        </div>
      </div>
      <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-purple-500 rounded-full" />
      </div>
    </motion.div>
  );
};