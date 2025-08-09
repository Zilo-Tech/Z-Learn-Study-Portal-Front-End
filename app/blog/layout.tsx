import React from 'react';
import Header from '@/components/ui/header';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}