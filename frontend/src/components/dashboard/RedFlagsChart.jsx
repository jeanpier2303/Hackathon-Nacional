import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#10B981'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value} contratos</p>
        <p className="text-gray-400">{((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% del total</p>
      </div>
    );
  }
  return null;
};

const RedFlagsChart = ({ distribution }) => {
  const total = Object.values(distribution || {}).reduce((a, b) => a + b, 0);
  const data = Object.entries(distribution || {}).map(([name, value]) => ({
    name: name === 'unique_bidder' ? 'Único proponente' : name === 'overcost' ? 'Sobrecosto' : name === 'unusual_deadline' ? 'Plazo inusual' : 'Cláusula a medida',
    value,
    total,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Distribución de Alertas</h3>
        <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-gray-500 gap-2 sm:gap-3">
          <div className="p-3 sm:p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <svg width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-sm sm:text-base">No hay alertas registradas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5 transition-all hover:shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white flex flex-wrap justify-between items-center gap-2">
        Distribución de Alertas
        <span className="text-[10px] sm:text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{total} alertas</span>
      </h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-80">
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }} 
            outerRadius={80} 
            dataKey="value" 
            label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.3)" />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RedFlagsChart;