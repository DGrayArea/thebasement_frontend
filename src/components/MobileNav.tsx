import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Wallet, BarChart, Menu } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Wallet },
    { path: '/pools', label: 'Pools', icon: BarChart },
  ];

  return (
    <>
      <button
        onClick={() => onClose()}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-gradient-to-r from-solana to-solana-secondary p-3 rounded-full shadow-lg"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 h-full w-64 bg-white/5 backdrop-blur-md border-l border-white/10 z-50 lg:hidden"
            >
              <div className="p-4">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/60 hover:text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="mt-12 space-y-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                          isActive(item.path)
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav; 