"use client";

import React from "react";
import { Activity } from "lucide-react";

interface RecentActivityCardProps {
  isBangla?: boolean;
}

export function RecentActivityCard({
  isBangla = false,
}: RecentActivityCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {isBangla ? "সাম্প্রতিক কার্যকলাপ" : "Recent Activity"}
      </h3>

      <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/60 shrink-0">
          <Activity className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {isBangla
              ? "সাম্প্রতিক আর্থিক কার্যকলাপ এখানে প্রদর্শিত হবে।"
              : "Recent financial activities will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}
