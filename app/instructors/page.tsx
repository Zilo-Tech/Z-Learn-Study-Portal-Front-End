"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstructorsRedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/tutor'); }, [router]);
  return (
    <div className="p-8 text-center text-gray-600">Redirecting to Tutor workspace...</div>
  );
}