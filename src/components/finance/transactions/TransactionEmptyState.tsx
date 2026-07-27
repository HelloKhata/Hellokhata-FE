"use client";

import React from "react";
import { Button } from "@/components/ui/premium";
import { ArrowLeftRight, FilterX, RotateCcw } from "lucide-react";

interface TransactionEmptyStateProps {
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  isBangla?: boolean;
}

export function TransactionEmptyState({
  hasActiveFilters = false,
  onClearFilters,
  isBangla = false,
}: TransactionEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
          <FilterX className="h-7 w-7" />
        </div>

        <div className="max-w-md space-y-1">
          <h3 className="text-base font-bold text-foreground">
            {isBangla ? "কোনো মেলানো লেনদেন পাওয়া যায়নি" : "No matching transactions found"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isBangla
              ? "আপনার ফিল্টার পরিবর্তন করুন বা ফিল্টার রিসেট করে আবার চেষ্টা করুন।"
              : "Try adjusting your search terms or clearing your active filters."}
          </p>
        </div>

        {onClearFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl text-xs font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {isBangla ? "ফিল্টার রিসেট করুন" : "Clear Filters"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
        <ArrowLeftRight className="h-7 w-7" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-foreground">
          {isBangla ? "কোনো লেনদেন পাওয়া যায়নি" : "No transactions found"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "ব্যবসার বিক্রয়, ক্রয়, ব্যয় বা অন্যান্য অর্থ আদান-প্রদান সম্পন্ন হলে এখানে স্বয়ংক্রিয়ভাবে লেনদেন তালিকা তৈরি হবে।"
            : "Financial activity will automatically appear here as your business records sales, purchases, expenses, and other money movements."}
        </p>
      </div>
    </div>
  );
}
