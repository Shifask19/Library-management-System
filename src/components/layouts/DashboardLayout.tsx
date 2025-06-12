import type { ReactNode } from 'react';
import { MainNavbar } from '@/components/navigation/MainNavbar';
import { AdminSidebarNav } from '@/components/navigation/AdminSidebarNav';
import { UserSidebarNav } from '@/components/navigation/UserSidebarNav';
import { AppLogo } from '../navigation/AppLogo';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'user';
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const SidebarNavigation = userRole === 'admin' ? <AdminSidebarNav /> : <UserSidebarNav />;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar userRole={userRole} sidebarNav={SidebarNavigation} />
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar text-sidebar-foreground fixed h-[calc(100vh-4rem)] top-16 left-0">
          <div className="p-4 border-b">
             <AppLogo />
          </div>
          {SidebarNavigation}
        </aside>
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background">
          {/*
            In a real app, you'd protect routes here:
            - Check Firebase auth state.
            - Check user role from Firestore.
            - Redirect if not authorized.
            This can be done with a client component wrapper, server-side checks + redirects, or Next.js middleware.
          */}
          {children}
        </main>
      </div>
    </div>
  );
}
