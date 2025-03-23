import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, TrendingUp, Lock } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';
import { WALLET_CONFIG, MOCK_POOL_ADDRESSES } from '@/lib/constants';
import { Pool } from '@/lib/types';
import { useTheme } from '@/contexts/ThemeContext';
import WalletGuard from '@/components/WalletGuard';

const mockPools: Pool[] = [
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
  },
];

const Dashboard = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const { publicKey, sendTransaction } = useWallet();
  const { theme } = useTheme();

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  const fetchBalance = async () => {
    if (!publicKey) return;

    try {
      const connection = new Connection(
        WALLET_CONFIG.network === 'devnet' 
          ? 'https://api.devnet.solana.com' 
          : 'https://api.mainnet-beta.solana.com'
      );

      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleDeposit = async (pool: Pool) => {
    if (!depositAmount || isNaN(Number(depositAmount)) || !publicKey) return;
    
    setIsDepositing(true);
    
    try {
      const connection = new Connection(
        WALLET_CONFIG.network === 'devnet' 
          ? 'https://api.devnet.solana.com' 
          : 'https://api.mainnet-beta.solana.com'
      );

      // Create deposit transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: pool.poolAddress,
          lamports: parseFloat(depositAmount) * LAMPORTS_PER_SOL,
        })
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${depositAmount} ${pool.depositToken} to ${pool.name}.`,
      });

      // Reset form
      setDepositAmount("");
      setSelectedPool(null);
      fetchBalance();
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: "Failed to process your deposit. Please try again.",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <main className="container mx-auto pt-24 px-4 pb-16">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8"
        >
          <img 
            src="/IMG_20250322_191655_012.jpg" 
            alt="Dashboard Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1]/80 to-[#4A1D96]/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome to IBF Protocol</h1>
              <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-200'}>
                Your gateway to decentralized yield generation
              </p>
            </div>
          </div>
        </motion.div>

        <WalletGuard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className={`backdrop-blur-sm border ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    <span className={theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-gray-600'}>
                      SOL Balance
                    </span>
                  </div>
                  <span className="text-2xl font-bold">{balance.toFixed(4)} SOL</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`backdrop-blur-sm border ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <span className={theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-gray-600'}>
                      Total Earnings
                    </span>
                  </div>
                  <span className="text-2xl font-bold">Coming Soon</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`backdrop-blur-sm border ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-400" />
                    <span className={theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-gray-600'}>
                      Locked Value
                    </span>
                  </div>
                  <span className="text-2xl font-bold">Coming Soon</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Available Pools</h2>
              <div className="space-y-4">
                {mockPools.map((pool) => (
                  <Card 
                    key={pool.id}
                    className={`backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    } ${selectedPool?.id === pool.id ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => setSelectedPool(pool)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{pool.name}</h3>
                          <p className={theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-gray-600'}>
                            Min: {pool.minDeposit} | Max: {pool.depositCap}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 font-semibold">{pool.apy}% APY</p>
                          <p className={theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-gray-600'}>
                            TVL: ${pool.tvl.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Deposit</h2>
              {selectedPool ? (
                <Card className={`backdrop-blur-sm border ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className={`text-sm mb-2 block ${
                          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                        }`}>Amount to Deposit</label>
                        <Input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder={`Enter amount (${selectedPool.minDeposit} - ${selectedPool.depositCap})`}
                          className={`${
                            theme === 'dark'
                              ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40'
                              : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                          }`}
                          min={selectedPool.minDeposit}
                          max={selectedPool.depositCap}
                          step="0.000001"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>Min Deposit</span>
                          <span>{selectedPool.minDeposit} {selectedPool.depositToken}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>Max Deposit</span>
                          <span>{selectedPool.depositCap} {selectedPool.depositToken}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>Token</span>
                          <span>{selectedPool.depositToken}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>APY</span>
                          <span className="text-blue-400">{selectedPool.apy}%</span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] hover:from-[#0A3984] hover:to-[#3B1773] text-white"
                        onClick={() => handleDeposit(selectedPool)}
                        disabled={isDepositing || !publicKey}
                      >
                        {isDepositing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : !publicKey ? (
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            <span>Connect Wallet</span>
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
                <Card className={`backdrop-blur-sm border ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <ArrowUp className={`h-8 w-8 mx-auto mb-4 ${
                        theme === 'dark' ? 'text-white/40' : 'text-gray-400'
                      }`} />
                      <p className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>
                        Select a pool to deposit
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </WalletGuard>
      </main>
    </div>
  );
};

export default Dashboard; 