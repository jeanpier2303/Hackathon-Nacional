import React from 'react';
import Card from '../common/Card';
import { motion } from 'framer-motion';

const RiskScoreGauge = ({ score }) => {
  const percentage = Math.min(100, Math.max(0, score));
  const color = percentage >= 70 ? '#EF4444' : percentage >= 40 ? '#F59E0B' : '#22C55E';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-4 sm:p-5 h-full transition-all hover:shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white flex flex-wrap justify-between items-center gap-2">
        Riesgo Promedio General
        <span className="text-[10px] sm:text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">IA Predictiva</span>
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <motion.circle 
              cx="60" cy="60" r="45" fill="none" stroke={color} strokeWidth="8" 
              strokeDasharray={circumference} 
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-2xl sm:text-3xl font-bold" 
              style={{ color }}
            >
              {percentage}%
            </motion.span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 grid grid-cols-3 text-center gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700">Bajo</span>
          <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700">Medio</span>
          <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700">Alto</span>
        </div>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg text-center">
          Basado en inteligencia predictiva
        </p>
      </div>
    </Card>
  );
};

export default RiskScoreGauge;