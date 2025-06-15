'use client';

import { useSession } from 'next-auth/react';

export function SessionDebug() {
  const { data: session, status } = useSession();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Status: {status}</div>
      <div>User: {session?.user?.name || 'Not logged in'}</div>
      <div>Email: {session?.user?.email || 'N/A'}</div>
    </div>
  );
}
