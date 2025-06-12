import type { ReactNode } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// This layout will wrap all pages in the /admin route group
export default function AdminAreaLayout({ children }: { children: ReactNode }) {
  // Here you would typically implement route protection
  // For example, check if the user is authenticated and has an 'admin' role.
  // If not, redirect them to the login page or an unauthorized page.
  // This logic would often be in a client component wrapper or middleware.

  // const { currentUser, loading } = useCurrentUser(); // Example client-side auth check
  // if (loading) return <FullPageLoader />; // Or some loading state
  // if (!currentUser || currentUser.role !== 'admin') {
  //   if (typeof window !== 'undefined') router.push('/login/admin'); // Or '/'
  //   return null; // Or redirect component
  // }

  return (
    <DashboardLayout userRole="admin">
      {children}
    </DashboardLayout>
  );
}
