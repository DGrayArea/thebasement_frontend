import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { connected } = useWallet();
  const location = useLocation();

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4"
      >
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold text-white">Connect Your Wallet</h1>
          <p className="text-white/60">
            Please connect your wallet to access this page.
          </p>
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 