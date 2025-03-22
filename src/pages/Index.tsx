import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import WhitelistCheck from '@/components/WhitelistCheck';

interface WalletConnectionEvent extends CustomEvent {
  detail: {
    connected: boolean;
    publicKey: string | null;
  };
}

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [betaAccessGranted, setBetaAccessGranted] = useState(false);
  const navigate = useNavigate();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Wallet connection state handler
  useEffect(() => {
    const handleWalletConnection = (event: WalletConnectionEvent) => {
      if (event.detail.connected) {
        setWalletConnected(true);
        setPublicKey(event.detail.publicKey);
        // If wallet is connected and beta access is granted, redirect to dashboard
        if (betaAccessGranted) {
          navigate('/dashboard');
        }
      } else {
        setWalletConnected(false);
        setPublicKey(null);
        setBetaAccessGranted(false);
      }
    };

    window.addEventListener('walletConnectionChange', handleWalletConnection as EventListener);
    
    return () => {
      window.removeEventListener('walletConnectionChange', handleWalletConnection as EventListener);
    };
  }, [betaAccessGranted, navigate]);

  const handleBetaAccess = () => {
    setBetaAccessGranted(true);
    // If wallet is already connected, redirect to dashboard after beta access is granted
    if (walletConnected) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-ibf-dark to-black">
        <div className="solana-loader mb-8"></div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold mb-2"
        >
          IBF Protocol
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm opacity-60"
        >
          Loading the beta experience...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ibf-dark to-black text-white">
      <Header />
      
      <main className="container mx-auto pt-24 px-4">
        <AnimatePresence mode="wait">
          {!walletConnected || !betaAccessGranted ? (
            <motion.div
              key="whitelist-check"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-[70vh] flex items-center justify-center"
            >
              <WhitelistCheck 
                publicKey={publicKey} 
                onAccessGranted={handleBetaAccess} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard isConnected={walletConnected} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
          <div>© 2025 IBF Protocol. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-ibf transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Docs</a>
            <a href="#" className="hover:text-ibf transition-colors duration-200">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
