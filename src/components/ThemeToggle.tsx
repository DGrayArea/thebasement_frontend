import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
        theme === 'dark' 
          ? 'text-white/70 hover:text-yellow-300 hover:bg-white/10'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="h-5 w-5" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: 30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="h-5 w-5" />
        </motion.div>
      )}
      
      {/* Ring effect */}
      <span className={`absolute inset-0 rounded-full ring-2 ring-offset-2 ${
        theme === 'dark' 
          ? 'ring-white/10 ring-offset-gray-950'
          : 'ring-gray-200 ring-offset-white'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </button>
  );
};

export default ThemeToggle; 