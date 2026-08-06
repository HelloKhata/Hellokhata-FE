import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'system' | 'coming' | 'ghost';
  children: React.ReactNode;
  className?: string;
  hideDot?: boolean;
}

export function StatusBadge({ status, children, className, hideDot = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap",
        {
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400": status === 'active',
          "bg-secondary/50 text-muted-foreground border border-border/50": status === 'inactive',
          "bg-primary/10 text-primary": status === 'system',
          "bg-amber-500/10 text-amber-600 dark:text-amber-500": status === 'coming',
          "bg-secondary/50 text-muted-foreground border border-border/50": status === 'ghost',
        },
        className
      )}
    >
      {!hideDot && status !== 'ghost' && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", {
            "bg-emerald-500": status === 'active',
            "bg-muted-foreground/50": status === 'inactive',
            "bg-primary": status === 'system',
            "bg-amber-500": status === 'coming',
          })}
        />
      )}
      {children}
    </span>
  );
}
