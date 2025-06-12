// Use Suspense for client components that fetch data or use hooks like useSearchParams
import { Suspense } from 'react';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { Skeleton } from '@/components/ui/skeleton'; // Or a more specific loader

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <AdminDashboardClient />
    </Suspense>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="mb-6 sm:mb-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/2 mt-2" />
      </div>
      <Skeleton className="h-12 w-full" /> {/* TabsList skeleton */}
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-1/4" /> {/* Search input skeleton */}
        <Skeleton className="h-48 w-full" /> {/* Table skeleton */}
      </div>
    </div>
  );
}
