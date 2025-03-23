import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/lib/types';
import { Check, ExternalLink, ArrowUpRight, Loader2, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { WALLET_CONFIG } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();
  const { theme } = useTheme();

  useEffect(() => {
    if (publicKey) {
      fetchTransactionHistory();
    }
  }, [publicKey]);

  const fetchTransactionHistory = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const connection = new Connection(
        WALLET_CONFIG.network === 'devnet' 
          ? 'https://api.devnet.solana.com' 
          : 'https://api.mainnet-beta.solana.com'
      );

      // Fetch recent transactions
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 10 }
      );

      // Get transaction details
      const txDetails = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature);
          if (!tx || !tx.meta) return null;

          // Determine transaction type and amount
          let type = 'Unknown';
          let amount = 0;
          const token = 'SOL';

          const accountIndex = tx.transaction.message.accountKeys.findIndex(
            key => key.equals(publicKey)
          );

          if (accountIndex === 0) {
            type = 'Withdrawal';
            amount = Math.abs(tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
          } else if (accountIndex > 0) {
            type = 'Deposit';
            amount = Math.abs(tx.meta.postBalances[accountIndex] - tx.meta.preBalances[accountIndex]) / 1e9;
          }

          return {
            id: sig.signature,
            type,
            amount,
            token,
            timestamp: new Date(sig.blockTime! * 1000).toISOString(),
            status: 'Completed',
            txHash: sig.signature
          };
        })
      );

      // Filter out null transactions and update state
      setTransactions(txDetails.filter((tx): tx is Transaction => tx !== null));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownRight className="h-5 w-5 text-green-400" />;
      case 'Withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-blue-400" />;
      case 'Yield Distribution':
        return <Check className="w-4 h-4 text-blue-400" />;
      default:
        return <Check className="w-4 h-4 text-blue-400" />;
    }
  };

  const truncateTxHash = (hash: string) => {
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`rounded-2xl p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10'
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Transaction History</h3>
        {transactions.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs ${
              theme === 'dark'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={fetchTransactionHistory}
          >
            Refresh
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className={`h-8 w-8 animate-spin ${
            theme === 'dark' ? 'text-white/50' : 'text-gray-400'
          }`} />
        </div>
      ) : transactions.length === 0 ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-white/70' : 'text-gray-600'
        }`}>
          <p>No transactions yet</p>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-white/50' : 'text-gray-500'
          }`}>Transactions will appear here once you start using the protocol</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl p-3 transition-colors ${
                theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTxIcon(tx.type)}
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{tx.type}</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                    }`}>{formatDate(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{tx.amount.toFixed(4)} {tx.token}</div>
                  <div className={`text-xs flex items-center justify-end ${
                    theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                  }`}>
                    <span className="mr-1">{truncateTxHash(tx.txHash)}</span>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=${WALLET_CONFIG.network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-blue-400 hover:text-blue-300 ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
