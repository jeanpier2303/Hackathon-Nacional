import React from 'react';
import Card from '../common/Card';

const RiskScoreGauge = ({ score }) => {
  const percentage = Math.min(100, Math.max(0, score));
  const color = percentage >= 70 ? '#EF4444' : percentage >= 40 ? '#F59E0B' : '#22C55E';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-5 h-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Riesgo Promedio General</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="60" cy="60" r="45" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>{percentage}%</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 text-center text-xs text-gray-500">
          <span>Bajo (0-39%)</span>
          <span>Medio (40-69%)</span>
          <span>Alto (70-100%)</span>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          Basado en inteligencia predictiva
        </p>
      </div>
    </Card>
  );
};

export default RiskScoreGauge;