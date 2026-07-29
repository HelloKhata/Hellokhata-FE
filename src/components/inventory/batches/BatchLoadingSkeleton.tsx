"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function BatchLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border border-border/40">
          <CardContent className="p-3.5 flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <div className="hidden sm:block w-36">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
            <Skeleton className="h-6 w-20 rounded-md shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
