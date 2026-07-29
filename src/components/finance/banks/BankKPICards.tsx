"use client";

import React from "react";
import { Wallet, CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Badge } from "@/components/ui/badge";

interface BankKPICardsProps {
  totalAccounts: number;
  totalRecordedBalance: number;
  pendingReconciliationCount: number;
  lastSyncTime: string;
  isBangla?: boolean;
}

export function BankKPICards({
  totalAccounts,
  totalRecordedBalance,
  pendingReconciliationCount,
  lastSyncTime,
  isBangla = false,
}: BankKPICardsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Card 1: Total Accounts */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট অ্যাকাউন্ট" : "Total Accounts"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {totalAccounts}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      {/* Card 2: Total Recorded Balance */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট রেকর্ডকৃত ব্যালেন্স" : "Total Recorded Balance"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(totalRecordedBalance)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <CreditCard className="h-5 w-5" />
        </div>
      </div>

      {/* Card 3: Pending Reconciliation */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অমীমাংসিত মিলকরণ" : "Pending Reconciliation"}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
              {pendingReconciliationCount}
            </p>
            {pendingReconciliationCount > 0 && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold px-2 py-0.5">
                Needs Review
              </Badge>
            )}
          </div>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <AlertCircle className="h-5 w-5" />
        </div>
      </div>

      {/* Card 4: Last Sync */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "সর্বশেষ সিঙ্ক" : "Last Sync"}
          </p>
          <p className="text-xs font-semibold font-mono text-foreground truncate">
            {lastSyncTime}
          </p>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
            Synced
          </Badge>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <RefreshCw className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
