"use client";

import React from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayableEmptyStateProps {
  onActionClick?: () => void;
  isBangla?: boolean;
}

export function PayableEmptyState({
  onActionClick,
  isBangla = false,
}: PayableEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 text-center space-y-4 shadow-2xs my-2 flex flex-col items-center justify-center min-h-[260px]">
      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-xs">
        <CreditCard className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {isBangla ? "কোনো সরবরাহকারী বিল পাওয়া যায়নি" : "No supplier bills found"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "ক্রয় চালানের বিল এবং ম্যানুয়াল ইনভয়েস এন্ট্রিগুলো স্বয়ংক্রিয়ভাবে এখানে প্রদর্শন করা হবে।"
            : "Supplier bills from purchases and manual entries will automatically appear here."}
        </p>
      </div>

      {onActionClick && (
        <Button
          type="button"
          onClick={onActionClick}
          className="h-9 px-4 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? "নতুন বিল তৈরি করুন" : "Create First Bill"}</span>
        </Button>
      )}
    </div>
  );
}
