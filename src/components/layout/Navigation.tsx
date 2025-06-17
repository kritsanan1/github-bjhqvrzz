import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap, User, BarChart3 } from 'lucide-react';
import { useInteractionTracking } from '../../hooks/useAnalytics';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { trackInteraction } = useInteractionTracking('Navigation');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/studio', label: 'Studio' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/artists', label: 'Artists' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/analytics', label: 'Analytics' },
  ];

  const handleNavClick = (label: string, path: string) => {
    trackInteraction('nav_click', { label, path });
    setIsOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
    trackInteraction('mobile_menu_toggle', { isOpen: !isOpen });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => handleNavClick('Logo', '/')}
          >
            <div className="relative">
              <Zap className="h-8 w-8 text-primary-500" />
              <div className="absolute inset-0 bg-primary-500 blur-sm opacity-50" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              InkAI Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.label, item.path)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/studio"
              onClick={() => handleNavClick('Start Design CTA', '/studio')}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 min-h-[44px] flex items-center"
            >
              Start Design
            </Link>
            <Link
              to="/login"
              onClick={() => handleNavClick('Login', '/login')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:border-primary-500 transition-colors min-h-[44px]"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-md"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.label, item.path)}
              className={`block px-3 py-3 text-base font-medium transition-colors min-h-[44px] flex items-center ${
                location.pathname === item.path
                  ? 'text-primary-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label === 'Analytics' && <BarChart3 className="h-4 w-4 mr-2" />}
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
            <Link
              to="/studio"
              className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium text-center min-h-[44px] flex items-center justify-center"
              onClick={() => handleNavClick('Start Design CTA Mobile', '/studio')}
            >
              Start Design
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-600 rounded-lg min-h-[44px]"
              onClick={() => handleNavClick('Login Mobile', '/login')}
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;