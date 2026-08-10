"use client";

import React from "react";
import { Button } from "@/components/ui/premium";
import { Landmark, ShoppingCart, MinusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyFinanceStateProps {
  onAddExpenseClick?: () => void;
  isBangla?: boolean;
}

export function EmptyFinanceState({
  onAddExpenseClick,
  isBangla = false,
}: EmptyFinanceStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
        <Landmark className="h-8 w-8" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          {isBangla ? "এখনও কোনো অর্থ লেনদেন হয়নি" : "No money movement yet"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "আপনার প্রথম বিক্রি সম্পন্ন করুন অথবা ব্যবসার খরচ এন্ট্রি দিয়ে হিসাব ট্র্যাকিং শুরু করুন।"
            : "Record your first sale or add your first expense to start tracking your business finances."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onAddExpenseClick}
          className="rounded-xl text-xs font-medium"
        >
          <MinusCircle className="h-4 w-4 mr-2 text-rose-500" />
          {isBangla ? "খরচ এন্ট্রি দিন" : "Add Expense"}
        </Button>

        <Link href="/sales/new">
          <Button type="button" className="rounded-xl text-xs font-medium">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isBangla ? "POS চালু করুন" : "Open POS"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
