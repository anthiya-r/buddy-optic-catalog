'use client';

import LoginSection from '@/components/pages/auth/login/login-section';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.ok) {
          // Already authenticated, redirect to dashboard
          router.replace('/admin/dashboard');
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-dvh h-full w-full p-6 flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-amber-200 border-t-orange-400 rounded-full animate-spin" />
          <p className="text-slate-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-dvh h-full w-full p-6 flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="flex flex-col items-center gap-4 w-full">
        <LoginSection />
        <p className="text-xs text-slate-500 mt-4">Admin Access Only</p>
      </div>
    </main>
  );
}
