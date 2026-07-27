"use client";

import React from "react";
import { Transaction } from "@/types/finance";
import { AutoManualBadge } from "./AutoManualBadge";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import {
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  Truck,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Users,
  Coins,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  isLoading?: boolean;
  isBangla?: boolean;
}

export function TransactionTable({
  transactions,
  onSelectTransaction,
  isLoading = false,
  isBangla = false,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return <ShoppingCart className="h-4 w-4" />;
      case "purchase":
        return <Truck className="h-4 w-4" />;
      case "expense":
        return <Receipt className="h-4 w-4" />;
      case "income":
        return <TrendingUp className="h-4 w-4" />;
      case "deposit":
        return <ArrowDownCircle className="h-4 w-4" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "payroll":
        return <Users className="h-4 w-4" />;
      case "loan":
        return <Coins className="h-4 w-4" />;
      default:
        return <ArrowDownLeft className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
              <th className="py-3 px-4">{isBangla ? "বিবরণ (Description)" : "Description"}</th>
              <th className="py-3 px-4">{isBangla ? "টাইপ" : "Type"}</th>
              <th className="py-3 px-4">{isBangla ? "উৎস" : "Source"}</th>
              <th className="py-3 px-4">{isBangla ? "শাখা" : "Branch"}</th>
              <th className="py-3 px-4">{isBangla ? "সময়" : "Date & Time"}</th>
              <th className="py-3 px-4 text-right">{isBangla ? "পরিমাণ" : "Amount"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;

              return (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-muted/40 transition-colors group cursor-pointer"
                >
                  {/* Icon & Description */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-105",
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        )}
                      >
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {tx.description}
                        </p>
                        {tx.customerOrSupplierName && (
                          <p className="text-[10.5px] text-muted-foreground">
                            {tx.customerOrSupplierName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <TransactionTypeBadge type={tx.type} isBangla={isBangla} />
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <AutoManualBadge isAuto={tx.isAuto} isBangla={isBangla} />
                  </td>

                  {/* Branch */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-muted-foreground/70" />
                      <span>{tx.branchName}</span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                    {tx.timestamp}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold">
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

      {/* MOBILE STACKED CARDS VIEW */}
      <div className="block md:hidden divide-y divide-border/30">
        {transactions.map((tx) => {
          const isPositive = tx.amount > 0;

          return (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="p-4 space-y-2.5 hover:bg-muted/30 transition-colors cursor-pointer active:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border",
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    )}
                  >
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {tx.description}
                    </p>
                    <p className="text-[10.5px] text-muted-foreground font-mono mt-0.5">
                      {tx.timestamp} • {tx.branchName}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      "font-mono font-bold text-xs",
                      isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {isPositive ? "+" : ""}৳{tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <TransactionTypeBadge type={tx.type} isBangla={isBangla} />
                  <AutoManualBadge isAuto={tx.isAuto} isBangla={isBangla} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
