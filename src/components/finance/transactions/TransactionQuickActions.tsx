"use client";

import React from "react";
import {
  PlusCircle,
  MinusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Receipt,
  ArrowLeftRight,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionQuickActionsProps {
  isBangla?: boolean;
}

const actions = [
  {
    key: "income",
    icon: PlusCircle,
    titleEn: "Record Income",
    titleBn: "আয় রেকর্ড",
    descEn: "Log new income",
    descBn: "নতুন আয় নোট করুন",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/30",
  },
  {
    key: "expense",
    icon: MinusCircle,
    titleEn: "Record Expense",
    titleBn: "খরচ রেকর্ড",
    descEn: "Log business expense",
    descBn: "ব্যবসায়িক খরচ নোট করুন",
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    hoverBorder: "hover:border-rose-500/30",
  },
  {
    key: "deposit",
    icon: ArrowDownCircle,
    titleEn: "Deposit Cash",
    titleBn: "ক্যাশ জমা",
    descEn: "Bank deposit entry",
    descBn: "ব্যাংক জমা এন্ট্রি",
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-500/10",
    iconBorder: "border-sky-500/20",
    hoverBorder: "hover:border-sky-500/30",
  },
  {
    key: "withdraw",
    icon: ArrowUpCircle,
    titleEn: "Withdraw Cash",
    titleBn: "ক্যাশ উত্তোলন",
    descEn: "Cash withdrawal",
    descBn: "ক্যাশ উত্তোলন",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/30",
  },
  {
    key: "receive",
    icon: CreditCard,
    titleEn: "Receive Payment",
    titleBn: "পেমেন্ট গ্রহণ",
    descEn: "Customer payment in",
    descBn: "কাস্টমার পেমেন্ট",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-500/20",
    hoverBorder: "hover:border-indigo-500/30",
  },
  {
    key: "paySupplier",
    icon: Receipt,
    titleEn: "Pay Supplier",
    titleBn: "সাপ্লায়ার পেমেন্ট",
    descEn: "Supplier payment out",
    descBn: "সাপ্লায়ার পেমেন্ট",
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/20",
    hoverBorder: "hover:border-violet-500/30",
  },
  {
    key: "transfer",
    icon: ArrowLeftRight,
    titleEn: "Transfer Money",
    titleBn: "টাকা স্থানান্তর",
    descEn: "Between accounts",
    descBn: "অ্যাকাউন্ট মধ্যে",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    key: "reports",
    icon: BarChart3,
    titleEn: "View Reports",
    titleBn: "রিপোর্ট দেখুন",
    descEn: "Financial reports",
    descBn: "আর্থিক রিপোর্ট",
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-500/10",
    iconBorder: "border-teal-500/20",
    hoverBorder: "hover:border-teal-500/30",
  },
];

export function TransactionQuickActions({
  isBangla = false,
}: TransactionQuickActionsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {isBangla ? "দ্রুত কাজ" : "Quick Actions"}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              disabled
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50 text-left transition-all duration-200 cursor-not-allowed opacity-60",
                action.hoverBorder
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                  action.iconBg,
                  action.iconColor,
                  action.iconBorder
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {isBangla ? action.titleBn : action.titleEn}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isBangla ? action.descBn : action.descEn}
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
