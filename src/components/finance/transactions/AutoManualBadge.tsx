"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoManualBadgeProps {
  isAuto: boolean;
  isBangla?: boolean;
  className?: string;
}

export function AutoManualBadge({
  isAuto,
  isBangla = false,
  className,
}: AutoManualBadgeProps) {
  if (isAuto) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[10px] font-medium flex items-center gap-1 shrink-0 px-2 py-0.5",
          className
        )}
      >
        <Sparkles className="h-3 w-3 text-sky-500" />
        {isBangla ? "অটোমেটিক" : "Auto"}
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[10px] font-medium flex items-center gap-1 shrink-0 px-2 py-0.5 text-muted-foreground bg-muted/60",
        className
      )}
    >
      <UserCheck className="h-3 w-3" />
      {isBangla ? "ম্যানুয়াল" : "Manual"}
    </Badge>
  );
}
