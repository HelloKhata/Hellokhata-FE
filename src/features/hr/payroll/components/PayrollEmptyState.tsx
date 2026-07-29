"use client";

import React from "react";
import { DollarSign, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayrollEmptyStateProps {
  onRunPayroll: () => void;
  isBangla?: boolean;
}

export function PayrollEmptyState({
  onRunPayroll,
  isBangla = false,
}: PayrollEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs my-4 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <DollarSign className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {isBangla ? "কোনো পে-রোল রান পাওয়া যায়নি" : "No payroll runs found."}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "চলতি মাসের জন্য প্রথম পে-রোল প্রসেস ও হিসাব শুরু করুন।"
            : "Start a monthly payroll run to compute salaries, overtime, and generate Finance transactions."}
        </p>
      </div>

      <Button
        type="button"
        onClick={onRunPayroll}
        className="h-9 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs rounded-lg"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        <span>{isBangla ? "পে-রোল রান করুন" : "Run Payroll"}</span>
      </Button>
    </div>
  );
}
