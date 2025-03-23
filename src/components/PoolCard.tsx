import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pool } from '@/lib/types';
import { ArrowRight, Info, TrendingUp, DollarSign } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';
import { WALLET_CONFIG } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface PoolCardProps {
  pool: Pool;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleDeposit = async () => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10'
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="space-y-6">
        <div>
          <h3 className={`text-xl font-semibold mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{pool.name}</h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>{pool.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{pool.apy}% APY</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl p-3 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className={`text-sm mb-1 ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>TVL</div>
            <div className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>${pool.tvl.toLocaleString()}</div>
          </div>
          <div className={`rounded-xl p-3 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className={`text-sm mb-1 ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>Min Deposit</div>
            <div className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {pool.minDeposit} {pool.depositToken}
            </div>
          </div>
        </div>

        <div>
          <div className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>Strategy</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/80' : 'text-gray-800'
          }`}>{pool.strategyDescription}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder={`Enter amount (${pool.minDeposit} - ${pool.depositCap})`}
              className={`pr-16 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40'
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
              min={pool.minDeposit}
              max={pool.depositCap}
            />
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>
              {pool.depositToken}
            </div>
          </div>

          <Button
            className={`w-full ${
              isDepositing
                ? 'bg-gray-600 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] hover:from-[#0A3984] hover:to-[#3B1773] text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
            onClick={handleDeposit}
            disabled={isDepositing || !publicKey}
          >
            {isDepositing ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : !publicKey ? (
              "Connect Wallet"
            ) : (
              "Deposit"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PoolCard;
