"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoanEmptyStateProps {
  onCheckEligibility?: () => void;
  isBangla?: boolean;
}

export function LoanEmptyState({
  onCheckEligibility,
  isBangla = false,
}: LoanEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 text-center space-y-4 shadow-2xs my-2 flex flex-col items-center justify-center min-h-[260px]">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <Sparkles className="h-7 w-7 animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {isBangla ? "কোনো লোন আবেদন শুরু হয়নি" : "No Loan Application Yet"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "হ্যালো খাতার লেনদেন ডাটা দিয়ে সহজে আপনার যোগ্যতার পরিমাণ যাঁচাই করে আবেদন সম্পন্ন করুন।"
            : "Check your eligibility and apply for a business loan directly from HelloKhata."}
        </p>
      </div>

      {onCheckEligibility && (
        <Button
          type="button"
          onClick={onCheckEligibility}
          className="h-9 px-4 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <span>{isBangla ? "যোগ্যতা যাঁচাই করুন" : "Check Eligibility"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
