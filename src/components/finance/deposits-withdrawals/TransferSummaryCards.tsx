"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";

interface TransferSummaryCardsProps {
  totalDeposits: number;
  totalWithdrawals: number;
  currentBalance: number;
  isBangla?: boolean;
}

export function TransferSummaryCards({
  totalDeposits,
  totalWithdrawals,
  currentBalance,
  isBangla = false,
}: TransferSummaryCardsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Total Deposits Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মোট জমা" : "Total Deposits"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalDeposits)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
          <ArrowDownLeft className="h-5 w-5" />
        </div>
      </div>

      {/* Total Withdrawals Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মোট উত্তোলন" : "Total Withdrawals"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {formatCurrency(totalWithdrawals)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>

      {/* Current Balance Card */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {isBangla ? "বর্তমান ব্যালেন্স" : "Current Balance"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {formatCurrency(currentBalance)}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Wallet className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
