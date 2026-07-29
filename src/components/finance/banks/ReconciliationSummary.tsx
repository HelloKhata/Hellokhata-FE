"use client";

import React from "react";
import { ReconciliationSummaryData } from "@/types/bank";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReconciliationSummaryProps {
  summary: ReconciliationSummaryData;
  onCompleteReconciliation: () => void;
  isBangla?: boolean;
}

export function ReconciliationSummary({
  summary,
  onCompleteReconciliation,
  isBangla = false,
}: ReconciliationSummaryProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-md space-y-3 sticky bottom-3 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              {isBangla ? "মিলকরণ সামারি (Reconciliation Summary)" : "Reconciliation Summary"}
            </h4>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {summary.completionPercentage}% Complete
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {summary.matchedCount} of {summary.totalLines} statement lines reconciled
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <Progress value={summary.completionPercentage} className="h-2" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Counts Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-lg">
            <span className="text-muted-foreground block text-[10px]">Matched</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              {summary.matchedCount} Lines
            </strong>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded-lg">
            <span className="text-muted-foreground block text-[10px]">Pending</span>
            <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs">
              {summary.pendingCount} Lines
            </strong>
          </div>

          <div className="bg-muted/30 border border-border/50 p-2 rounded-lg">
            <span className="text-muted-foreground block text-[10px]">Ignored</span>
            <strong className="text-muted-foreground font-mono text-xs">
              {summary.ignoredCount} Lines
            </strong>
          </div>

          <div className="bg-background/50 border border-border/60 p-2 rounded-lg">
            <span className="text-muted-foreground block text-[10px]">Difference</span>
            <strong
              className={cn(
                "font-mono text-xs font-bold",
                summary.differenceAmount === 0 ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {formatCurrency(summary.differenceAmount)}
            </strong>
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          type="button"
          onClick={onCompleteReconciliation}
          className="h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer shadow-xs shrink-0 rounded-lg"
        >
          <span>{isBangla ? "মিলকরণ সম্পন্ন করুন" : "Complete Reconciliation"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
