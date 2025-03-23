import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import WalletConnect from './WalletConnect';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/pools', label: 'Pools' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[997] ${
      theme === 'dark'
        ? 'bg-black/20 backdrop-blur-xl border-b border-white/10'
        : 'bg-white/70 backdrop-blur-xl border-b border-gray-200'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/IMG_20250322_191654_721.jpg"
              alt="Yield Garden"
              className="h-8 w-8 rounded-full"
            />
            <span className={`text-xl font-bold bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] bg-clip-text text-transparent`}>
              Yield Garden
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? theme === 'dark'
                      ? 'bg-white/10 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-md ${
                theme === 'dark'
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header; 