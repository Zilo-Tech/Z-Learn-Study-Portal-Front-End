"use client";

import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed bottom-6 right-6 z-50 lg:hidden",
        "w-14 h-14 rounded-full shadow-lg",
        "bg-gradient-to-r from-emerald-500 to-green-600",
        "flex items-center justify-center",
        "text-white transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "border-2 border-white"
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative">
        <Menu 
          className={cn(
            "w-6 h-6 transition-all duration-300",
            isOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
          )} 
        />
        <X 
          className={cn(
            "w-6 h-6 absolute inset-0 transition-all duration-300",
            isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
          )} 
        />
      </div>
    </button>
  );
}