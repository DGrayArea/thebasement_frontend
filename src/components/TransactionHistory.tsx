
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/lib/types';
import { Check, ExternalLink, ArrowUpRight, Loader2, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  isLoading = false 
}) => {
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
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'Withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
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
      className="glass rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Transaction History</h3>
        {transactions.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs opacity-70 hover:opacity-100">
            View All
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin opacity-50" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 opacity-70">
          <p>No transactions yet</p>
          <p className="text-sm mt-2 opacity-50">Transactions will appear here once you start using the protocol</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {getTxIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-medium">{tx.type}</div>
                    <div className="text-xs opacity-60">{formatDate(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{tx.amount} {tx.token}</div>
                  <div className="text-xs flex items-center justify-end opacity-60">
                    <span className="mr-1">{truncateTxHash(tx.txHash)}</span>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ibf hover:underline"
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
