
import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { YieldDataPoint } from '@/lib/types';

interface YieldChartProps {
  data: YieldDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border border-white/10 text-sm">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-[#14F195] flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#14F195] mr-2"></span>
          Aggressive: {payload[0].value.toFixed(2)}%
        </p>
        <p className="text-[#9945FF] flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#9945FF] mr-2"></span>
          Conservative: {payload[1].value.toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};

const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-xl font-semibold mb-6">Historical Monthly Yield</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              domain={[0, 'dataMax + 0.5']}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="aggressive" 
              name="Aggressive"
              stroke="#14F195" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#14F195', stroke: 'rgba(20, 241, 149, 0.3)', strokeWidth: 4 }}
              dot={{ r: 3, fill: '#14F195' }}
            />
            <Line 
              type="monotone" 
              dataKey="conservative" 
              name="Conservative"
              stroke="#9945FF" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#9945FF', stroke: 'rgba(153, 69, 255, 0.3)', strokeWidth: 4 }}
              dot={{ r: 3, fill: '#9945FF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default YieldChart;
