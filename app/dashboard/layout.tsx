'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="">
        {/* Main Content */}
        <main className="">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}