
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';
import { APP_NAME, APP_VERSION } from '@/lib/constants';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/10 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="h-8 w-8 rounded-full bg-gradient-to-br from-solana to-solana-secondary flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">IBF</span>
          </motion.div>
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold tracking-tight"
            >
              {APP_NAME}
            </motion.h1>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="text-xs opacity-60"
            >
              {APP_VERSION}
            </motion.span>
          </div>
        </div>
        
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex items-center space-x-6"
        >
          <a className="text-sm hover:text-ibf transition-colors duration-200" href="#">Dashboard</a>
          <a className="text-sm hover:text-ibf transition-colors duration-200" href="#">Pools</a>
          <a className="text-sm hover:text-ibf transition-colors duration-200" href="#">Docs</a>
          <a className="text-sm hover:text-ibf transition-colors duration-200" href="#">Community</a>
        </motion.nav>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WalletConnect />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
