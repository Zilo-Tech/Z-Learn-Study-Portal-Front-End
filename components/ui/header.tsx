'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { DesktopNavigation } from '../desktopnav';
import { MobileMenuButton } from '../mobilemenu';
import { MobileMenu } from '../mobilemenu/mobilemenu-buttons';
import { usePathname } from 'next/navigation';
import UserMenu from '../user-menu';

const Header = () => {
  const pathname = usePathname();
  const navigationItems = [
    { id: 'home', name: 'Home', href: '/' },
    { id: 'courses', name: 'Courses', href: '/courses' },
    { id: 'instructors', name: 'Instructors', href: '/instructors' },
    { id: 'pricing', name: 'Pricing', href: '/pricing' }
  ];
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
    <header className={`${pathname === "/" && "sticky top-0"} w-full z-50 bg-white border-b`}>
      <div className=" px-4 sm:px-6 lg:px-14">
        <div className="flex items-center justify-between h-16 py-4">
          <Logo />
          <DesktopNavigation items={navigationItems} />
          <div className="flex items-center">
            <UserMenu />
            <MobileMenuButton isMenuOpen={isMenuOpen} onToggle={toggleMenu} />

          </div>
        </div>
      </div>

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