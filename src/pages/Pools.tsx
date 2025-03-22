
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { MOCK_POOLS } from '@/lib/constants';
import { Pool } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
          <h1 className="text-3xl font-bold mb-2">Investment Pools</h1>
          <p className="text-sm opacity-70 mb-8">
            Select a pool to deposit your assets and start generating yield.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="solana-loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pools.map((pool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="glass p-6 h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{pool.name} Pool</h3>
                            <p className="text-sm opacity-70">{pool.description}</p>
                          </div>
                          <div className="bg-white/10 rounded-md px-3 py-1 text-ibf font-medium text-sm">
                            {pool.apy}% APY
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6 flex-grow">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs opacity-70 mb-1">Total Value Locked</p>
                              <p className="font-semibold">${pool.tvl.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70 mb-1">Deposit Token</p>
                              <p className="font-semibold">{pool.depositToken}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70 mb-1">Minimum Deposit</p>
                              <p className="font-semibold">{pool.minDeposit} {pool.depositToken}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70 mb-1">Deposit Cap</p>
                              <p className="font-semibold">${pool.depositCap.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs opacity-70 mb-2">Strategy</p>
                          <p className="text-sm">{pool.strategyDescription}</p>
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
        <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
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
