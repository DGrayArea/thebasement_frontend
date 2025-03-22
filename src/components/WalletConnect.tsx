
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink } from "lucide-react";

const WalletConnect: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mockConnect = async () => {
    setConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAddress = "8YLKoCr5Nz5RgzPHjYwsNnKEZNKKcNoWmUAKVuBsZmW6";
    setPublicKey(mockAddress);
    setConnected(true);
    setConnecting(false);
  };

  const mockDisconnect = async () => {
    setConnected(false);
    setPublicKey(null);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {!connected ? (
        <Button 
          onClick={mockConnect} 
          disabled={connecting}
          className="relative overflow-hidden bg-gradient-to-r from-solana to-solana-secondary hover:opacity-90 transition-all duration-300"
        >
          {connecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </div>
          )}
        </Button>
      ) : (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
            onClick={mockDisconnect}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>{truncateAddress(publicKey)}</span>
              <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Button>
          {copied && (
            <div className="absolute right-0 top-full mt-2 bg-black/80 text-white text-xs py-1 px-2 rounded animate-fade-in-up">
              Address copied!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
