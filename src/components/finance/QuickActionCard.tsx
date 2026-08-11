"use client";

import React from "react";
import { PlusCircle, MinusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickActionItem {
  id: "income" | "expense" | "deposit" | "withdraw";
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "income",
    titleEn: "Add Income",
    titleBn: "আয় যোগ করুন",
    descriptionEn: "Record additional business revenue",
    descriptionBn: "ব্যবসার অতিরিক্ত আয় এন্ট্রি দিন",
    icon: PlusCircle,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
  },
  {
    id: "expense",
    titleEn: "Add Expense",
    titleBn: "খরচ এন্ট্রি দিন",
    descriptionEn: "Record a new business expense",
    descriptionBn: "ব্যবসার নতুন কোনো ব্যয় নোট করুন",
    icon: MinusCircle,
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20",
  },
  {
    id: "deposit",
    titleEn: "Deposit",
    titleBn: "জমা প্রদান",
    descriptionEn: "Deposit cash to bank or wallet",
    descriptionBn: "ব্যাংক বা ওয়ালেটে ক্যাশ জমা দিন",
    icon: ArrowDownCircle,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20",
  },
  {
    id: "withdraw",
    titleEn: "Withdraw",
    titleBn: "ক্যাশ উত্তোলন",
    descriptionEn: "Withdraw cash from account",
    descriptionBn: "হিসাব থেকে ক্যাশ অর্থ উত্তোলন করুন",
    icon: ArrowUpCircle,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
  },
];

interface QuickActionProps {
  onActionClick?: (actionId: string) => void;
  isBangla?: boolean;
}

export function QuickActionCard({
  onActionClick,
  isBangla = false,
}: QuickActionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {isBangla ? "দ্রুত লেনদেন এন্ট্রি (Quick Actions)" : "Quick Actions"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick?.(action.id)}
              className="w-full flex items-start gap-3.5 p-4 rounded-2xl border border-border/70 bg-card hover:bg-muted/40 hover:border-primary/30 transition-all text-left group shadow-2xs cursor-pointer"
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl border transition-colors shrink-0",
                  action.bgClass,
                  action.colorClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {isBangla ? action.titleBn : action.titleEn}
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">
                  {isBangla ? action.descriptionBn : action.descriptionEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
