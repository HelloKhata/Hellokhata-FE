"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TransactionType } from "@/types/finance";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Truck,
  Receipt,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Users,
  Coins,
} from "lucide-react";

interface TransactionTypeBadgeProps {
  type: TransactionType;
  isBangla?: boolean;
  className?: string;
}

export function TransactionTypeBadge({
  type,
  isBangla = false,
  className,
}: TransactionTypeBadgeProps) {
  const getBadgeConfig = () => {
    switch (type) {
      case "sale":
        return {
          labelEn: "Sale",
          labelBn: "বিক্রয়",
          icon: ShoppingCart,
          styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "purchase":
        return {
          labelEn: "Purchase",
          labelBn: "ক্রয়",
          icon: Truck,
          styles: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
      case "expense":
        return {
          labelEn: "Expense",
          labelBn: "ব্যয়",
          icon: Receipt,
          styles: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        };
      case "income":
        return {
          labelEn: "Income",
          labelBn: "আয়",
          icon: TrendingUp,
          styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "deposit":
        return {
          labelEn: "Deposit",
          labelBn: "জমা",
          icon: ArrowDownCircle,
          styles: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        };
      case "withdrawal":
        return {
          labelEn: "Withdrawal",
          labelBn: "উত্তোলন",
          icon: ArrowUpCircle,
          styles: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "payment":
        return {
          labelEn: "Payment",
          labelBn: "পেমেন্ট",
          icon: CreditCard,
          styles: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "payroll":
        return {
          labelEn: "Payroll",
          labelBn: "বেতন",
          icon: Users,
          styles: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "loan":
        return {
          labelEn: "Loan",
          labelBn: "ঋণ",
          icon: Coins,
          styles: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        };
      default:
        return {
          labelEn: type,
          labelBn: type,
          icon: Receipt,
          styles: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10.5px] font-medium inline-flex items-center gap-1.5 px-2 py-0.5 capitalize shrink-0",
        config.styles,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{isBangla ? config.labelBn : config.labelEn}</span>
    </Badge>
  );
}
