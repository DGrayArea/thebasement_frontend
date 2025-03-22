import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AnimatePresence } from 'framer-motion';
import '@solana/wallet-adapter-react-ui/styles.css';
import Header from './components/Header';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Pools from './pages/Pools';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  // Set up Solana network
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
              <Header />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/pools" 
                    element={
                      <ProtectedRoute>
                        <Pools />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
