import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import MobileNav from './MobileNav';
import { APP_NAME, APP_VERSION } from '@/lib/constants';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
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
          <Link to="/" className="flex items-center space-x-2">
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
                className="text-xl font-semibold tracking-tight text-white"
              >
                {APP_NAME}
              </motion.h1>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-white/60"
              >
                {APP_VERSION}
              </motion.span>
            </div>
          </Link>
          
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:flex items-center space-x-6"
          >
            <Link 
              to="/dashboard" 
              className={`text-sm transition-colors duration-200 ${
                isActive('/dashboard') ? 'text-ibf' : 'text-white/60 hover:text-ibf'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/pools" 
              className={`text-sm transition-colors duration-200 ${
                isActive('/pools') ? 'text-ibf' : 'text-white/60 hover:text-ibf'
              }`}
            >
              Pools
            </Link>
            <a className="text-sm text-white/60 hover:text-ibf transition-colors duration-200" href="#">Docs</a>
            <a className="text-sm text-white/60 hover:text-ibf transition-colors duration-200" href="#">Community</a>
          </motion.nav>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <WalletConnect />
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
              aria-label="Open navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        </div>
      </motion.header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
};

export default Header;
