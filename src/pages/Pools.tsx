import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Pool {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  depositToken: string;
  minDeposit: number;
  depositCap: number;
  strategyDescription: string;
}

const MOCK_POOLS: Pool[] = [
  {
    id: "1",
    name: "Solana Staking Pool",
    apy: 8.5,
    tvl: 250000,
    depositToken: "SOL",
    minDeposit: 1,
    depositCap: 1000000,
    strategyDescription: "Stake your SOL to earn rewards through validator delegation and MEV opportunities."
  },
  {
    id: "2",
    name: "USDC Yield Pool",
    apy: 12.2,
    tvl: 500000,
    depositToken: "USDC",
    minDeposit: 100,
    depositCap: 5000000,
    strategyDescription: "Earn yield on your USDC through lending protocols and liquidity provision."
  }
];

const Pools = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching pools data
    const fetchPools = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPools(MOCK_POOLS);
      setLoading(false);
    };

    fetchPools();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ibf-dark to-black text-white">
      <Header />
      
      <main className="container mx-auto pt-24 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Investment Pools</h1>
          <p className="text-sm text-white/70 mb-6 sm:mb-8">
            Select a pool to deposit your assets and start generating yield.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="solana-loader"></div>
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
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 sm:p-6 h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-1 text-white">{pool.name} Pool</h3>
                            <p className="text-sm text-white/70">{pool.strategyDescription}</p>
                          </div>
                          <div className="bg-white/10 rounded-md px-3 py-1 text-ibf font-medium text-sm">
                            {pool.apy}% APY
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6 flex-grow">
                        <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs text-white/70 mb-1">Total Value Locked</p>
                              <p className="font-semibold text-white">${pool.tvl.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/70 mb-1">Deposit Token</p>
                              <p className="font-semibold text-white">{pool.depositToken}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/70 mb-1">Minimum Deposit</p>
                              <p className="font-semibold text-white">{pool.minDeposit} {pool.depositToken}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/70 mb-1">Deposit Cap</p>
                              <p className="font-semibold text-white">${pool.depositCap.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="bg-gradient-to-r from-solana to-solana-secondary hover:opacity-90 transition-all duration-300 w-full"
                        onClick={() => navigate(`/dashboard?pool=${pool.id}`)}
                      >
                        Deposit to {pool.name} Pool
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      
      <footer className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <div>© 2025 IBF Protocol. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-ibf transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Docs</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pools;
