"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BatchProgressProps {
  remaining: number;
  total: number;
  unit?: string;
  className?: string;
  showText?: boolean;
}

export function BatchProgress({
  remaining,
  total,
  unit = "units",
  className,
  showText = true,
}: BatchProgressProps) {
  const safeTotal = total > 0 ? total : Math.max(remaining, 1);
  const percentage = Math.min(100, Math.max(0, Math.round((remaining / safeTotal) * 100)));

  // Color logic based on stock percentage
  const getIndicatorColor = () => {
    if (percentage <= 15) return "bg-rose-500";
    if (percentage <= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className={cn("space-y-1 min-w-[140px]", className)}>
      {showText && (
        <div className="flex items-center justify-between text-xs gap-2">
          <span className="font-semibold text-foreground">
            {remaining} / {safeTotal} {unit}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground font-medium">
            {percentage}% Remaining
          </span>
        </div>
      )}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn("h-full transition-all duration-300 rounded-full", getIndicatorColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
