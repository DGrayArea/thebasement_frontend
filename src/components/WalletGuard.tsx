import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Lock, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';
import { useTheme } from '@/contexts/ThemeContext';
import Loader from './Loader';

const WalletGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, connecting, disconnecting } = useWallet();
  const { theme } = useTheme();

  // Show loading state during wallet connections
  if (connecting || disconnecting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader 
          text={connecting ? 'Connecting to wallet...' : 'Disconnecting wallet...'} 
          size="lg"
        />
      </div>
    );
  }

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-[60vh] items-center justify-center relative"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 animate-pulse-slow blur-3xl" />
        </div>
        
        {/* Side decorative borders */}
        <div className="absolute left-[15%] top-[30%] w-[100px] h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
        <div className="absolute right-[15%] top-[30%] w-[100px] h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>
        <div className="absolute left-[15%] bottom-[30%] w-[100px] h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
        <div className="absolute right-[15%] bottom-[30%] w-[100px] h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>
        
        <div className={`flex flex-col items-center gap-5 max-w-xs text-center px-5 py-7 relative z-10 rounded-xl border ${
          theme === 'dark' 
            ? 'border-white/20 bg-gray-900/40 backdrop-blur-md'
            : 'border-silver/40 bg-white/60 backdrop-blur-md'
        } shadow-xl`}>
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-sm animate-pulse"></div>
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } ring-1 ${theme === 'dark' ? 'ring-white/20' : 'ring-silver/50'}`}>
              <Lock className="w-6 h-6 text-blue-500" />
              <Sparkles className="w-3 h-3 text-purple-400 absolute top-2 right-2" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Beta Access</h1>
            <p className={`text-sm font-bold mb-5 ${
              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
            }`}>
              Connect your wallet to access The Basement beta
            </p>
          </div>
          
          <WalletConnect />
          
          <div className="mt-3 flex items-center gap-2 text-xs text-center">
            <Shield className="w-3 h-3 text-green-500" />
            <span className={`font-semibold ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Secure connection via Solana</span>
          </div>
          
          <div className={`text-[10px] font-bold mt-2 py-2 px-3 rounded-lg ${
            theme === 'dark' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
          } flex items-start gap-1.5`}>
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>This is a beta product. Use at your own risk and only connect with funds you're willing to risk.</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return children;
};

export default WalletGuard; 