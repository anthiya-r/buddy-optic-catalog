'use client';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by trying to fetch a protected resource
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        if (!response.ok) {
          // Not authenticated, redirect to login
          router.replace('/auth/login');
        }
      } catch (error) {
        // Error checking auth, redirect to login
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <SidebarInset className="rounded-4xl m-1">
        <header className="flex shrink-0 items-center gap-2 border-b border-amber-200 bg-white px-4 p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-amber-200" />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
