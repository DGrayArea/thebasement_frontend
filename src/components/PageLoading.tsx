import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

interface PageLoadingProps {
  message?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading page...'
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center"
    >
      <Loader size="lg" text={message} />

      <motion.div
        className="w-64 h-1 mt-12 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 8, ease: "linear" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient-slow"></div>
      </motion.div>
    </motion.div>
  );
};

export default PageLoading; 