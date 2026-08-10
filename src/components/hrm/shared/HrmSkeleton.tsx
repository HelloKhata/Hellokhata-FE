// Hello Khata OS - HRM Skeletons
// হ্যালো খাতা - এইচআরএম স্কেলিটন

'use client';

import { Skeleton } from '@/components/ui/premium';

export function HrmTableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4">
          <Skeleton variant="circular" width={36} height={36} />
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="flex-1" height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HrmCardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[rgba(255,255,255,0.04)] bg-card p-5 space-y-3">
          <Skeleton height={12} width="50%" />
          <Skeleton height={26} width="70%" />
          <Skeleton height={10} width="40%" />
        </div>
      ))}
    </div>
  );
}
