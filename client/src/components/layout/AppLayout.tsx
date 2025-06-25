import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show sidebar on auth pages
  const authPages = ['/login', '/signup', '/forgot-password', '/'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/checkin/');
  
  if (isAuthPage || !user) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}