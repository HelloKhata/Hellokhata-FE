"use client";

import React, { memo } from "react";
import { StatementLine, RecordedTransaction } from "@/types/bank";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useAppTranslation";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Split,
  GitMerge,
  RotateCcw,
  Building2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReconciliationWorkspaceProps {
  statementLines: StatementLine[];
  recordedTransactions: RecordedTransaction[];
  onSelectLineForDrawer: (line: StatementLine, txn: RecordedTransaction | null) => void;
  onMatch: (lineId: string, txnId: string) => void;
  onIgnore: (lineId: string) => void;
  onUndo: (lineId: string) => void;
  isBangla?: boolean;
}

export function ReconciliationWorkspace({
  statementLines,
  recordedTransactions,
  onSelectLineForDrawer,
  onMatch,
  onIgnore,
  onUndo,
  isBangla = false,
}: ReconciliationWorkspaceProps) {
  const { formatCurrency } = useCurrency();

  const getTxnById = (id?: string) => {
    if (!id) return null;
    return recordedTransactions.find((t) => t.id === id) || null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {isBangla ? "মিলকরণ ওয়ার্কস্পেস (Reconciliation Workspace)" : "Reconciliation Workspace"}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBangla
              ? "বামপাশের ব্যাংক স্টেটমেন্ট লাইনের সাথে ডানপাশের রেকর্ডকৃত লেনদেনের মিল খুঁজুন।"
              : "Compare imported bank/wallet statement lines on the left with HelloKhata transactions on the right."}
          </p>
        </div>
      </div>

      {/* 2-Column Matcher Grid Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column Header */}
        <div className="bg-muted/30 border border-border/70 rounded-t-lg p-2.5 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Imported Bank Statement Lines
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {statementLines.length} Lines
          </span>
        </div>

        {/* Right Column Header */}
        <div className="hidden md:flex bg-muted/30 border border-border/70 rounded-t-lg p-2.5 items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            HelloKhata Transactions
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {recordedTransactions.length} Transactions
          </span>
        </div>
      </div>

      {/* 2-Column Match Rows List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-0.5">
        {statementLines.map((line) => {
          const suggestedTxn = getTxnById(line.suggestedTransactionId || line.matchedTransactionId);
          const isMatched = line.status === "matched";
          const isIgnored = line.status === "ignored";

          return (
            <div
              key={line.id}
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl border transition-all text-xs",
                isMatched
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : isIgnored
                  ? "bg-muted/20 border-border/40 opacity-70"
                  : "bg-background/60 border-border/80 hover:border-primary/40"
              )}
            >
              {/* Left Side: Statement Line Details */}
              <div className="space-y-1.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {line.date} {line.reference ? `• Ref: ${line.reference}` : ""}
                    </span>
                    <span
                      className={cn(
                        "font-bold font-mono text-xs",
                        line.type === "credit"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {line.type === "credit" ? "+" : "-"}
                      {formatCurrency(Math.abs(line.amount))}
                    </span>
                  </div>

                  <h4 className="font-bold text-foreground text-xs leading-snug">
                    {line.description}
                  </h4>
                </div>

                {/* Auto Match Suggestion Badge */}
                {line.matchScore && !isMatched && !isIgnored && (
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold w-fit">
                    <Sparkles className="h-3 w-3" />
                    <span>Suggested Match ({line.matchScore}%)</span>
                  </div>
                )}
              </div>

              {/* Right Side: HelloKhata Transaction & Actions */}
              <div className="space-y-2 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border/50 pt-2 md:pt-0 md:pl-3">
                {suggestedTxn ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground text-xs leading-snug">
                        {suggestedTxn.title}
                      </h4>
                      <span className="font-bold font-mono text-xs text-foreground">
                        {formatCurrency(suggestedTxn.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Building2 className="h-2.5 w-2.5" /> {suggestedTxn.branchName}
                      </span>
                      <span className="font-mono">{suggestedTxn.date}</span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1">
                        {suggestedTxn.source}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-muted/20 rounded text-[11px] text-muted-foreground italic">
                    No matching HelloKhata transaction found
                  </div>
                )}

                {/* Row Action Buttons */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <div className="flex items-center gap-1">
                    {!isMatched && !isIgnored && suggestedTxn && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onMatch(line.id, suggestedTxn.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Match</span>
                      </Button>
                    )}

                    {isMatched && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Matched
                      </Badge>
                    )}

                    {isIgnored && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Ignored
                      </Badge>
                    )}

                    {(isMatched || isIgnored) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onUndo(line.id)}
                        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Undo</span>
                      </Button>
                    )}
                  </div>

                  {/* Drawer Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSelectLineForDrawer(line, suggestedTxn)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="View match details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
