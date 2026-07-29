"use client";

import React from "react";
import { format } from "date-fns";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  SlidersHorizontal,
  RotateCcw,
  PackageCheck,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export interface MovementItem {
  id: string;
  type: "sale" | "adjustment" | "purchase" | "return" | "stock_in" | string;
  quantity: number;
  remainingAfter?: number;
  date: string;
  reference?: string;
  user?: string;
  notes?: string;
}

interface MovementTimelineProps {
  movements: MovementItem[];
  unit?: string;
  className?: string;
}

export function MovementTimeline({
  movements,
  unit = "units",
  className,
}: MovementTimelineProps) {
  const { isBangla } = useAppTranslation();

  if (!movements || movements.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
        <History className="h-8 w-8 mx-auto opacity-40 text-muted-foreground" />
        <p>{isBangla ? "কোনো মুভমেন্ট ইতিহাস নেই" : "No stock movement history recorded."}</p>
      </div>
    );
  }

  const getMovementMeta = (type: string) => {
    switch (type.toLowerCase()) {
      case "sale":
        return {
          icon: <ArrowDownCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
          bg: "bg-blue-500/10 border-blue-500/20",
          label: isBangla ? "বিক্রয়" : "Sale",
        };
      case "adjustment":
        return {
          icon: <SlidersHorizontal className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
          bg: "bg-purple-500/10 border-purple-500/20",
          label: isBangla ? "সংশোধন" : "Adjustment",
        };
      case "purchase":
      case "stock_in":
        return {
          icon: <ArrowUpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
          bg: "bg-emerald-500/10 border-emerald-500/20",
          label: isBangla ? "স্টক ইন" : "Stock In",
        };
      case "return":
        return {
          icon: <RotateCcw className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
          bg: "bg-amber-500/10 border-amber-500/20",
          label: isBangla ? "ফেরত" : "Return",
        };
      default:
        return {
          icon: <PackageCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
          bg: "bg-slate-500/10 border-slate-500/20",
          label: type,
        };
    }
  };

  return (
    <div className={cn("relative pl-4 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60", className)}>
      {movements.map((item, idx) => {
        const meta = getMovementMeta(item.type);
        const formattedDate = item.date
          ? format(new Date(item.date), "dd MMM yyyy, hh:mm a")
          : "—";

        const isPositive = item.quantity > 0;
        const qtyFormatted = `${isPositive ? "+" : ""}${item.quantity} ${unit}`;

        return (
          <div key={item.id || idx} className="relative flex items-start gap-3 text-xs">
            {/* Timeline Icon Node */}
            <div
              className={cn(
                "relative z-10 h-6 w-6 rounded-full flex items-center justify-center shrink-0 border -ml-7 bg-background shadow-xs",
                meta.bg
              )}
            >
              {meta.icon}
            </div>

            {/* Content card */}
            <div className="flex-1 rounded-lg border border-border/50 bg-card/60 p-2.5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{meta.label}</span>
                <span
                  className={cn(
                    "font-mono font-bold text-xs",
                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {qtyFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{formattedDate}</span>
                {item.remainingAfter != null && (
                  <span className="font-mono">
                    {isBangla ? "অবশিষ্ট: " : "Remaining: "}{item.remainingAfter} {unit}
                  </span>
                )}
              </div>

              {item.reference && (
                <div className="text-[10px] font-mono text-muted-foreground/80">
                  Ref: {item.reference}
                </div>
              )}

              {item.notes && (
                <div className="text-[11px] text-muted-foreground italic bg-muted/30 p-1.5 rounded mt-1">
                  "{item.notes}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
