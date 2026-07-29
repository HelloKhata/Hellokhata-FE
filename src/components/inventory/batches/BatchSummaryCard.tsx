"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BatchSummaryCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function BatchSummaryCard({
  label,
  value,
  subValue,
  icon,
  variant = "default",
  className,
}: BatchSummaryCardProps) {
  const variantStyles = {
    default: "bg-card border-border/60 text-foreground",
    success: "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-300",
    warning: "bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-300",
    danger: "bg-rose-50/40 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-300",
    info: "bg-blue-50/40 dark:bg-blue-950/20 border-blue-500/30 text-blue-900 dark:text-blue-300",
  };

  return (
    <Card className={cn("border shadow-xs", variantStyles[variant], className)}>
      <CardContent className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium truncate">{label}</span>
          {icon && <span className="shrink-0 opacity-70">{icon}</span>}
        </div>
        <div className="text-lg font-bold font-mono tracking-tight">{value}</div>
        {subValue && (
          <div className="text-[11px] text-muted-foreground truncate">{subValue}</div>
        )}
      </CardContent>
    </Card>
  );
}
