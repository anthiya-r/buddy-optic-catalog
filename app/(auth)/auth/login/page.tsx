'use client';

import LoginSection from '@/components/pages/auth/login/login-section';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    // This is an internal route, should only be accessed from admin-login
    // Redirect to admin login page if accessed directly
    const referrer = document.referrer;
    if (!referrer.includes('admin-login') && !referrer.includes('/admin')) {
      router.replace('/admin-login');
    }
  }, [router]);

  return (
    <main className="min-h-dvh h-full w-full p-6 flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <LoginSection />
    </main>
  );
};

export default LoginPage;
