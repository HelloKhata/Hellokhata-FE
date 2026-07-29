"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, CalendarX } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";

export type BatchStatusType = "active" | "expiring" | "expired" | "no_expiry" | "depleted" | "written_off";

interface BatchStatusBadgeProps {
  status?: BatchStatusType | string;
  hasExpiry?: boolean;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  daysUntilExpiry?: number | null;
  className?: string;
}

export function BatchStatusBadge({
  status,
  hasExpiry = true,
  isExpired = false,
  isExpiringSoon = false,
  daysUntilExpiry,
  className,
}: BatchStatusBadgeProps) {
  const { isBangla } = useAppTranslation();

  if (!hasExpiry) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max",
          className
        )}
      >
        <CalendarX className="h-3 w-3 shrink-0 text-slate-500" />
        <span>⚫ {isBangla ? "মেয়াদ নেই" : "No Expiry"}</span>
      </Badge>
    );
  }

  if (isExpired || status === "expired") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max",
          className
        )}
      >
        <AlertCircle className="h-3 w-3 shrink-0 text-rose-600" />
        <span>🔴 {isBangla ? "মেয়াদোত্তীর্ণ" : "Expired"}</span>
      </Badge>
    );
  }

  if (isExpiringSoon || status === "expiring") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max",
          className
        )}
      >
        <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" />
        <span>
          🟡{" "}
          {daysUntilExpiry != null
            ? isBangla
              ? `${daysUntilExpiry} দিন বাকি`
              : `${daysUntilExpiry}d left`
            : isBangla
            ? "শীঘ্রই মেয়াদ শেষ"
            : "Expiring Soon"}
        </span>
      </Badge>
    );
  }

  if (status === "depleted") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20 text-[11px] font-medium py-0.5 px-2 flex items-center gap-1 w-max",
          className
        )}
      >
        <span>⚫ {isBangla ? "স্টক শেষ" : "Depleted"}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max",
        className
      )}
    >
      <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
      <span>🟢 {isBangla ? "সক্রিয়" : "Active"}</span>
    </Badge>
  );
}
