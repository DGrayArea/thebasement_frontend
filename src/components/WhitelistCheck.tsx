import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WHITELISTED_ADDRESSES } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

interface WhitelistCheckProps {
  onAccessGranted: () => void;
}

const WhitelistCheck: React.FC<WhitelistCheckProps> = ({ onAccessGranted }) => {
  const [isChecking, setIsChecking] = useState(false);
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected && publicKey) {
      checkAccess();
    }
  }, [connected, publicKey]);

  const checkAccess = async () => {
    if (!publicKey) return;
    
    setIsChecking(true);
    
    try {
      // Check if the wallet address is whitelisted
      const isWhitelisted = WHITELISTED_ADDRESSES.includes(publicKey.toString());
      
      if (isWhitelisted) {
        onAccessGranted();
        navigate('/pools');
        toast({
          title: "Access Granted",
          description: "Welcome to The Basement Beta!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Your wallet is not whitelisted for the beta.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking whitelist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify whitelist status. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (!connected) {
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
            Connect your wallet to access The Basement beta.
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
            Checking whitelist status...
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default WhitelistCheck;
