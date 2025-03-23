import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletGuard from './WalletGuard';

const ProtectedRoute: React.FC = () => {
  const { publicKey } = useWallet();
  const location = useLocation();

  // If we're not on the dashboard and not connected, redirect to dashboard
  if (!publicKey && location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <WalletGuard>
      <Outlet />
    </WalletGuard>
  );
};

export default ProtectedRoute; 