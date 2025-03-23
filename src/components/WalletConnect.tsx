import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from '@/contexts/ThemeContext';

interface WalletConnectProps {
  fullWidth?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ fullWidth = false }) => {
  const { theme } = useTheme();

  return (
    <div className={`relative group ${fullWidth ? 'w-full' : ''}`}>
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#0D47A1] via-[#4A1D96] to-[#0D47A1] bg-size-200 animate-gradient-slow group-hover:animate-gradient-fast" />
      
      {/* Button with background to cover gradient except border */}
      <WalletMultiButton 
        className={`relative !bg-none !text-sm !font-extrabold ${
          theme === 'dark' 
            ? '!bg-gray-900 hover:!bg-gray-800 !text-white' 
            : '!bg-white hover:!bg-gray-50 !text-gray-800'
        } !rounded-lg !h-9 !px-3 !tracking-tight !border-0 !shadow-sm transition-all duration-200 ${
          fullWidth ? '!w-full !justify-center' : ''
        }`}
      />
      
      {/* Hover shine effect */}
      <div className="absolute inset-0 rounded-lg -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:50%_100%] bg-no-repeat bg-left group-hover:bg-right transition-all duration-1000 ease-in-out" />
    </div>
  );
};

export default WalletConnect;
