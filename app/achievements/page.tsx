'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Redirect to dashboard achievements tab
const AchievementsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard achievements tab
    router.replace('/dashboard?tab=achievements');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to your achievements...</p>
      </div>
    </div>
  );
};

export default AchievementsPage;
