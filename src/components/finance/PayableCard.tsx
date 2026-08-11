"use client";

import React from "react";
import { PayableSummary } from "@/types/finance";
import { Button } from "@/components/ui/premium";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, Truck } from "lucide-react";
import Link from "next/link";

interface PayableCardProps {
  data: PayableSummary;
  onViewClick?: () => void;
  isBangla?: boolean;
}

export function PayableCard({
  data,
  onViewClick,
  isBangla = false,
}: PayableCardProps) {
  const { totalAmount, dueCount, pendingBillsCount } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-border transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {isBangla ? "প্রদেয় হিসাব (Payables)" : "Payables"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? "সাপ্লায়ারদের দেনা টাকা" : "You owe suppliers"}
            </p>
          </div>
        </div>

        {dueCount > 0 && (
          <Badge
            variant="outline"
            className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] flex items-center gap-1 shrink-0"
          >
            <Clock className="h-3 w-3" />
            {isBangla ? `${dueCount} টি বিল বকেয়া` : `${dueCount} bills due`}
          </Badge>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
          ৳{totalAmount.toLocaleString()}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          {isBangla
            ? `${pendingBillsCount} টি সাপ্লায়ার বিলের বকেয়া পরিশোধ বাকি`
            : `Across ${pendingBillsCount} pending supplier bills`}
        </p>
      </div>

      <div className="pt-3 border-t border-border/40">
        <Link href="/finance/payables" onClick={onViewClick}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-xl text-xs font-medium justify-between group"
          >
            <span>{isBangla ? "প্রদেয় হিসাব দেখুন" : "View Payables"}</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
