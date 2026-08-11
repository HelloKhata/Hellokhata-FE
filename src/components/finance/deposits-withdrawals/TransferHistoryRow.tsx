"use client";

import React, { memo } from "react";
import { TransferRecord } from "@/types/transfer";
import { ArrowDownLeft, ArrowUpRight, Building2, Calendar, FileText } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TransferHistoryRowProps {
  record: TransferRecord;
  isBangla?: boolean;
}

export const TransferHistoryRow = memo(function TransferHistoryRow({
  record,
  isBangla = false,
}: TransferHistoryRowProps) {
  const { formatCurrency } = useCurrency();
  const isDeposit = record.type === "deposit";

  const formattedDate = (() => {
    try {
      if (record.date === new Date().toISOString().split("T")[0]) {
        return isBangla ? "আজ" : "Today";
      }
      return format(parseISO(record.date), "dd MMM yyyy");
    } catch {
      return record.date;
    }
  })();

  return (
    <tr className="hover:bg-muted/15 transition-colors border-b border-border/50 text-xs">
      {/* Type & Icon */}
      <td className="px-4 py-3 font-medium align-middle">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
              isDeposit
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            )}
          >
            {isDeposit ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          </div>
          <span
            className={cn(
              "font-bold text-[11px] uppercase tracking-wider",
              isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isDeposit
              ? isBangla
                ? "জমা"
                : "Deposit"
              : isBangla
              ? "উত্তোলন"
              : "Withdrawal"}
          </span>
        </div>
      </td>

      {/* Account */}
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <span className="text-sm">{record.accountIcon}</span>
          <span className="truncate max-w-[140px]">{record.accountName}</span>
        </div>
      </td>

      {/* Branch */}
      <td className="px-4 py-3 align-middle text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate max-w-[110px]">{record.branchName}</span>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3 align-middle text-muted-foreground whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </td>

      {/* Memo */}
      <td className="px-4 py-3 align-middle text-muted-foreground max-w-[180px]">
        {record.memo ? (
          <p className="truncate text-foreground/90 italic" title={record.memo}>
            "{record.memo}"
          </p>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Amount */}
      <td className="px-4 py-3 align-middle text-right font-bold font-mono text-sm whitespace-nowrap">
        <span
          className={cn(
            isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}
        >
          {isDeposit ? "+" : "-"}{formatCurrency(record.amount)}
        </span>
      </td>
    </tr>
  );
});

export const TransferHistoryCard = memo(function TransferHistoryCard({
  record,
  isBangla = false,
}: TransferHistoryRowProps) {
  const { formatCurrency } = useCurrency();
  const isDeposit = record.type === "deposit";

  const formattedDate = (() => {
    try {
      if (record.date === new Date().toISOString().split("T")[0]) {
        return isBangla ? "আজ" : "Today";
      }
      return format(parseISO(record.date), "dd MMM yyyy");
    } catch {
      return record.date;
    }
  })();

  return (
    <div className="p-3.5 bg-card border border-border/70 rounded-xl space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
              isDeposit
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            )}
          >
            {isDeposit ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          </div>
          <div>
            <span
              className={cn(
                "font-bold text-[11px] uppercase tracking-wider block leading-none",
                isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isDeposit
                ? isBangla
                  ? "জমা"
                  : "Deposit"
                : isBangla
                ? "উত্তোলন"
                : "Withdrawal"}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground mt-0.5">
              <span>{record.accountIcon}</span>
              <span>{record.accountName}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "font-bold font-mono text-sm block",
              isDeposit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isDeposit ? "+" : "-"}{formatCurrency(record.amount)}
          </span>
          <span className="text-[10px] text-muted-foreground">{formattedDate}</span>
        </div>
      </div>

      {(record.memo || record.branchName) && (
        <div className="pt-2 border-t border-border/40 text-[11px] flex items-center justify-between text-muted-foreground gap-2">
          <span className="flex items-center gap-1 text-[10px] bg-muted/40 px-2 py-0.5 rounded border border-border/40">
            <Building2 className="h-2.5 w-2.5" />
            {record.branchName}
          </span>
          {record.memo && (
            <span className="truncate italic text-foreground/80 max-w-[180px]">
              "{record.memo}"
            </span>
          )}
        </div>
      )}
    </div>
  );
});
