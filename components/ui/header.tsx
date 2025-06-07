"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { DesktopNavigation } from '../desktopnav';
import { MobileMenuButton } from '../mobilemenu';
import { MobileMenu } from '../mobilemenu/mobilemenu-buttons';

const Header = ({ 
    navigationItems = ['Home', 'Courses', 'Instructors', 'Pricing'] 
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
    return (
      <header className=" bg-white border ">
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-2">
          <div className="flex items-center justify-between h-16 py-3">
            <Logo />
            <DesktopNavigation items={navigationItems} />
            <MobileMenuButton isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>
        <MobileMenu isOpen={isMenuOpen} items={navigationItems} />
      </header>
    );
  };

export default Header;