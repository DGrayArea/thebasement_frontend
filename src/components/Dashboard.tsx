import React from 'react';
import { motion } from 'framer-motion';
import PoolCard from './PoolCard';
import YieldChart from './YieldChart';
import TransactionHistory from './TransactionHistory';
import { MOCK_POOLS, MOCK_TRANSACTIONS, MOCK_YIELD_DATA } from '@/lib/constants';
import { ArrowRight, Gem, TrendingUp, History } from 'lucide-react';

interface DashboardProps {
  isConnected: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isConnected }) => {
  return (
    <div className="py-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block px-3 py-1 bg-white/5 rounded-full text-sm mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Beta Access <span className="opacity-60">•</span> Solana Devnet
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-white"
        >
          Generate yield with IBF
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-2xl mx-auto text-lg text-white/70 mb-8"
        >
          Deposit your assets into our optimized yield pools and earn passive income through 
          our institutional-grade strategies on Solana.
        </motion.p>

        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="inline-flex items-center text-sm opacity-60">
              <Gem className="w-4 h-4 mr-2" />
              Connect your wallet to get started
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Overview */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60 mb-1">Your Deposits</div>
                <div className="text-3xl font-bold text-white">$0.00</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60 mb-1">Earned Yield</div>
                <div className="text-3xl font-bold text-white">$0.00</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60 mb-1">Transactions</div>
                <div className="text-3xl font-bold text-white">0</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pools Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl font-semibold text-white">Available Pools</h2>
          <div className="text-sm text-white/60">2 pools</div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_POOLS.map((pool) => (
            <PoolCard key={pool.id} pool={pool} isConnected={isConnected} />
          ))}
        </div>
      </div>

      {/* Charts and Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YieldChart data={MOCK_YIELD_DATA} />
        <TransactionHistory 
          transactions={isConnected ? MOCK_TRANSACTIONS : []} 
          isLoading={false} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
