"use client";

import { useState } from 'react';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/footer';
import Header from '@/components/ui/header';
import CommunityNav from '@/components/community/CommunityNav';
import MobileMenuButton from '@/components/community/MobileMenuButton';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div lang="en" suppressHydrationWarning>
      <div className={cn(
        "min-h-screen bg-background antialiased",
      )}>
        <Header />
        <CommunityNav 
          isMobileOpen={isMobileMenuOpen} 
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <MobileMenuButton 
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="lg:ml-72 transition-all duration-300 min-h-screen">
          <div className="max-w-none px-4 lg:px-8 py-6">
            {children}
          </div>
        </main>
        <Footer />
        <Toaster richColors />
      </div>
    </div>
  );
}

