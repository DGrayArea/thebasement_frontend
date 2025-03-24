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
    <div className={`min-h-screen flex flex-col relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-[#121729] to-gray-900 text-white'
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
    }`}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
      
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <footer className="mt-auto py-6 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`border-t ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } pt-6`}>
            <div className={`text-center text-sm ${
              theme === 'dark' ? 'text-white/40' : 'text-gray-500'
            }`}>
              © 2025 The Basement. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 