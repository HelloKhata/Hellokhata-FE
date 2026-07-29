"use client";

import React from "react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Clock, ShieldAlert } from "lucide-react";

interface AgingBreakdownData {
  current: number;
  days30: number;
  days60: number;
  days90: number;
}

interface ReceivableAgingChartProps {
  data: AgingBreakdownData;
  isBangla?: boolean;
}

export function ReceivableAgingChart({
  data,
  isBangla = false,
}: ReceivableAgingChartProps) {
  const { formatCurrency } = useCurrency();

  const total = data.current + data.days30 + data.days60 + data.days90 || 1;

  const currentPct = Math.round((data.current / total) * 100);
  const days30Pct = Math.round((data.days30 / total) * 100);
  const days60Pct = Math.round((data.days60 / total) * 100);
  const days90Pct = Math.min(100, 100 - (currentPct + days30Pct + days60Pct));

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              {isBangla ? "মেয়াদ উত্তীর্ণ ওভারভিউ (Aging Overview)" : "Aging Overview"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? "পাওনা টাকার সময়সীমার বিশ্লেষণ" : "Outstanding balance distribution by age"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-semibold text-muted-foreground">
          {isBangla ? "সর্বমোট: " : "Total: "}
          <strong className="text-foreground">{formatCurrency(total)}</strong>
        </span>
      </div>

      {/* Horizontal Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-muted/50 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-border/40">
          {data.current > 0 && (
            <div
              style={{ width: `${currentPct}%` }}
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
              title={`Current: ${formatCurrency(data.current)} (${currentPct}%)`}
            />
          )}
          {data.days30 > 0 && (
            <div
              style={{ width: `${days30Pct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`30+ Days: ${formatCurrency(data.days30)} (${days30Pct}%)`}
            />
          )}
          {data.days60 > 0 && (
            <div
              style={{ width: `${days60Pct}%` }}
              className="bg-orange-500 h-full transition-all duration-500"
              title={`60+ Days: ${formatCurrency(data.days60)} (${days60Pct}%)`}
            />
          )}
          {data.days90 > 0 && (
            <div
              style={{ width: `${days90Pct}%` }}
              className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
              title={`90+ Days: ${formatCurrency(data.days90)} (${days90Pct}%)`}
            />
          )}
        </div>
      </div>

      {/* Bucket Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
        {/* Bucket 1: Current */}
        <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>{isBangla ? "চলতি (Current)" : "Current"}</span>
            <span className="font-mono text-[10px]">{currentPct}%</span>
          </div>
          <p className="font-bold font-mono text-foreground text-sm">
            {formatCurrency(data.current)}
          </p>
        </div>

        {/* Bucket 2: 30+ Days */}
        <div className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span>{isBangla ? "৩০+ দিন" : "30+ Days"}</span>
            <span className="font-mono text-[10px]">{days30Pct}%</span>
          </div>
          <p className="font-bold font-mono text-foreground text-sm">
            {formatCurrency(data.days30)}
          </p>
        </div>

        {/* Bucket 3: 60+ Days */}
        <div className="p-2.5 rounded-lg border border-orange-500/20 bg-orange-500/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-orange-600 dark:text-orange-400">
            <span>{isBangla ? "৬০+ দিন" : "60+ Days"}</span>
            <span className="font-mono text-[10px]">{days60Pct}%</span>
          </div>
          <p className="font-bold font-mono text-foreground text-sm">
            {formatCurrency(data.days60)}
          </p>
        </div>

        {/* Bucket 4: 90+ Days */}
        <div className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <span>{isBangla ? "৯০+ দিন" : "90+ Days"}</span>
            <span className="font-mono text-[10px]">{days90Pct}%</span>
          </div>
          <p className="font-bold font-mono text-foreground text-sm">
            {formatCurrency(data.days90)}
          </p>
        </div>
      </div>
    </div>
  );
}
