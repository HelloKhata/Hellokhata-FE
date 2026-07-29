"use client";

import React from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransferEmptyStateProps {
  onActionClick?: () => void;
  isBangla?: boolean;
}

export function TransferEmptyState({
  onActionClick,
  isBangla = false,
}: TransferEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 text-center space-y-4 shadow-2xs my-2 flex flex-col items-center justify-center min-h-[260px]">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <ArrowLeftRight className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {isBangla ? "কোনো ট্রান্সফার পাওয়া যায়নি" : "No transfers recorded yet"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "আপনার ক্যাশ, ব্যাংক বা ওয়ালেট অ্যাকাউন্টের মধ্যে টাকা জমা বা উত্তোলন পরিচালনা করুন।"
            : "Move money between your cash, bank, and wallet accounts to keep your balances up to date."}
        </p>
      </div>

      {onActionClick && (
        <Button
          type="button"
          onClick={onActionClick}
          className="h-9 px-4 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? "নতুন ট্রান্সফার করুন" : "Create First Transfer"}</span>
        </Button>
      )}
    </div>
  );
}
