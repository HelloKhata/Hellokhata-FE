"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionSummaryRowProps {
  totalCount: number;
  totalMoneyIn: number;
  totalMoneyOut: number;
  netMovement: number;
  isBangla?: boolean;
}

export function TransactionSummaryRow({
  totalCount,
  totalMoneyIn,
  totalMoneyOut,
  netMovement,
  isBangla = false,
}: TransactionSummaryRowProps) {
  const isNetPositive = netMovement >= 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Total Transactions */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-2xs flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <ArrowLeftRight className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            {isBangla ? "মোট লেনদেন" : "Total Transactions"}
          </p>
          <p className="text-base font-bold text-foreground font-mono leading-tight">
            {totalCount}
          </p>
        </div>
      </div>

      {/* 2. Money In */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-2xs flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            {isBangla ? "মোট আয় (Money In)" : "Money In"}
          </p>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
            ৳{totalMoneyIn.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 3. Money Out */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-2xs flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
          <ArrowDownRight className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            {isBangla ? "মোট ব্যয় (Money Out)" : "Money Out"}
          </p>
          <p className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono leading-tight">
            ৳{totalMoneyOut.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 4. Net Movement */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-2xs flex items-center gap-3">
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
            isNetPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}
        >
          {isNetPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground truncate">
            {isBangla ? "নিট লেনদেন প্রবাহ" : "Net Movement"}
          </p>
          <p
            className={cn(
              "text-base font-bold font-mono leading-tight",
              isNetPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isNetPositive ? "+" : ""}৳{netMovement.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
