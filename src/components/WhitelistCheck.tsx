
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WHITELISTED_ADDRESSES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertCircle } from 'lucide-react';

interface WhitelistCheckProps {
  publicKey: string | null;
  onAccessGranted: () => void;
}

const WhitelistCheck: React.FC<WhitelistCheckProps> = ({ publicKey, onAccessGranted }) => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (publicKey) {
      checkWhitelist();
    } else {
      setIsWhitelisted(null);
    }
  }, [publicKey]);

  const checkWhitelist = async () => {
    if (!publicKey) return;
    
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const whitelisted = WHITELISTED_ADDRESSES.includes(publicKey);
    setIsWhitelisted(whitelisted);
    setIsChecking(false);
    
    if (whitelisted) {
      onAccessGranted();
    }
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
          <h2 className="text-2xl font-semibold mb-2">Beta Access Required</h2>
          <p className="text-sm opacity-70 mb-6">
            Connect your wallet to check if you have access to the IBF Protocol beta.
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
          <h2 className="text-2xl font-semibold mb-2">Checking Access</h2>
          <p className="text-sm opacity-70 mb-6">
            Verifying if your wallet is whitelisted for the beta...
          </p>
        </div>
      </motion.div>
    );
  }

  if (isWhitelisted === false) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-md mx-auto glass p-8 rounded-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-sm opacity-70 mb-6">
            Your wallet is not whitelisted for the IBF Protocol beta. Please contact the team to request access.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button onClick={() => window.open('https://twitter.com/ibfprotocol', '_blank')}>
              Request Access
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default WhitelistCheck;
