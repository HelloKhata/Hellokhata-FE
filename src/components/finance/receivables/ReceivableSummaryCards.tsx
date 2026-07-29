"use client";

import React from "react";
import { Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";

interface ReceivableSummaryCardsProps {
  totalReceivables: number;
  totalCustomers: number;
  overdueAmount: number;
  collectionRate: number;
  isBangla?: boolean;
}

export function ReceivableSummaryCards({
  totalReceivables,
  totalCustomers,
  overdueAmount,
  collectionRate,
  isBangla = false,
}: ReceivableSummaryCardsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Receivables Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট প্রাপ্য (Total Receivables)" : "Total Receivables"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {formatCurrency(totalReceivables)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>

      {/* Total Customers Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট গ্রাহক" : "Total Customers"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {totalCustomers}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {/* Overdue Amount Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "ওভারডিউ পরিমাণ" : "Overdue Amount"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {formatCurrency(overdueAmount)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>

      {/* Collection Rate Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "কালেকশন হার" : "Collection Rate"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {collectionRate}%
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
