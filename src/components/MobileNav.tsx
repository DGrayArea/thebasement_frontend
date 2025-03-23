import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Wallet } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import WalletConnect from './WalletConnect';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const location = useLocation();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/pools', label: 'Pools' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            className={`fixed inset-y-0 right-0 w-[280px] z-[999] flex flex-col ${
              theme === 'dark'
                ? 'bg-gray-950/90 backdrop-blur-lg border-l border-white/10'
                : 'bg-white/90 backdrop-blur-lg border-l border-gray-200/50'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
            }`}>
              <h2 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Menu
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-white/70 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Wallet Connect Section */}
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
            }`}>
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-500" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                }`}>Connect Wallet</span>
              </div>
              <WalletConnect fullWidth />
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-white border border-white/10'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 border border-gray-200/50'
                        : theme === 'dark'
                        ? 'text-white/70 hover:bg-white/5 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && <ChevronRight className="h-4 w-4 opacity-60" />}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Footer */}
            <div className={`p-4 border-t ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
            }`}>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-white/50' : 'text-gray-500'
              }`}>
                © 2025 IBF Protocol
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;