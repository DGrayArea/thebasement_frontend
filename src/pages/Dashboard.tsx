import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, TrendingUp, Lock } from "lucide-react";
import Header from '@/components/Header';

interface Pool {
  id: string;
  name: string;
  apy: number;
  totalValue: number;
  minDeposit: number;
  maxDeposit: number;
  lockPeriod: number;
}

const mockPools: Pool[] = [
  {
    id: "1",
    name: "Solana Staking Pool",
    apy: 8.5,
    totalValue: 250000,
    minDeposit: 1,
    maxDeposit: 1000,
    lockPeriod: 30
  },
  {
    id: "2",
    name: "USDC Yield Pool",
    apy: 12.2,
    totalValue: 500000,
    minDeposit: 100,
    maxDeposit: 10000,
    lockPeriod: 90
  }
];

const Dashboard = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async (pool: Pool) => {
    if (!depositAmount || isNaN(Number(depositAmount))) return;
    
    setIsDepositing(true);
    // Simulate deposit transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDepositing(false);
    
    // Reset form
    setDepositAmount("");
    setSelectedPool(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ibf-dark to-black text-white">
      <Header />
      
      <main className="container mx-auto pt-24 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-solana" />
                  <span className="text-sm text-white/60">Total Balance</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">$25,000</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-white/60">Total Earnings</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-green-500">$1,250</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-white/60">Locked Value</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-yellow-500">$15,000</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Available Pools</h2>
            <div className="space-y-4">
              {mockPools.map((pool) => (
                <Card 
                  key={pool.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 cursor-pointer transition-all duration-300 ${
                    selectedPool?.id === pool.id ? 'border-solana' : ''
                  }`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white">{pool.name}</h3>
                        <p className="text-sm text-white/60">Min: {pool.minDeposit} | Max: {pool.maxDeposit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-500 font-semibold">{pool.apy}% APY</p>
                        <p className="text-sm text-white/60">{pool.lockPeriod} days lock</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Deposit</h2>
            {selectedPool ? (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Amount to Deposit</label>
                      <Input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={`Enter amount (${selectedPool.minDeposit} - ${selectedPool.maxDeposit})`}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Min Deposit</span>
                        <span className="text-white">{selectedPool.minDeposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Max Deposit</span>
                        <span className="text-white">{selectedPool.maxDeposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Lock Period</span>
                        <span className="text-white">{selectedPool.lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">APY</span>
                        <span className="text-green-500">{selectedPool.apy}%</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-solana to-solana-secondary hover:opacity-90 transition-all duration-300"
                      onClick={() => handleDeposit(selectedPool)}
                      disabled={isDepositing}
                    >
                      {isDepositing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4" />
                          <span>Deposit</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ArrowUp className="h-8 w-8 mx-auto mb-4 opacity-40" />
                    <p className="text-white/60">Select a pool to deposit</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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

export default Dashboard; 