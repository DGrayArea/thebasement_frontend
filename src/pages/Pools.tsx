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
import SEO from '@/components/SEO';
import Loader from '@/components/Loader';

const MOCK_POOLS: Pool[] = [
  {
    id: "1",
    name: "Solana Staking Pool",
    description: "Low-risk Solana staking pool",
    apy: 8.5,
    tvl: 250000,
    depositToken: "SOL",
    minDeposit: 0.1,
    depositCap: 100,
    lockupPeriod: 7
  },
  {
    id: "2",
    name: "Yield Farming Alpha",
    description: "High-yield Solana farming pool",
    apy: 18.2,
    tvl: 150000,
    depositToken: "SOL",
    minDeposit: 0.5,
    depositCap: 50,
    lockupPeriod: 14
  },
  {
    id: "3",
    name: "USDC Savings",
    description: "Stable yield with USDC",
    apy: 5.7,
    tvl: 500000,
    depositToken: "USDC",
    minDeposit: 50,
    depositCap: 10000,
    lockupPeriod: 30
  }
];

const Pools: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate API fetch
    const fetchPools = async () => {
      try {
        // In a real app, you would fetch pool data from your API
        setTimeout(() => {
          setPools(MOCK_POOLS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching pools:', error);
        toast({
          title: "Error loading pools",
          description: "Failed to load investment pools. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  const handlePoolSelect = (pool: Pool) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deposit into pools",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to dashboard with selected pool
    navigate('/dashboard', { state: { selectedPool: pool.id } });
  };

  return (
    <>
      <SEO 
        title="Investment Pools | The Basement"
        description="Explore and invest in The Basement's yield farming pools."
      />
      <div className="min-h-screen text-white">
        <div className="container mx-auto pt-24 px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className={`text-4xl font-extrabold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Investment Pools</h1>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                Explore our carefully curated yield farming strategies and invest with confidence.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader size="lg" text="Loading pools..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools.map((pool) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: parseInt(pool.id) * 0.1 }}
                  >
                    <Card className={`overflow-hidden h-full backdrop-blur-sm border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    }`}>
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex-grow space-y-4 mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-extrabold text-xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{pool.name}</h3>
                              <p className={`font-bold ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                {pool.description}
                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full">
                              <p className="text-white font-extrabold">{pool.apy}% APY</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <p className={`text-xs font-bold mb-1 ${
                                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                }`}>Total Value Locked</p>
                                <p className="font-extrabold">${pool.tvl.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className={`text-xs font-bold mb-1 ${
                                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                }`}>Deposit Token</p>
                                <p className="font-extrabold">{pool.depositToken}</p>
                              </div>
                              <div>
                                <p className={`text-xs font-bold mb-1 ${
                                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                }`}>Minimum Deposit</p>
                                <p className="font-extrabold">{pool.minDeposit} {pool.depositToken}</p>
                              </div>
                              <div>
                                <p className={`text-xs font-bold mb-1 ${
                                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                }`}>Lockup Period</p>
                                <p className="font-extrabold">{pool.lockupPeriod} days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full font-extrabold"
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
      </div>
    </>
  );
};

export default Pools;