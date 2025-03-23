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
  ResponsiveContainer,
  Area
} from 'recharts';
import { YieldDataPoint } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface YieldChartProps {
  data: YieldDataPoint[];
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
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

const YieldChart: React.FC<YieldChartProps> = ({ data, timeframe, setTimeframe }) => {
  const filteredData = data.filter(point => {
    const date = new Date(point.date);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Yield Performance</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-3 py-1 ${
              timeframe === '1W' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setTimeframe('1W')}
          >
            1W
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-3 py-1 ${
              timeframe === '1M' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setTimeframe('1M')}
          >
            1M
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-3 py-1 ${
              timeframe === '1Y' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setTimeframe('1Y')}
          >
            1Y
          </Button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopColor-opacity={0.8} />
                <stop offset="100%" stopColor="#9333ea" stopColor-opacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#ffffff60"
              tick={{ fill: '#ffffff60' }}
              tickLine={{ stroke: '#ffffff60' }}
            />
            <YAxis 
              stroke="#ffffff60"
              tick={{ fill: '#ffffff60' }}
              tickLine={{ stroke: '#ffffff60' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#2563eb"
              fill="url(#yieldGradient)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default YieldChart;
