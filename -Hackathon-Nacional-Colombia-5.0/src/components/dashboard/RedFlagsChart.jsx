import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

const RedFlagsChart = ({ distribution }) => {
  const data = Object.entries(distribution || {}).map(([name, value]) => ({
    name: name === 'unique_bidder' ? 'Único proponente' : name === 'overcost' ? 'Sobrecosto' : name === 'unusual_deadline' ? 'Plazo inusual' : 'Cláusula a medida',
    value,
  }));
  const COLORS = ['#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4'];

  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribución de Alertas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RedFlagsChart;