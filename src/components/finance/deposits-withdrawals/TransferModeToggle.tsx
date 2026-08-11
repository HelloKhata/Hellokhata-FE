"use client";

import React from "react";
import { TransferMode } from "@/types/transfer";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferModeToggleProps {
  mode: TransferMode;
  onChange: (mode: TransferMode) => void;
  isBangla?: boolean;
}

export function TransferModeToggle({
  mode,
  onChange,
  isBangla = false,
}: TransferModeToggleProps) {
  return (
    <div className="bg-muted/40 p-1 rounded-xl flex items-center border border-border/60 gap-1 w-full">
      {/* Deposit Button */}
      <button
        type="button"
        onClick={() => onChange("deposit")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          mode === "deposit"
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
      >
        <ArrowDownLeft className={cn("h-4 w-4", mode === "deposit" ? "text-emerald-500" : "text-muted-foreground")} />
        <span>{isBangla ? "জমা (Deposit)" : "Deposit"}</span>
      </button>

      {/* Withdrawal Button */}
      <button
        type="button"
        onClick={() => onChange("withdrawal")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          mode === "withdrawal"
            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
      >
        <ArrowUpRight className={cn("h-4 w-4", mode === "withdrawal" ? "text-rose-500" : "text-muted-foreground")} />
        <span>{isBangla ? "উত্তোলন (Withdrawal)" : "Withdrawal"}</span>
      </button>
    </div>
  );
}
