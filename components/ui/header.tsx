"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { DesktopNavigation } from '../desktopnav';
import { MobileMenuButton } from '../mobilemenu';
import { MobileMenu } from '../mobilemenu/mobilemenu-buttons';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Enrollments', href: '/enrollments' },
    { label: 'Study Sessions', href: '/study-sessions/demo' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Messages', href: '/messages' },
    { label: 'Admin Outline', href: '/admin/courses/1/outline' },
    { label: 'Analytics', href: '/admin/analytics' }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-4">
          <Logo />
          <DesktopNavigation items={navigationItems} />
          <MobileMenuButton isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
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