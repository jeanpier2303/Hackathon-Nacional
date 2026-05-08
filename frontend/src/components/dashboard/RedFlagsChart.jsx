import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4'];

const RedFlagsChart = ({ distribution }) => {
  const data = Object.entries(distribution || {}).map(([name, value]) => ({
    name: name === 'unique_bidder' ? 'Único proponente' : name === 'overcost' ? 'Sobrecosto' : name === 'unusual_deadline' ? 'Plazo inusual' : 'Cláusula a medida',
    value,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribución de Alertas</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">No hay datos de alertas</div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribución de Alertas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={{ stroke: '#9CA3AF' }} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RedFlagsChart;