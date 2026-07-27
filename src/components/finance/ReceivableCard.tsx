"use client";

import React from "react";
import { ReceivableSummary } from "@/types/finance";
import { Button } from "@/components/ui/premium";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, AlertCircle, Users } from "lucide-react";
import Link from "next/link";

interface ReceivableCardProps {
  data: ReceivableSummary;
  onViewClick?: () => void;
  isBangla?: boolean;
}

export function ReceivableCard({
  data,
  onViewClick,
  isBangla = false,
}: ReceivableCardProps) {
  const { totalAmount, overdueCount, pendingInvoicesCount } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {isBangla ? "প্রাপ্য হিসাব (Receivables)" : "Receivables"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? "গ্রাহকদের কাছে পাওনা টাকা" : "Customers owe you"}
            </p>
          </div>
        </div>

        {overdueCount > 0 && (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] flex items-center gap-1 shrink-0"
          >
            <AlertCircle className="h-3 w-3" />
            {isBangla ? `${overdueCount} টি ওভারডিউ` : `${overdueCount} overdue`}
          </Badge>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
          ৳{totalAmount.toLocaleString()}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          {isBangla
            ? `${pendingInvoicesCount} টি বাকি ইনভয়েসের বিপরীতে পাওনা`
            : `Across ${pendingInvoicesCount} pending customer invoices`}
        </p>
      </div>

      <div className="pt-3 border-t border-border/40">
        <Link href="/finance/receivables" onClick={onViewClick}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-xl text-xs font-medium justify-between group"
          >
            <span>{isBangla ? "প্রাপ্য হিসাব দেখুন" : "View Receivables"}</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
