import { Skeleton } from '@/components/ui/skeleton';

export const CardSkeleton = () => (
  <div className="bg-card rounded-xl p-5 card-shadow space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-card rounded-xl p-5 card-shadow space-y-4">
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-48 w-full rounded-lg" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-card rounded-xl p-5 card-shadow space-y-3">
    <Skeleton className="h-5 w-40" />
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);
