import { Suspense } from 'react';
import { UserDashboardClient } from '@/components/user/UserDashboardClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <UserDashboardClient />
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full" />)} {/* BookCard skeleton */}
      </div>
    </div>
  );
}
