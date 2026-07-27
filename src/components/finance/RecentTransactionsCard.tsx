"use client";

import React from "react";
import { RecentTransaction } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/premium";
import {
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  onViewAllClick?: () => void;
  isBangla?: boolean;
}

export function RecentTransactionsCard({
  transactions,
  onViewAllClick,
  isBangla = false,
}: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {isBangla ? "সাম্প্রতিক লেনদেন" : "Recent Transactions Preview"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "সর্বশেষ ৫টি অটোমেটিক ও ম্যানুয়াল অর্থ আদান-প্রদান"
              : "Latest 5 auto-recorded sales and manual expenses"}
          </p>
        </div>

        <Link href="/finance/transactions" onClick={onViewAllClick}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
          >
            <span>{isBangla ? "সব লেনদেন দেখুন" : "View All Transactions"}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          {isBangla ? "কোনো লেনদেন রেকর্ড নেই" : "No recent transactions recorded"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-3">{isBangla ? "বিবরণ" : "Description"}</th>
                <th className="py-2.5 px-3">{isBangla ? "উৎস" : "Source"}</th>
                <th className="py-2.5 px-3">{isBangla ? "শাখা" : "Branch"}</th>
                <th className="py-2.5 px-3">{isBangla ? "সময়" : "Time"}</th>
                <th className="py-2.5 px-3 text-right">{isBangla ? "পরিমাণ" : "Amount"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {transactions.slice(0, 5).map((tx) => {
                const isPositive = tx.amount > 0;
                const isSale = tx.type === "sale";
                const isExpense = tx.type === "expense";

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    {/* Description & Icon */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border",
                            isSale
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : isExpense
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                          )}
                        >
                          {isSale ? (
                            <ShoppingCart className="h-4 w-4" />
                          ) : isExpense ? (
                            <Receipt className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {tx.description}
                          </p>
                          {tx.category && (
                            <p className="text-[10.5px] text-muted-foreground">
                              {tx.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Auto / Manual Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {tx.isAuto ? (
                        <Badge
                          variant="outline"
                          className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[10px] flex items-center gap-1 w-fit"
                        >
                          <Sparkles className="h-3 w-3" />
                          Auto
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] flex items-center gap-1 w-fit"
                        >
                          <UserCheck className="h-3 w-3" />
                          Manual
                        </Badge>
                      )}
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">
                      {tx.branchName}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                      {tx.timestamp}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 whitespace-nowrap text-right font-mono font-bold">
                      <span
                        className={cn(
                          isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {isPositive ? "+" : ""}৳{tx.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
