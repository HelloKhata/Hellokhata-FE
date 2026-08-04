'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const FinancialDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-3">
        <Skeleton className="h-7 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card key={i} className="border border-border/60 shadow-2xs">
            <CardContent className="p-3.5 space-y-3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/60 p-4 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </Card>
        <Card className="border border-border/60 p-4 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </Card>
      </div>

      {/* Accounts & Transactions Table Skeleton */}
      <Card className="border border-border/60 p-4 space-y-3">
        <Skeleton className="h-5 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </Card>
    </div>
  );
};
