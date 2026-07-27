"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  TrendingUp,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  Settings2,
  ArrowLeftRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionLegendProps {
  isBangla?: boolean;
}

const legendItems = [
  {
    key: "sale",
    labelEn: "Sales",
    labelBn: "বিক্রয়",
    icon: ShoppingCart,
    styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    key: "income",
    labelEn: "Income",
    labelBn: "আয়",
    icon: TrendingUp,
    styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    key: "expense",
    labelEn: "Expense",
    labelBn: "খরচ",
    icon: Receipt,
    styles: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    key: "deposit",
    labelEn: "Deposit",
    labelBn: "জমা",
    icon: ArrowDownCircle,
    styles: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    key: "withdrawal",
    labelEn: "Withdrawal",
    labelBn: "উত্তোলন",
    icon: ArrowUpCircle,
    styles: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    key: "loan",
    labelEn: "Loan",
    labelBn: "ঋণ",
    icon: Coins,
    styles: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
  {
    key: "adjustment",
    labelEn: "Adjustment",
    labelBn: "সমন্বয়",
    icon: Settings2,
    styles: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  {
    key: "transfer",
    labelEn: "Transfer",
    labelBn: "স্থানান্তর",
    icon: ArrowLeftRight,
    styles: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    key: "refund",
    labelEn: "Refund",
    labelBn: "ফেরত",
    icon: RotateCcw,
    styles: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  {
    key: "opening",
    labelEn: "Opening Balance",
    labelBn: "প্রারম্ভিক ব্যালেন্স",
    icon: BookOpen,
    styles: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
];

export function TransactionLegend({
  isBangla = false,
}: TransactionLegendProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {isBangla ? "লেনদেনের ধরন" : "Transaction Types"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {legendItems.map((item) => {
          const Icon = item.icon;
          return (
            <Badge
              key={item.key}
              variant="outline"
              className={cn(
                "text-[10.5px] font-medium inline-flex items-center gap-1.5 px-2 py-0.5 shrink-0",
                item.styles
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span>{isBangla ? item.labelBn : item.labelEn}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
