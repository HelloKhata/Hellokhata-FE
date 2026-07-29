"use client";

import React from "react";
import { Users, AlertTriangle, Clock, CreditCard } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";

interface PayableSummaryCardsProps {
  totalPayables: number;
  totalSuppliers: number;
  overdueAmount: number;
  dueThisWeekAmount: number;
  isBangla?: boolean;
}

export function PayableSummaryCards({
  totalPayables,
  totalSuppliers,
  overdueAmount,
  dueThisWeekAmount,
  isBangla = false,
}: PayableSummaryCardsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Payables Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট প্রদেয় (Total Payables)" : "Total Payables"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {formatCurrency(totalPayables)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <CreditCard className="h-5 w-5" />
        </div>
      </div>

      {/* Total Suppliers Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "সরবরাহকারী সংখ্যা" : "Suppliers"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {totalSuppliers}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {/* Overdue Bills Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "ওভারডিউ বিল" : "Overdue Bills"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {formatCurrency(overdueAmount)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>

      {/* Bills Due This Week Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "এই সপ্তাহে পরিশোধযোগ্য" : "Bills Due This Week"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
            {formatCurrency(dueThisWeekAmount)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <Clock className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
