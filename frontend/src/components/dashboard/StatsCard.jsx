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

export const StatsCard = ({ title, value, iconName, color = 'purple', tooltip = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl p-3 sm:p-5 hover:shadow-xl transition-all border border-purple-500/20 relative group"
    >
      {tooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
          {tooltip}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl sm:text-3xl font-bold mt-0.5 sm:mt-1 text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]}`}>
          <Icon name={iconName} size={18} className="sm:size-24" />
        </div>
      </div>
      <div className="mt-2 sm:mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};