import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const { theme } = useTheme();
  
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };
  
  const container = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm' 
    : 'flex flex-col items-center justify-center py-8';
  
  return (
    <div className={container}>
      <div className="relative">
        {/* Outer spinner with gradient */}
        <div className={`${sizes[size]} rounded-full border-transparent animate-spin`} 
          style={{ 
            borderTopColor: theme === 'dark' ? '#4A1D96' : '#0D47A1',
            borderLeftColor: theme === 'dark' ? '#4A1D96' : '#0D47A1',
            borderRightColor: '#4A1D96',
            borderBottomColor: '#0D47A1'
          }}>
        </div>
        
        {/* Inner spinner (opposite direction) */}
        <div className={`${sizes[size]} rounded-full border-transparent animate-spin absolute inset-[2px] reverse`}
          style={{ 
            borderTopColor: '#0D47A1',
            borderLeftColor: '#4A1D96', 
            borderRightColor: theme === 'dark' ? '#0D47A1' : '#4A1D96',
            borderBottomColor: theme === 'dark' ? '#4A1D96' : '#0D47A1',
            animationDirection: 'reverse',
            opacity: 0.7
          }}>
        </div>
      </div>
      
      {text && (
        <p className={`mt-4 font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader; 