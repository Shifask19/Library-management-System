import type { ReactNode } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// This layout will wrap all pages in the /user route group
export default function UserAreaLayout({ children }: { children: ReactNode }) {
  // Here you would typically implement route protection
  // For example, check if the user is authenticated and has a 'user' role.
  // If not, redirect them to the login page or an unauthorized page.
  
  // const { currentUser, loading } = useCurrentUser(); // Example client-side auth check
  // if (loading) return <FullPageLoader />;
  // if (!currentUser || currentUser.role !== 'user') {
  //   if (typeof window !== 'undefined') router.push('/login/user'); // Or '/'
  //   return null;
  // }
  
  return (
    <DashboardLayout userRole="user">
      {children}
    </DashboardLayout>
  );
}
