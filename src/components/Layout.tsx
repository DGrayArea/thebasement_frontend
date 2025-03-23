import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-900 to-black text-white'
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    }`}>
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <footer className="mt-auto py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`border-t ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } pt-6`}>
            <div className={`text-center text-sm ${
              theme === 'dark' ? 'text-white/50' : 'text-gray-500'
            }`}>
              © 2025 IBF Protocol. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 