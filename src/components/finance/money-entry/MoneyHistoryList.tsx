"use client";

import React from "react";
import { MoneyEntryRecord } from "@/types/finance";
import {
  CheckCircle2,
  TrendingUp,
  ShoppingCart,
  Landmark,
  Building2,
  Coins,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MoneyHistoryListProps {
  mode: "income" | "expense";
  entries: MoneyEntryRecord[];
  isBangla?: boolean;
}

export function MoneyHistoryList({
  mode,
  entries,
  isBangla = false,
}: MoneyHistoryListProps) {
  const isIncome = mode === "income";

  const getCategoryTheme = (catId: string) => {
    switch (catId) {
      case "sales":
        return {
          icon: ShoppingCart,
          bgClass: "bg-teal-500/20 text-teal-400 border-teal-500/30",
          tagClass: "bg-teal-500/15 text-teal-400 border-teal-500/30",
        };
      case "other_income":
        return {
          icon: CheckCircle2,
          bgClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          tagClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "investment":
        return {
          icon: TrendingUp,
          bgClass: "bg-purple-500/20 text-purple-400 border-purple-500/30",
          tagClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        };
      case "asset_sale":
        return {
          icon: Building2,
          bgClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          tagClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      default:
        return {
          icon: isIncome ? Coins : CheckCircle2,
          bgClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          tagClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
    }
  };

  return (
    <div className="space-y-3">
      {entries.map((item) => {
        const theme = getCategoryTheme(item.categoryId);
        const Icon = theme.icon;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs hover:border-border transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
                  theme.bgClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {item.categoryName}
                  </span>
                  {(item.memo || item.sourceNote) && (
                    <Badge
                      variant="outline"
                      className={cn("text-[9.5px] px-2 py-0 border font-medium", theme.tagClass)}
                    >
                      {item.memo || item.sourceNote}
                    </Badge>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground font-mono">
                  {item.date}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={cn(
                  "text-sm font-bold font-mono",
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {isIncome ? "+" : "-"}৳{item.amount.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
