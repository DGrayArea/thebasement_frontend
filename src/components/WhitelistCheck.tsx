
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface WhitelistCheckProps {
  publicKey: string | null;
  onAccessGranted: () => void;
}

const WhitelistCheck: React.FC<WhitelistCheckProps> = ({ publicKey, onAccessGranted }) => {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (publicKey) {
      checkAccess();
    }
  }, [publicKey]);

  const checkAccess = async () => {
    if (!publicKey) return;
    
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Grant access to any connected wallet
    setIsChecking(false);
    onAccessGranted();
  };

  if (!publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-md mx-auto glass p-8 rounded-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-ibf" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Beta Access</h2>
          <p className="text-sm opacity-70 mb-6">
            Connect your wallet to access the IBF Protocol beta.
          </p>
        </div>
      </motion.div>
    );
  }

  if (isChecking) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-md mx-auto glass p-8 rounded-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="solana-loader mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Verifying Access</h2>
          <p className="text-sm opacity-70 mb-6">
            Connecting to the beta...
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default WhitelistCheck;
