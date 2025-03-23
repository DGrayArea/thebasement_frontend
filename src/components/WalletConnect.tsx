import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from '@/contexts/ThemeContext';

const WalletConnect: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (connected && publicKey) {
      navigate('/dashboard');
    }
  }, [connected, publicKey, navigate]);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    await disconnect();
    navigate('/');
  };

  return (
    <div className="relative">
      {!connected ? (
        <WalletMultiButton className="!bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] hover:from-[#0A3984] hover:to-[#3B1773]" />
      ) : (
        <div className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/20 hover:bg-white/10'
              : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
          }`}>
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {truncateAddress(publicKey.toString())}
            </span>
            <div className={`flex items-center gap-1 pl-2 ${
              theme === 'dark' ? 'border-l border-white/20' : 'border-l border-gray-300'
            }`}>
              <div 
                className={`p-2 rounded-md cursor-pointer ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-white/80'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                onClick={copyAddress}
              >
                <Copy className="h-3 w-3" />
              </div>
              <div 
                className={`p-2 rounded-md cursor-pointer ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-white/80'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </div>
              <div 
                className={`p-2 rounded-md cursor-pointer ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-white/80'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                onClick={handleDisconnect}
              >
                <Wallet className="h-3 w-3" />
              </div>
            </div>
          </div>
          {copied && (
            <div className={`absolute right-0 top-full mt-2 text-xs py-1 px-2 rounded animate-fade-in-up backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white'
                : 'bg-gray-800 text-white'
            }`}>
              Address copied!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
