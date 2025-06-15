'use client';

import React from 'react';
import Header from '@/components/ui/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Main Content */}
      <main className="">
        {children}
      </main>
    </div>
  );
}