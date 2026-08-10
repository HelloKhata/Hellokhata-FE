"use client";

import React from "react";
import { Button } from "@/components/ui/premium";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

interface EmptyMoneyStateProps {
  mode: "income" | "expense";
  onAddFirstClick?: () => void;
  isBangla?: boolean;
}

export function EmptyMoneyState({
  mode,
  onAddFirstClick,
  isBangla = false,
}: EmptyMoneyStateProps) {
  const isIncome = mode === "income";

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center flex flex-col items-center justify-center space-y-3 my-2">
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 ${
          isIncome
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
        }`}
      >
        {isIncome ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
      </div>

      <div className="max-w-xs space-y-1">
        <h4 className="text-sm font-bold text-foreground">
          {isIncome
            ? isBangla ? "কোনো আয় এন্ট্রি পাওয়া যায়নি" : "No income recorded yet"
            : isBangla ? "কোনো খরচ এন্ট্রি পাওয়া যায়নি" : "No expenses recorded yet"}
        </h4>
        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
          {isIncome
            ? isBangla
              ? "অটোমেটিক সেলস ছাড়া অন্য সব অতিরিক্ত আয় এখানে ম্যানুয়ালি রেকর্ড করুন।"
              : "Record income that wasn't generated automatically by your business operations."
            : isBangla
              ? "ব্যবসার দৈনন্দিন সব ব্যয় রেকর্ড করে ক্যাশ ফ্লো ট্র্যাক করুন।"
              : "Track your business expenses to understand where your money goes."}
        </p>
      </div>

      {onAddFirstClick && (
        <Button
          type="button"
          size="sm"
          onClick={onAddFirstClick}
          className="rounded-xl text-xs font-medium mt-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {isBangla ? "প্রথম এন্ট্রি দিন" : "Add First Entry"}
        </Button>
      )}
    </div>
  );
}
