"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { DesktopNavigation } from '../desktopnav';
import { MobileMenuButton } from '../mobilemenu';
import { MobileMenu } from '../mobilemenu/mobilemenu-buttons';
import { usePathname } from 'next/navigation';
import { UserMenu } from '../user-menu';
import { AuthButtons } from '../auth-buttons';
import { Bars3Icon } from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Instructors', href: '/instructors' },
  { name: 'Pricing', href: '/pricing' }
];

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={`${pathname === "/" ? "sticky top-0" : ""} w-full z-50 bg-white border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-4">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DesktopNavigation items={navigationItems} />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
          >
            <MobileMenu isOpen={isMenuOpen} items={navigationItems} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;