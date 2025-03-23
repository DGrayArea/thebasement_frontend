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
    <>
      <header className={`fixed top-0 left-0 right-0 z-[997] ${
        theme === 'dark'
          ? 'bg-gray-950/70 backdrop-blur-lg border-b border-white/5'
          : 'bg-white/70 backdrop-blur-lg border-b border-gray-200/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 overflow-hidden rounded-full ring-2 ring-blue-500/20 transition-all duration-200 group-hover:ring-blue-500/50">
                <img
                  src="/IMG_20250322_191654_721.jpg"
                  alt="Yield Garden"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-[#0D47A1] to-[#4A1D96] bg-clip-text text-transparent">
                Yield Garden
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-6">
              <nav className="flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 text-sm font-extrabold rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? theme === 'dark'
                          ? 'bg-white/10 text-white shadow-sm shadow-white/5'
                          : 'bg-gray-100 text-gray-900 shadow-sm'
                        : theme === 'dark'
                        ? 'text-white/70 hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4 border-l pl-4 ml-2 border-inherit">
                <ThemeToggle />
                <WalletConnect />
              </div>
            </div>

            {/* Mobile menu button only */}
            <div className="flex md:hidden items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-white/70 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header; 