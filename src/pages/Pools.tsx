import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Pool } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { MOCK_POOL_ADDRESSES } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import WalletGuard from '@/components/WalletGuard';

const MOCK_POOLS: Pool[] = [
  {
    id: "1",
    name: "Solana Staking Pool",
    description: "Low-risk Solana staking pool",
    apy: 8.5,
    tvl: 250000,
    depositToken: "SOL",
    strategyDescription: "Stake SOL with top validators",
    minDeposit: 1,
    depositCap: 1000,
    poolAddress: new PublicKey(MOCK_POOL_ADDRESSES.SOLANA_POOL),
    tokenMint: new PublicKey("So11111111111111111111111111111111111111112"),
  },
  {
    id: "2",
    name: "USDC Yield Pool",
    description: "Stable yield generation with USDC",
    apy: 12.2,
    tvl: 500000,
    depositToken: "USDC",
    strategyDescription: "Lending and liquidity provision",
    minDeposit: 100,
    depositCap: 10000,
    poolAddress: new PublicKey(MOCK_POOL_ADDRESSES.USDC_POOL),
    tokenMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  }
];

const Pools = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate fetching pools data
    const fetchPools = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch pools from the blockchain
        setPools(MOCK_POOLS);
      } catch (error) {
        console.error('Error fetching pools:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch pools. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  const handlePoolSelect = (pool: Pool) => {
    navigate(`/dashboard?pool=${pool.id}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Investment Pools</h1>
        <p className={`text-sm mb-6 sm:mb-8 ${
          theme === 'dark' ? 'text-white/70' : 'text-gray-600'
        }`}>
          Select a pool to deposit your assets and start generating yield.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {pools.map((pool) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className={`backdrop-blur-sm border p-4 sm:p-6 h-full ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-1">{pool.name}</h3>
                          <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>
                            {pool.description}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] rounded-md px-3 py-1 text-white font-medium text-sm">
                          {pool.apy}% APY
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6 flex-grow">
                      <div className={`rounded-lg p-3 sm:p-4 ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                      }`}>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                            }`}>Total Value Locked</p>
                            <p className="font-semibold">${pool.tvl.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                            }`}>Deposit Token</p>
                            <p className="font-semibold">{pool.depositToken}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                            }`}>Minimum Deposit</p>
                            <p className="font-semibold">{pool.minDeposit} {pool.depositToken}</p>
                          </div>
                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                            }`}>Deposit Cap</p>
                            <p className="font-semibold">{pool.depositCap} {pool.depositToken}</p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-lg p-3 sm:p-4 ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                      }`}>
                        <p className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                        }`}>Strategy</p>
                        <p className="text-sm">{pool.strategyDescription}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] hover:from-[#0A3984] hover:to-[#3B1773] text-white w-full"
                      onClick={() => handlePoolSelect(pool)}
                    >
                      {publicKey ? `Deposit to ${pool.name}` : 'Connect Wallet to Deposit'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Pools;
