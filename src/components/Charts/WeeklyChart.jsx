import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const WeeklyChart = ({ data, type = 'expense' }) => {
  const getBarColor = (index) => {
    return type === 'expense' 
      ? (index % 2 === 0 ? '#EF4444' : '#FCA5A5')
      : (index % 2 === 0 ? '#10B981' : '#86EFAC');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.day}
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="text-sm font-medium text-gray-900">
              ₹{payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12, fill: "#555" }} 
            stroke="none" 
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#555" }} 
            stroke="none" 
          />
          <Tooltip content={CustomTooltip} />
          <Bar
            dataKey="amount"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;