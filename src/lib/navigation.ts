import { Home, Wallet, BarChart, LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
}

export const navigationConfig: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Home',
    icon: Home,
    requiresAuth: true
  },
  {
    path: '/pools',
    label: 'Pools',
    icon: BarChart,
    requiresAuth: true
  }
];

export const getNavItems = (isAuthenticated: boolean = false): NavItem[] => {
  return navigationConfig.filter(item => !item.requiresAuth || isAuthenticated);
}; 