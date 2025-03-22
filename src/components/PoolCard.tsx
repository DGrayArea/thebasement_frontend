
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pool } from '@/lib/types';
import { ArrowRight, Info, TrendingUp, DollarSign } from 'lucide-react';

interface PoolCardProps {
  pool: Pool;
  isConnected: boolean;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, isConnected }) => {
  const [amount, setAmount] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsSubmitting(true);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setDepositSuccess(true);
    
    // Reset success message after a delay
    setTimeout(() => {
      setDepositSuccess(false);
      setAmount('');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`glass rounded-2xl transition-all duration-500 transform ${isHovered ? 'scale-[1.02]' : 'scale-1'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ibf/10 opacity-50 rounded-2xl"></div>
        
        <div className="p-6">
          {/* Pool Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/10 mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{pool.name} Pool</span>
              </div>
              <h3 className="text-xl font-semibold">{pool.description}</h3>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm opacity-60">Current APY</div>
              <div className="text-2xl font-bold text-ibf">{pool.apy}%</div>
            </div>
          </div>
          
          {/* Pool Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-xs opacity-60 mb-1">TVL</div>
              <div className="font-semibold">${pool.tvl.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-xs opacity-60 mb-1">Min Deposit</div>
              <div className="font-semibold">{pool.minDeposit} {pool.depositToken}</div>
            </div>
          </div>
          
          <div className="text-sm opacity-70 mb-6">
            <Info className="inline-block w-3 h-3 mr-1" />
            {pool.strategyDescription}
          </div>
          
          {/* Deposit Form */}
          {isConnected ? (
            <form onSubmit={handleDeposit}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min ${pool.minDeposit} ${pool.depositToken}`}
                    className="pr-16 bg-white/5 border-white/10 focus:border-ibf"
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium opacity-60">
                    {pool.depositToken}
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={!amount || parseFloat(amount) < pool.minDeposit || isSubmitting}
                  className={`transition-all duration-300 ${
                    !amount || parseFloat(amount) < pool.minDeposit
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-ibf hover:bg-ibf/90'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Processing
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Deposit <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
              
              {depositSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-400 flex items-center justify-center bg-green-400/10 py-2 rounded-lg"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Deposit successful! Your funds are now generating yield.
                </motion.div>
              )}
            </form>
          ) : (
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-sm opacity-70">Connect your wallet to deposit</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Accent glow effect */}
      <div className={`absolute inset-0 bg-ibf/20 blur-2xl -z-10 transition-opacity duration-700 ${
        isHovered ? 'opacity-70' : 'opacity-0'
      }`}></div>
    </motion.div>
  );
};

export default PoolCard;
