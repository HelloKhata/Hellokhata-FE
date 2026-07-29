"use client";

import React from "react";
import { StatementLine, RecordedTransaction } from "@/types/bank";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useAppTranslation";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Sparkles,
  History,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchingDetailsDrawerProps {
  statementLine: StatementLine | null;
  matchedTransaction: RecordedTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmMatch: (lineId: string, txnId: string) => void;
  onIgnoreMatch: (lineId: string) => void;
  isBangla?: boolean;
}

export function MatchingDetailsDrawer({
  statementLine,
  matchedTransaction,
  isOpen,
  onClose,
  onConfirmMatch,
  onIgnoreMatch,
  isBangla = false,
}: MatchingDetailsDrawerProps) {
  const { formatCurrency } = useCurrency();

  if (!statementLine) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-foreground text-left">
                  {isBangla ? "মিলকরণ বিবরণ" : "Reconciliation Match Details"}
                </SheetTitle>
                <SheetDescription className="text-[10px] text-muted-foreground text-left font-mono">
                  Line ID: {statementLine.id}
                </SheetDescription>
              </div>
            </div>

            {statementLine.matchScore && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold">
                <Sparkles className="h-3 w-3 mr-1" /> {statementLine.matchScore}% Match
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Imported Statement Line Card */}
          <div className="bg-background/60 border border-border/80 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block border-b border-border/50 pb-1">
              Imported Bank Statement Line
            </span>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-foreground text-xs leading-snug">
                  {statementLine.description}
                </h4>
                <span
                  className={cn(
                    "font-bold font-mono text-sm ml-2",
                    statementLine.type === "credit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {statementLine.type === "credit" ? "+" : "-"}
                  {formatCurrency(Math.abs(statementLine.amount))}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                <span>Date: {statementLine.date}</span>
                {statementLine.reference && <span>Ref: {statementLine.reference}</span>}
              </div>
            </div>
          </div>

          {/* HelloKhata Recorded Transaction Card */}
          {matchedTransaction ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block border-b border-primary/10 pb-1">
                Suggested HelloKhata Transaction
              </span>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-foreground text-xs leading-snug">
                    {matchedTransaction.title}
                  </h4>
                  <span className="font-bold font-mono text-sm text-foreground ml-2">
                    {formatCurrency(matchedTransaction.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {matchedTransaction.branchName}
                  </span>
                  <span className="font-mono">Date: {matchedTransaction.date}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic p-3 bg-muted/20 rounded-lg text-center">
              No matching HelloKhata transaction found automatically.
            </p>
          )}

          {/* Reason for Suggestion */}
          {statementLine.matchReason && (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Match Suggestion Logic
              </span>
              <p className="text-xs text-foreground font-medium">
                "{statementLine.matchReason}"
              </p>
            </div>
          )}

          {/* Activity History */}
          <div className="space-y-2 pt-1 border-t border-border/60">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-primary" /> Activity Log
            </span>
            <div className="space-y-1 text-[11px] text-muted-foreground font-mono">
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>CSV Statement Imported</span>
                <span>Today</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>Auto-matcher confidence score: {statementLine.matchScore || 90}%</span>
                <span>System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex gap-2">
          {matchedTransaction && statementLine.status !== "matched" && (
            <Button
              type="button"
              onClick={() => {
                onConfirmMatch(statementLine.id, matchedTransaction.id);
                onClose();
              }}
              className="flex-1 h-9 font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm Match</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onIgnoreMatch(statementLine.id);
              onClose();
            }}
            className="h-9 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Ignore</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
