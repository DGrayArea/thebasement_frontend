import { useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { getNavItems, NavItem } from '@/lib/navigation';

export const useNavigation = () => {
  const location = useLocation();
  const { connected } = useWallet();

  const isActive = (path: string) => location.pathname === path;
  const navItems = getNavItems(connected);

  return {
    isActive,
    navItems,
    isAuthenticated: connected
  };
}; 