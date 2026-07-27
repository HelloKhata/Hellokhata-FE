"use client";

import React from "react";
import { MoneyEntryRecord } from "@/types/finance";
import { PieChart } from "lucide-react";

interface ExpenseBreakdownProps {
  entries: MoneyEntryRecord[];
  isBangla?: boolean;
}

export function ExpenseBreakdownChart({ entries, isBangla = false }: ExpenseBreakdownProps) {
  if (entries.length === 0) return null;

  // Calculate totals per category
  const categoryTotals: Record<string, number> = {};
  let overallTotal = 0;

  entries.forEach((item) => {
    categoryTotals[item.categoryName] = (categoryTotals[item.categoryName] || 0) + item.amount;
    overallTotal += item.amount;
  });

  const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    percentage: overallTotal > 0 ? Math.round((amount / overallTotal) * 100) : 0,
  }));

  const colors = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-sky-500",
    "bg-purple-500",
    "bg-emerald-500",
  ];

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <PieChart className="h-3.5 w-3.5 text-primary" />
          <span>{isBangla ? "ব্যয়ের ক্যটাগরি বিভাজন" : "Expense Category Distribution"}</span>
        </h4>
        <span className="text-[10.5px] font-mono text-muted-foreground">
          {isBangla ? "মোট: " : "Total: "}৳{overallTotal.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar Distribution */}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            style={{ width: `${cat.percentage}%` }}
            className={`h-full ${colors[idx % colors.length]}`}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]">
        {categories.map((cat, idx) => (
          <div key={cat.name} className="flex items-center gap-1 text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${colors[idx % colors.length]}`} />
            <span className="font-medium text-foreground">{cat.name}</span>
            <span>({cat.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
