"use client";

import React from "react";
import { FinancialSummaryData } from "@/types/finance";
import { cn } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Landmark,
} from "lucide-react";

interface SummaryCardsProps {
  data: FinancialSummaryData;
  isLoading?: boolean;
  isBangla?: boolean;
}

export function FinancialSummaryCard({
  data,
  isLoading = false,
  isBangla = false,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl border border-border/60 bg-card p-5 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-36 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const { cashPosition, moneyIn, moneyOut, netCashFlow } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Primary - Cash Position */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "ক্যাশ পজিশন (Cash Position)" : "Cash Position"}
          </span>
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Wallet className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            ৳{cashPosition.amount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
          <span className="font-medium truncate">
            {isBangla ? "ক্যাশ + ব্যাংক + ওয়ালেট" : "Cash + Bank + Wallets"}
          </span>
          <span className="flex items-center gap-1 text-[10px] shrink-0 text-muted-foreground/80">
            <RefreshCw className="h-3 w-3" />
            {isBangla
              ? `${cashPosition.lastSyncedMinutesAgo} মিনিট আগে সিঙ্কড`
              : `Last synced: ${cashPosition.lastSyncedMinutesAgo}m ago`}
          </span>
        </div>
      </div>

      {/* Card 2: Money In */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-border transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মোট আয় (Money In)" : "Money In"}
          </span>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="my-2 flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            ৳{moneyIn.amount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
          <span className="text-muted-foreground">{isBangla ? moneyIn.period : moneyIn.period}</span>
          <span className="inline-flex items-center gap-0.5 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10.5px]">
            <ArrowUpRight className="h-3 w-3" />
            +{moneyIn.changePercentage}%
          </span>
        </div>
      </div>

      {/* Card 3: Money Out */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-border transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মোট ব্যয় (Money Out)" : "Money Out"}
          </span>
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
            <TrendingDown className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="my-2 flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            ৳{moneyOut.amount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
          <span className="text-muted-foreground">{isBangla ? moneyOut.period : moneyOut.period}</span>
          <span className="inline-flex items-center gap-0.5 font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full text-[10.5px]">
            <ArrowDownRight className="h-3 w-3" />
            {moneyOut.changePercentage}%
          </span>
        </div>
      </div>

      {/* Card 4: Net Cash Flow */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-border transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "নিট ক্যাশ ফ্লো (Net Cash Flow)" : "Net Cash Flow"}
          </span>
          <div className="h-9 w-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
            <Landmark className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="my-2 flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {netCashFlow.isPositive ? "+" : ""}৳{netCashFlow.amount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
          <span className="text-muted-foreground">{isBangla ? netCashFlow.period : netCashFlow.period}</span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium px-2 py-0.5 rounded-full text-[10.5px]",
              netCashFlow.isPositive
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
            )}
          >
            {netCashFlow.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {isBangla ? "পজিটিভ ফ্লো" : "Net Surplus"}
          </span>
        </div>
      </div>
    </div>
  );
}
