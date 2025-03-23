import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface WalletGuardProps {
  children: React.ReactNode;
}

const WalletGuard: React.FC<WalletGuardProps> = ({ children }) => {
  const { publicKey } = useWallet();
  const { theme } = useTheme();

  if (!publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      >
        <div className={`text-center max-w-md mx-auto ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-white/70' : 'text-gray-600'
          }`}>
            Please connect your Solana wallet to access the IBF Protocol features and start earning yields.
          </p>
          <WalletMultiButton className="!bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] hover:from-[#0A3984] hover:to-[#3B1773]" />
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default WalletGuard; 